// The two books, as the publishing scripts see them. Book One keeps its original paths: audiobook/ in the
// generator, src/data/audiobook.json here and v/<hash>/ on Bunny, so published URLs and podcast feeds never move.
import path from 'node:path';

export const storyBible = process.env.STORY_BIBLE || 'C:\\Users\\GameOn\\Projects\\GridGeneral\\documentation\\story-bible';
export const generator = process.env.AUDIOBOOK_GENERATOR || 'C:\\insular-imperium-audio';

export const books = [
  { number: 1, label: 'Book One', title: 'Insular Imperium', chapters: path.join(storyBible, 'chapters'),
    audioDir: process.env.AUDIOBOOK_DIR || path.join(generator, 'audiobook'), dataFile: 'src/data/audiobook.json',
    bunnyPrefix: 'v/', storyFile: 'public/stories/Insular-Imperium.md' },
  { number: 2, label: 'Book Two', title: 'Insular Imperium: Book Two', chapters: path.join(storyBible, 'chapters', 'book2'),
    audioDir: process.env.AUDIOBOOK_BOOK2_DIR || path.join(generator, 'audiobook-book2'), dataFile: 'src/data/audiobook-book2.json',
    bunnyPrefix: 'book2/v/', storyFile: 'public/stories/Insular-Imperium-Book-Two.md' },
];

// `--book 2` (or `--book=2`) picks one book; without it the scripts work on every book.
export function selectedBooks(argv = process.argv) {
  const i = argv.findIndex(a => a === '--book' || a.startsWith('--book='));
  if (i < 0) return books;
  const value = argv[i].includes('=') ? argv[i].split('=')[1] : argv[i + 1];
  const book = books.find(b => String(b.number) === value);
  if (!book) {
    console.error(`Unknown book "${value}". Use --book 1 or --book 2.`);
    process.exit(1);
  }
  return [book];
}
