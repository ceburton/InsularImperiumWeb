// Deletes old audiobook versions from Bunny Storage: <prefix><hash>/ folders (v/ for Book One, book2/v/ for
// Book Two) that the book's chapter list no longer uses and that are older than 30 days (podcast apps and cached
// pages may still point at newer ones). `npm run audio:prune -- --dry-run` lists what would be deleted;
// `-- --book 2` prunes one book.
import { readFile } from 'node:fs/promises';
import { selectedBooks } from './books.mjs';
import { list, remove } from './bunny-storage.mjs';

const keepDays = 30;
const dryRun = process.argv.includes('--dry-run');
const cutoff = Date.now() - keepDays * 86400000;

let count = 0;
for (const book of selectedBooks()) {
  const { chapters } = JSON.parse(await readFile(new URL(`../${book.dataFile}`, import.meta.url), 'utf8'));
  // The folder name of each URL in use, e.g. .../book2/v/1a2b3c4d/ch01.mp3 -> 1a2b3c4d
  const used = new Set(chapters.map(c => new URL(c.url).pathname.split('/').at(-2)));
  for (const folder of await list(book.bunnyPrefix)) {
    if (!folder.IsDirectory || used.has(folder.ObjectName)) continue;
    // Bunny reports UTC times without a zone suffix; an unreadable date counts as new, never as old.
    const created = Date.parse(/Z|[+-]\d\d:?\d\d$/.test(folder.DateCreated) ? folder.DateCreated : folder.DateCreated + 'Z');
    if (!(created <= cutoff)) {
      console.log(`keep    ${book.bunnyPrefix}${folder.ObjectName}/ (less than ${keepDays} days old)`);
      continue;
    }
    console.log(`${dryRun ? 'would delete' : 'delete'}  ${book.bunnyPrefix}${folder.ObjectName}/`);
    if (!dryRun) await remove(`${book.bunnyPrefix}${folder.ObjectName}/`);
    count++;
  }
}
console.log(`${count} old version${count === 1 ? '' : 's'} ${dryRun ? 'to delete' : 'deleted'}.`);
