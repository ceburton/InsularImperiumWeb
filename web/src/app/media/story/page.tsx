import type { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';
import { books, readerBook } from '@/lib/books';
import { loadChapters } from '@/lib/story';

export const metadata: Metadata = {
  title: 'Read the Story | Insular Imperium',
  description: 'Read Insular Imperium with adjustable fonts, comfortable themes, and saved reading progress.',
};

export default async function StoryPage() {
  return <StoryReader chapters={await loadChapters(books[0].storyFile)} book={readerBook(books[0])} />;
}
