import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';
import { books, readerBook } from '@/lib/books';
import { splitChapters } from '@/lib/story';

export const metadata: Metadata = {
  title: "Read The Heir's Promise | Insular Imperium",
  description: "Read Insular Imperium: The Heir's Promise, Book Two, with adjustable fonts, comfortable themes, and saved reading progress.",
};

export default async function BookTwoStoryPage() {
  return <StoryReader chapters={splitChapters(await readFile(path.join(process.cwd(), 'public/stories/Insular-Imperium-Book-Two.md'), 'utf8'))} book={readerBook(books[1])} />;
}
