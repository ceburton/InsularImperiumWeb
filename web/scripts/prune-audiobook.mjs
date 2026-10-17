// Deletes old audiobook versions from Bunny Storage: v/<hash>/ folders that src/data/audiobook.json no
// longer uses and that are older than 30 days (podcast apps and cached pages may still point at newer ones).
// `npm run audio:prune -- --dry-run` lists what would be deleted.
import { readFile } from 'node:fs/promises';
import { list, remove } from './bunny-storage.mjs';

const keepDays = 30;
const dryRun = process.argv.includes('--dry-run');
const { chapters } = JSON.parse(await readFile(new URL('../src/data/audiobook.json', import.meta.url), 'utf8'));
const used = new Set(chapters.map(c => new URL(c.url).pathname.split('/')[2]));
const cutoff = Date.now() - keepDays * 86400000;

let count = 0;
for (const folder of await list('v/')) {
  if (!folder.IsDirectory || used.has(folder.ObjectName)) continue;
  // Bunny reports UTC times without a zone suffix; an unreadable date counts as new, never as old.
  const created = Date.parse(/Z|[+-]\d\d:?\d\d$/.test(folder.DateCreated) ? folder.DateCreated : folder.DateCreated + 'Z');
  if (!(created <= cutoff)) {
    console.log(`keep    v/${folder.ObjectName}/ (less than ${keepDays} days old)`);
    continue;
  }
  console.log(`${dryRun ? 'would delete' : 'delete'}  v/${folder.ObjectName}/`);
  if (!dryRun) await remove(`v/${folder.ObjectName}/`);
  count++;
}
console.log(`${count} old version${count === 1 ? '' : 's'} ${dryRun ? 'to delete' : 'deleted'}.`);
