// Turn rendered reader paragraphs into short utterances. Chrome on Android cuts off long
// utterances, so paragraphs are spoken a sentence (or clause) at a time.
export type SpeechChunk = { text: string; start: number; pause: number };

const blockSelector = 'h1, h2, h3, h4, h5, h6, p:not(.reader-eyebrow), li';
const maxChunk = 220;

export function narrationBlocks(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(blockSelector)).filter(el => !(el.tagName === 'P' && el.closest('li')) && el.textContent?.trim());
}

function clean(text: string) {
  return text.replace(/[*_#`~]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function sentences(text: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return Array.from(new Intl.Segmenter('en', { granularity: 'sentence' }).segment(text), s => ({ text: s.segment, start: s.index }));
  }
  return Array.from(text.matchAll(/[^.!?…]+(?:[.!?…]+["'”’)\]]*\s*|$)/g), m => ({ text: m[0], start: m.index }));
}

function clauses(piece: { text: string; start: number }) {
  if (piece.text.length <= maxChunk) return [piece];
  const parts: { text: string; start: number }[] = [];
  for (const m of piece.text.matchAll(/[^,;:—]+[,;:—]*\s*/g)) {
    const last = parts[parts.length - 1];
    if (last && last.text.length + m[0].length <= maxChunk) last.text += m[0];
    else parts.push({ text: m[0], start: piece.start + m.index });
  }
  return parts;
}

export function speechChunks(el: HTMLElement): SpeechChunk[] {
  const raw = el.textContent || '';
  const trimmed = raw.trim();
  // **MARCUS** point-of-view headers: say the name naturally, then pause.
  if (el.tagName === 'P' && el.children.length === 1 && el.firstElementChild?.tagName === 'STRONG' && /^[A-Z][A-Z .'’-]*$/.test(trimmed)) {
    const name = trimmed.toLowerCase().replace(/(^|[\s'’-])\p{L}/gu, c => c.toUpperCase());
    return [{ text: `${name}.`, start: raw.indexOf(trimmed), pause: 700 }];
  }
  const heading = /^H\d$/.test(el.tagName);
  const chunks: SpeechChunk[] = [];
  for (const piece of sentences(raw).flatMap(clauses)) {
    const text = clean(piece.text);
    if (!text) continue;
    const last = chunks[chunks.length - 1];
    // Merge very short sentences ("No." "Yes.") to avoid gaps between utterances.
    if (last && last.text.length + text.length < 120) last.text += ` ${text}`;
    else chunks.push({ text, start: piece.start + piece.text.search(/\S/), pause: 0 });
  }
  if (chunks.length) chunks[chunks.length - 1].pause = heading ? 800 : 0;
  return chunks;
}

export function englishVoices(all: SpeechSynthesisVoice[]) {
  const english = all.filter(v => /^en\b/i.test(v.lang));
  const list = english.length ? english : all;
  const preferred = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en-us';
  const rank = (v: SpeechSynthesisVoice) => (v.lang.toLowerCase().replace('_', '-') === preferred ? 0 : 2) + (v.localService ? 0 : 1);
  return [...list].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}
