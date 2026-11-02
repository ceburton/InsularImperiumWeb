import type { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';
import { books, readerBook } from '@/lib/books';
import { loadChapters } from '@/lib/story';

export const metadata: Metadata = {
  title: 'Read Book Two | Insular Imperium',
  description: 'Read Book Two of Insular Imperium with adjustable fonts, comfortable themes, and saved reading progress.',
};

export default async function BookTwoStoryPage() {
  return <StoryReader chapters={await loadChapters(books[1].storyFile)} book={readerBook(books[1])} />;
}
