// One command after editing the story: refreshes the reader's copy of each book (sync-story.mjs), lists the
// chapters whose narration changed in either book, asks, re-renders them with the Kokoro generator, then uploads
// them with publish-audiobook.mjs. It stops before git, so you can listen to a changed chapter before committing.
// Run with `npm run audio:release` (`-- --yes` skips the question, `-- --book 2` works on Book Two only).
// Rendering goes through the generator's wsl\render.ps1 when it exists (torch can't load on Windows with
// Smart App Control on), otherwise through make_audiobook.py directly.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { books, generator, selectedBooks } from './books.mjs';

const venvPython = path.join(generator, '.venv', 'Scripts', 'python.exe');
const python = existsSync(venvPython) ? venvPython : 'python';
const wslRender = path.join(generator, 'wsl', 'render.ps1');
const web = fileURLToPath(new URL('..', import.meta.url));
const chosen = selectedBooks();
const one = chosen.length === 1 && books.length > 1 ? ['--book', String(chosen[0].number)] : [];

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

function run(command, args, cwd) {
  const { status, error } = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (error || status !== 0) fail(`${path.basename(command)} ${args.join(' ')} failed${error ? `: ${error.message}` : ` (exit ${status})`}.`);
}

if (!existsSync(path.join(generator, 'make_audiobook.py'))) fail(`No make_audiobook.py in ${generator}. Set AUDIOBOOK_GENERATOR to the generator folder.`);
for (const book of chosen) {
  if (existsSync(book.audioDir) && readdirSync(book.audioDir).some(f => f.includes('.partial.'))) fail(`A render is in progress in ${book.audioDir} (found *.partial.* files). If none is running, delete those files and try again.`);
}

// 1. The reader's text, so the site and the audiobook change together.
run(process.execPath, ['scripts/sync-story.mjs', ...one], web);

// 2. What would change.
const check = execFileSync(python, ['make_audiobook.py', '--check', ...one], { cwd: generator, encoding: 'utf8' });
const stale = check.split(/\r?\n/).filter(l => l.startsWith('stale ')).map(l => l.slice(6));
console.log(stale.length ? `\n${stale.length} chapter(s) changed and will be re-rendered:\n  ${stale.join('\n  ')}` : '\nNo chapters changed; nothing to render.');
if (!process.argv.includes('--yes')) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(stale.length ? '\nRender and publish? (y/N) ' : '\nPublish anything not yet uploaded? (y/N) ');
  rl.close();
  if (!/^y/i.test(answer.trim())) fail('Stopped. The reader files above may have changed; no audio was changed.');
}

// 3. Render, 4. upload and rewrite each book's chapter list.
if (stale.length) {
  if (process.platform === 'win32' && existsSync(wslRender)) run('powershell', ['-ExecutionPolicy', 'Bypass', '-File', wslRender, ...(one.length ? ['-Book', one[1]] : [])], generator);
  else run(python, ['make_audiobook.py', '--cues', ...one], generator);
}
run(process.execPath, ['--env-file=.env.local', 'scripts/publish-audiobook.mjs', ...one], web);

// 5. Stop before going live.
const files = chosen.flatMap(b => [`web/${b.storyFile}`, `web/${b.dataFile}`]).join(' ');
console.log(`
Done. Nothing is live yet. To finish:
  1. Listen to a changed chapter${stale.length ? ` (e.g. ${stale[0]})` : ''} in ${chosen.map(b => b.audioDir).join(' or ')}.
  2. git add ${files} && git commit -m "Update the story and audiobook" && git push
  3. Commit the generator too if make_audiobook.py changed (cd ${generator}).`);
