import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Splits a compiled reading file (public/stories/*.md, written by `npm run story:sync`) into chapters.
export async function loadChapters(file: string) {
  const story = await readFile(path.join(process.cwd(), file), 'utf8').catch(() => '');
  return Array.from(story.matchAll(/^# (Chapter[^\r\n]+)\r?\n([\s\S]*?)(?=^# Chapter|$(?![\s\S]))/gm), (match) => ({
    title: match[1],
    text: match[2].trim().replace(/\n---\s*$/, ''),
  }));
}
