import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';
import { books, readerBook } from '@/lib/books';
import { splitChapters } from '@/lib/story';

export const metadata: Metadata = {
  title: "Read The King's Table | Insular Imperium",
  description: "Read Insular Imperium: The King's Table, Book Three, with adjustable fonts, comfortable themes, and saved reading progress.",
};

export default async function BookThreeStoryPage() {
  return <StoryReader chapters={splitChapters(await readFile(path.join(process.cwd(), 'public/stories/Insular-Imperium-Book-Three.md'), 'utf8'))} book={readerBook(books[2])} />;
}
