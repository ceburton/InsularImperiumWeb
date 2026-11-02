import type { Metadata } from 'next';
import AudiobookPlayer from '@/components/AudiobookPlayer';
import { audiobook } from '@/lib/audiobook';
import { books } from '@/lib/books';

const { book, chapters, other } = audiobook(books[1]);

export const metadata: Metadata = {
  title: 'Book Two Audiobook | Insular Imperium',
  description: `${book.summary} Listen free in your browser or in any podcast app.`,
  alternates: { types: { 'application/rss+xml': [{ url: book.feedUrl, title: 'Insular Imperium Book Two audiobook (podcast feed)' }] } },
  openGraph: { title: 'Insular Imperium Book Two: The Audiobook', description: book.summary, images: [{ url: book.cover, width: 3000, height: 3000 }] },
};

export default function BookTwoAudiobookPage() {
  return <AudiobookPlayer chapters={chapters} book={book} other={{ label: other.label, audioPath: other.audioPath }} />;
}
