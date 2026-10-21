import data from '@/data/audiobook.json';

// src/data/audiobook.json is written by `npm run audio:publish` (web/scripts/publish-audiobook.mjs).
// pov: [seconds, name] for each point-of-view switch, from the generator's manifest.json cues.
export type AudiobookChapter = Omit<(typeof data.chapters)[number], 'pov'> & { pov?: [number, string][] };
export const chapters = data.chapters as AudiobookChapter[];

const site = 'https://www.insularimperium.com';

export const book = {
  title: 'Insular Imperium',
  author: 'Insular Imperium Team',
  email: 'info@insularimperium.com',
  narration: 'Narrated by an AI voice (Kokoro TTS).',
  summary: 'The story behind Insular Imperium, read aloud chapter by chapter. The bells ring across Aeridor, a prince wakes in the Drowned Lantern, and a war for the islands begins.',
  pageUrl: `${site}/media/audiobook`,
  feedUrl: `${site}/media/audiobook/feed.xml`,
  cover: `${site}/audiobook/cover-3000.jpg`,
  coverSmall: '/audiobook/cover-600.jpg',
  // Fill in once each directory has accepted the feed; empty links are hidden.
  directories: { apple: '', spotify: '', pocketCasts: '' },
};
