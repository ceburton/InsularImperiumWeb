// One command after editing the story: lists the chapters whose narration changed, asks, re-renders them with
// the Kokoro generator, then uploads them with publish-audiobook.mjs. It stops before git, so you can listen to a
// changed chapter before committing src/data/audiobook.json. Run with `npm run audio:release` (`-- --yes` skips the question).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const generator = process.env.AUDIOBOOK_GENERATOR || 'C:\\insular-imperium-audio';
const audioDir = process.env.AUDIOBOOK_DIR || path.join(generator, 'audiobook');
const venvPython = path.join(generator, '.venv', 'Scripts', 'python.exe');
const python = existsSync(venvPython) ? venvPython : 'python';
const web = fileURLToPath(new URL('..', import.meta.url));

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

function run(command, args, cwd) {
  const { status, error } = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (error || status !== 0) fail(`${path.basename(command)} ${args.join(' ')} failed${error ? `: ${error.message}` : ` (exit ${status})`}.`);
}

if (!existsSync(path.join(generator, 'make_audiobook.py'))) fail(`No make_audiobook.py in ${generator}. Set AUDIOBOOK_GENERATOR to the generator folder.`);
if (readdirSync(audioDir).some(f => f.includes('.partial.'))) fail(`A render is in progress in ${audioDir} (found *.partial.* files). If none is running, delete those files and try again.`);

// 1. What would change.
const check = execFileSync(python, ['make_audiobook.py', '--check'], { cwd: generator, encoding: 'utf8' });
const stale = check.split(/\r?\n/).filter(l => l.startsWith('stale ')).map(l => l.slice(6));
console.log(stale.length ? `${stale.length} chapter(s) changed and will be re-rendered:\n  ${stale.join('\n  ')}` : 'No chapters changed; nothing to render.');
if (!process.argv.includes('--yes')) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(stale.length ? '\nRender and publish? (y/N) ' : '\nPublish anything not yet uploaded? (y/N) ');
  rl.close();
  if (!/^y/i.test(answer.trim())) fail('Stopped. Nothing was changed.');
}

// 2. Render (also records POV timings for any chapter that lacks them), 3. upload and rewrite audiobook.json.
if (stale.length) run(python, ['make_audiobook.py', '--cues'], generator);
run(process.execPath, ['--env-file=.env.local', 'scripts/publish-audiobook.mjs'], web);

// 4. Stop before going live.
console.log(`
Done. Nothing is live yet. To finish:
  1. Listen to a changed chapter in ${audioDir}${stale.length ? ` (e.g. ${stale[0]})` : ''}.
  2. git add web/src/data/audiobook.json && git commit -m "Update audiobook chapters" && git push
  3. Commit the generator too if make_audiobook.py changed (cd ${generator}).`);
