import { books } from '@/lib/books';
import { podcastFeed } from '@/lib/podcastFeed';

export const dynamic = 'force-static';

export function GET() {
  return podcastFeed(books[1]);
}
