// Uploads the audiobook MP3s from the generator folder to Bunny Storage and writes each book's chapter list
// (src/data/audiobook.json for Book One, src/data/audiobook-book2.json for Book Two; see books.mjs).
// Each MP3 is stored at <prefix><first 8 hex of its SHA-256>/<chapter>.mp3 (prefix v/ for Book One, book2/v/ for
// Book Two), so a changed file gets a new URL and every URL can be cached forever. Unchanged files are skipped.
// Run with `npm run audio:publish` (every book) or `npm run audio:publish -- --book 2` (one book).
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createReadStream, existsSync } from 'node:fs';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { selectedBooks } from './books.mjs';
import { baseUrl, fail, list, upload } from './bunny-storage.mjs';

const readJson = (file, fallback) => readFile(file, 'utf8').then(JSON.parse, () => fallback);
const mb = bytes => `${(bytes / 1048576).toFixed(1)} MB`;
const today = new Date().toISOString().slice(0, 10);
const chosen = selectedBooks();

function sha256Of(file) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    createReadStream(file).on('data', d => hash.update(d)).on('end', () => resolve(hash.digest('hex'))).on('error', reject);
  });
}

function probe(file) {
  const { format } = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:format_tags=title', '-of', 'json', file], { encoding: 'utf8' }));
  return { title: format.tags?.title, duration: Math.round(Number(format.duration)) };
}

async function publish(book) {
  const dir = book.audioDir;
  const dataFile = new URL(`../${book.dataFile}`, import.meta.url);
  // Hashes and probe results per file (keyed by size + modified time) so repeat runs skip re-reading 850 MB.
  const cacheFile = path.join(dir, '.publish-cache.json');
  console.log(`\n${book.label} (${dir})`);
  if (!existsSync(path.join(dir, 'manifest.json'))) {
    // A book with nothing rendered yet is skipped when publishing every book, and is an error when asked for by name.
    if (chosen.length > 1) return console.log(`  nothing rendered yet (no manifest.json), skipped`);
    fail(`No manifest.json in ${dir}`);
  }
  if ((await readdir(dir)).some(f => f.includes('.partial.'))) fail(`A render is in progress in ${dir} (found *.partial.* files). Publish when it finishes.`);
  const manifest = await readJson(path.join(dir, 'manifest.json'), null);
  if (!manifest) fail(`Unreadable manifest.json in ${dir}`);

  const previous = await readJson(dataFile, { chapters: [] });
  const firstPublished = new Map(previous.chapters.map(c => [c.slug, c.firstPublished]));
  const cache = await readJson(cacheFile, {});
  const versions = new Set((await list(book.bunnyPrefix)).filter(o => o.IsDirectory).map(o => o.ObjectName));

  async function isUploaded(version, name, size) {
    if (!versions.has(version)) return false;
    return (await list(`${book.bunnyPrefix}${version}/`)).some(o => o.ObjectName === name && o.Length === size);
  }

  const chapters = [];
  let uploaded = 0;
  for (const [slug, { track, cues }] of Object.entries(manifest).sort((a, b) => a[1].track - b[1].track)) {
    const name = `${String(track).padStart(2, '0')} - ${slug}.mp3`;
    const file = path.join(dir, name);
    const { size, mtimeMs } = await stat(file).catch(() => fail(`Missing ${file} (listed in manifest.json)`));
    let info = cache[name];
    if (info?.size !== size || info.mtimeMs !== mtimeMs) info = cache[name] = { size, mtimeMs, sha256: await sha256Of(file), ...probe(file) };
    if (!info.title) fail(`${name} has no title tag`);

    const version = info.sha256.slice(0, 8);
    const key = `${book.bunnyPrefix}${version}/${slug}.mp3`;
    if (await isUploaded(version, `${slug}.mp3`, size)) {
      console.log(`ok      ${name}`);
    } else {
      const start = Date.now();
      process.stdout.write(`upload  ${name} (${mb(size)}) ... `);
      for (let attempt = 1; ; attempt++) {
        try { await upload(file, key, info.sha256, size); break; } catch (error) {
          if (attempt === 3) throw error;
          process.stdout.write(`retrying (${error.message}) ... `);
        }
      }
      console.log(`${Math.round((Date.now() - start) / 1000)}s`);
      uploaded++;
    }
    chapters.push({ track, slug, title: info.title, duration: info.duration, bytes: size, sha256: info.sha256, url: `${baseUrl}/${key}`, firstPublished: firstPublished.get(slug) || today, pov: cues || [] });
  }

  // Written only after every upload succeeded, so the site never points at a missing file.
  await writeFile(dataFile, JSON.stringify({ chapters }, null, 2) + '\n');
  await writeFile(cacheFile, JSON.stringify(cache, null, 2));
  const hours = chapters.reduce((s, c) => s + c.duration, 0) / 3600;
  console.log(`${chapters.length} chapters (${hours.toFixed(1)} h), ${uploaded} uploaded. Wrote web/${book.dataFile}.`);
}

for (const book of chosen) await publish(book);
console.log(`\nCommit ${chosen.map(b => `web/${b.dataFile}`).join(' and ')} and push to deploy.`);
