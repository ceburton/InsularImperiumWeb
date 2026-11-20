// src/data/audiobook.json (Book One), src/data/audiobook-book2.json (Book Two) and src/data/audiobook-book3.json
// (Book Three) are written by `npm run audio:publish` (web/scripts/publish-audiobook.mjs). The book details live
// in books.ts.
import { books, otherBooks, type AudiobookChapter, type Book } from '@/lib/books';

export type { AudiobookChapter };
export type AudiobookInfo = Omit<Book, 'chapters'>;

export function audiobook(book: Book) {
  const { chapters, ...info } = book;
  return { chapters, book: info as AudiobookInfo, others: otherBooks(book) };
}

// Book One, as before.
export const { chapters, book } = audiobook(books[0]);
