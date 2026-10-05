import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';

export const metadata: Metadata = {
  title: 'The Sunstone Saga | Insular Imperium',
  description: 'Read The Sunstone Saga with adjustable fonts, comfortable themes, and saved reading progress.',
};

export default async function StoryPage() {
  const story = await readFile(path.join(process.cwd(), 'public/stories/The-Sunstone-Saga.md'), 'utf8');
  const chapters = Array.from(story.matchAll(/^# (Chapter[^\r\n]+)\r?\n([\s\S]*?)(?=^# Chapter|$(?![\s\S]))/gm), (match) => ({
    title: match[1],
    text: match[2].trim().replace(/\n---\s*$/, ''),
  }));
  return <StoryReader chapters={chapters} />;
}
