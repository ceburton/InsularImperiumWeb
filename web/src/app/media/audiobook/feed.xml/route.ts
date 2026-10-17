import { book, chapters } from '@/lib/audiobook';

// Podcast feed for the audiobook, rebuilt on every deploy. Episode guids are chapter slugs and never change,
// so a regenerated chapter replaces its episode (new enclosure URL) instead of appearing twice.
export const dynamic = 'force-static';

const escape = (text: string) => text.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

export function GET() {
  const items = chapters.map(c => `    <item>
      <title>${escape(c.title)}</title>
      <description>${escape(`${c.title}. Chapter ${c.track} of ${chapters.length} of ${book.title}. ${book.narration}`)}</description>
      <guid isPermaLink="false">insular-imperium-audiobook-${c.slug}</guid>
      <pubDate>${new Date(`${c.firstPublished}T12:00:00Z`).toUTCString()}</pubDate>
      <enclosure url="${escape(c.url)}" length="${c.bytes}" type="audio/mpeg"/>
      <itunes:episode>${c.track}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:duration>${c.duration}</itunes:duration>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(book.title)}</title>
    <link>${book.pageUrl}</link>
    <atom:link href="${book.feedUrl}" rel="self" type="application/rss+xml"/>
    <description>${escape(`${book.summary} ${book.narration}`)}</description>
    <language>en</language>
    <copyright>© ${new Date().getFullYear()} ${escape(book.author)}</copyright>
    <image><url>${book.cover}</url><title>${escape(book.title)}</title><link>${book.pageUrl}</link></image>
    <itunes:author>${escape(book.author)}</itunes:author>
    <itunes:owner><itunes:name>${escape(book.author)}</itunes:name><itunes:email>${book.email}</itunes:email></itunes:owner>
    <itunes:image href="${book.cover}"/>
    <itunes:category text="Fiction"><itunes:category text="Drama"/></itunes:category>
    <itunes:explicit>true</itunes:explicit>
    <itunes:type>serial</itunes:type>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
