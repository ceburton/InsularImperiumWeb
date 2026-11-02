// Splits a compiled reading file (public/stories/*.md, written by `npm run story:sync`) into chapters.
// Each page reads its own file with a literal path, so Vercel's file tracing bundles only that file:
// a path built from a variable makes it bundle the whole project (over the 250 MB function limit).
export function splitChapters(story: string) {
  return Array.from(story.matchAll(/^# (Chapter[^\r\n]+)\r?\n([\s\S]*?)(?=^# Chapter|$(?![\s\S]))/gm), (match) => ({
    title: match[1],
    text: match[2].trim().replace(/\n---\s*$/, ''),
  }));
}
