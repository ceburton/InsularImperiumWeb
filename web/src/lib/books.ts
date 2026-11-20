// The books on the site. Book One keeps its original URLs and storage keys, so links, podcast
// subscriptions and saved places from before Book Two still work.
import book1Audio from '@/data/audiobook.json';
import book2Audio from '@/data/audiobook-book2.json';
import book3Audio from '@/data/audiobook-book3.json';

// pov: [seconds, name] for each point-of-view switch, from the generator's manifest.json cues.
export type AudiobookChapter = Omit<(typeof book1Audio.chapters)[number], 'pov'> & { pov?: [number, string][] };

const site = 'https://www.insularimperium.com';

const shared = {
  author: 'Insular Imperium Team',
  email: 'info@insularimperium.com',
  narration: 'Narrated by an AI voice (Kokoro TTS).',
  // Fill in once each directory has accepted the feed; empty links are hidden.
  directories: { apple: '', spotify: '', pocketCasts: '' },
};

export const books = [
  {
    ...shared,
    id: 'book-one',
    number: 1,
    label: 'Book One',
    // The book's own title (CC-089); every book is "Insular Imperium: <subtitle>".
    subtitle: 'The Coward\'s Answer',
    title: 'Insular Imperium: The Coward\'s Answer',
    summary: 'The story behind Insular Imperium, read aloud chapter by chapter. The bells ring across Aeridor, a prince wakes in the Drowned Lantern, and a war for the islands begins.',
    storyFile: 'public/stories/Insular-Imperium.md',
    readerPath: '/media/story',
    audioPath: '/media/audiobook',
    readerKey: 'insular-reader-v2',
    // Keys used before the story was renamed from The Sunstone Saga; read once so saved progress carries over.
    legacyReaderKeys: ['sunstone-reader-v2', 'sunstone-reader-v1'],
    audioKey: 'insular-audiobook-v1',
    guidPrefix: 'insular-imperium-audiobook-',
    pageUrl: `${site}/media/audiobook`,
    feedUrl: `${site}/media/audiobook/feed.xml`,
    cover: `${site}/audiobook/cover-3000.jpg`,
    coverSmall: '/audiobook/cover-600.jpg',
    chapters: book1Audio.chapters as AudiobookChapter[],
  },
  {
    ...shared,
    id: 'book-two',
    number: 2,
    label: 'Book Two',
    subtitle: "The Heir's Promise",
    title: "Insular Imperium: The Heir's Promise",
    summary: 'The second book of Insular Imperium, read aloud chapter by chapter. After the Teeth, the quarter’s accounts come due at the Obsidian Spire.',
    storyFile: 'public/stories/Insular-Imperium-Book-Two.md',
    readerPath: '/media/story/book-two',
    audioPath: '/media/audiobook/book-two',
    readerKey: 'insular-reader-book2-v1',
    legacyReaderKeys: [] as string[],
    audioKey: 'insular-audiobook-book2-v1',
    guidPrefix: 'insular-imperium-book-two-audiobook-',
    pageUrl: `${site}/media/audiobook/book-two`,
    feedUrl: `${site}/media/audiobook/book-two/feed.xml`,
    cover: `${site}/audiobook/cover-3000.jpg`,
    coverSmall: '/audiobook/cover-600.jpg',
    chapters: book2Audio.chapters as AudiobookChapter[],
  },
  {
    ...shared,
    id: 'book-three',
    number: 3,
    label: 'Book Three',
    subtitle: "The King's Table",
    title: "Insular Imperium: The King's Table",
    summary: 'The third book of Insular Imperium, read aloud chapter by chapter as it is written. A crown waits in Aeridor, and a round table waits for the rulers who would sit at it as equals.',
    storyFile: 'public/stories/Insular-Imperium-Book-Three.md',
    readerPath: '/media/story/book-three',
    audioPath: '/media/audiobook/book-three',
    readerKey: 'insular-reader-book3-v1',
    legacyReaderKeys: [] as string[],
    audioKey: 'insular-audiobook-book3-v1',
    guidPrefix: 'insular-imperium-book-three-audiobook-',
    pageUrl: `${site}/media/audiobook/book-three`,
    feedUrl: `${site}/media/audiobook/book-three/feed.xml`,
    cover: `${site}/audiobook/cover-3000.jpg`,
    coverSmall: '/audiobook/cover-600.jpg',
    chapters: book3Audio.chapters as AudiobookChapter[],
  },
];

export type Book = (typeof books)[number];
export type ReaderBook = Pick<Book, 'id' | 'label' | 'subtitle' | 'title' | 'readerPath' | 'audioPath' | 'readerKey' | 'legacyReaderKeys'>;

// Every book but this one, in order, for the links between the books.
export const otherBooks = (book: Book) => books.filter(b => b !== book);

// What the reader component needs: the book's own fields plus links to the other books. A book opened for the
// first time takes its look from the nearest earlier book the reader has opened (Book Three from Two, then One).
export function readerBook(book: Book) {
  const pick = ({ id, label, subtitle, title, readerPath, audioPath, readerKey, legacyReaderKeys }: Book): ReaderBook => ({ id, label, subtitle, title, readerPath, audioPath, readerKey, legacyReaderKeys });
  const settingsFallbackKeys = books.filter(b => b.number < book.number).reverse().map(b => b.readerKey);
  return { ...pick(book), others: otherBooks(book).map(pick), settingsFallbackKeys };
}
