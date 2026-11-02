import type { Metadata } from 'next';
import AudiobookPlayer from '@/components/AudiobookPlayer';
import { audiobook } from '@/lib/audiobook';
import { books } from '@/lib/books';

const { book, chapters, other } = audiobook(books[0]);

export const metadata: Metadata = {
  title: 'The Coward\'s Answer Audiobook | Insular Imperium',
  description: `${book.summary} Listen free in your browser or in any podcast app.`,
  alternates: { types: { 'application/rss+xml': [{ url: book.feedUrl, title: `${book.title} audiobook (podcast feed)` }] } },
  openGraph: { title: `${book.title}: The Audiobook`, description: book.summary, images: [{ url: book.cover, width: 3000, height: 3000 }] },
};

export default function AudiobookPage() {
  return <AudiobookPlayer chapters={chapters} book={book} other={{ subtitle: other.subtitle, audioPath: other.audioPath }} />;
}
