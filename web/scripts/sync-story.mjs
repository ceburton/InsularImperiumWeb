// Rebuilds the reader's copy of each book (public/stories/*.md) from the story-bible chapter files:
// every chapters/ch*.md for Book One and chapters/book2/ch*.md for Book Two, in filename order, each cut at its
// **NEW CANON CANDIDATES** notes, with a contents list. It is the same text as GridGeneral's
// documentation/story/Insular-Imperium.md. Run with `npm run story:sync` (`-- --book 2` for one book;
// `-- --check` lists what would change and exits 1 if anything would).
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { selectedBooks } from './books.mjs';

const check = process.argv.includes('--check');
const web = new URL('..', import.meta.url);
const anchor = title => title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-');

async function compile(book) {
  if (!existsSync(book.chapters)) return null;
  const files = (await readdir(book.chapters)).filter(f => /^ch.*\.md$/.test(f)).sort();
  const parts = [];
  for (const f of files) {
    const md = (await readFile(path.join(book.chapters, f), 'utf8')).replace(/\r\n/g, '\n');
    parts.push(md.split(/\n\*\*NEW CANON CANDIDATES\*\*/)[0].trimEnd().replace(/\n---\s*$/, '').trimEnd());
  }
  const titles = parts.map(p => p.split('\n')[0].replace(/^# /, ''));
  const contents = titles.map((t, i) => `${i + 1}. [${t}](#${anchor(t)})`).join('\n');
  return { count: files.length, text: `# ${book.title}\n\n*All finished chapters, in reading order.*\n\n## Contents\n\n${contents}\n\n---\n\n${parts.join('\n\n---\n\n')}\n` };
}

let changed = 0;
for (const book of selectedBooks()) {
  const built = await compile(book);
  if (!built) { console.log(`${book.label}: no chapters folder at ${book.chapters}, skipped`); continue; }
  const file = new URL(book.storyFile, web);
  const old = await readFile(file, 'utf8').catch(() => '');
  if (old === built.text) { console.log(`${book.label}: ${built.count} chapter${built.count === 1 ? "" : "s"}, unchanged`); continue; }
  changed++;
  if (!check) await writeFile(file, built.text);
  console.log(`${book.label}: ${built.count} chapter${built.count === 1 ? "" : "s"}, ${check ? 'would update' : 'updated'} web/${book.storyFile}`);
}
if (check && changed) process.exit(1);
