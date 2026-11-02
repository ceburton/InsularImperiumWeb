// src/data/audiobook.json (Book One) and src/data/audiobook-book2.json (Book Two) are written by
// `npm run audio:publish` (web/scripts/publish-audiobook.mjs). The book details live in books.ts.
import { books, type AudiobookChapter, type Book } from '@/lib/books';

export type { AudiobookChapter };
export type AudiobookInfo = Omit<Book, 'chapters'>;

export function audiobook(book: Book) {
  const { chapters, ...info } = book;
  return { chapters, book: info as AudiobookInfo, other: books.find(b => b !== book)! };
}

// Book One, as before.
export const { chapters, book } = audiobook(books[0]);
