'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { offsetForPage, pageForOffset, pageForTextIn } from '@/lib/readerPagination';
import { englishVoices, narrationBlocks, speechChunks } from '@/lib/readerNarration';
import { acquireWakeLock, releaseWakeLock } from '@/lib/wakeLock';
import './StoryReader.css';

type Chapter = { title: string; text: string };
const themes = {
  charcoal: { background: '#191b20', color: '#eee8dc', accent: '#efd094' },
  black: { background: '#000000', color: '#ffffff', accent: '#ffdf80' },
  sepia: { background: '#f2e7ce', color: '#2b2118', accent: '#684316' },
  light: { background: '#ffffff', color: '#171717', accent: '#644014' },
};
const fonts = { serif: 'Georgia, serif', garamond: "'EB Garamond', Georgia, serif", sans: 'Arial, sans-serif', mono: "'Courier New', monospace" };
const defaults = { theme: 'charcoal', font: 'serif', size: 21, spacing: 1.8, width: 700, layout: 'auto' };
const storageKey = 'insular-reader-v2';
const voiceKey = 'insular-reader-voice';
// Keys used before the story was renamed from The Sunstone Saga; read once so saved progress carries over.
const legacyStorageKeys = ['sunstone-reader-v2', 'sunstone-reader-v1'];
const legacyVoiceKey = 'sunstone-reader-voice';
const rates = [0.75, 1, 1.25, 1.5, 1.75, 2];
const gap = 64;
type Pagination = { page: number; total: number; columns: number; stride: number };
type ListenPlace = { chapter: number; paragraph: number } | null;
type Settings = typeof defaults;

function savePlace(settings: Settings, chapter: number, offset: number, listen: ListenPlace) {
  try { localStorage.setItem(storageKey, JSON.stringify({ settings, chapter, offset, listen })); } catch { /* Storage is optional. */ }
}

const wakeIdleMs = 15 * 60 * 1000;

const icons = {
  prev: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z" /></svg>,
  next: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></svg>,
  play: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>,
  pause: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>,
};

export default function StoryReader({ chapters }: { chapters: Chapter[] }) {
  const [settings, setSettings] = useState(defaults);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [controls, setControls] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({ page: 0, total: 1, columns: 1, stride: 0 });
  const [canSpeak, setCanSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const [dim, setDim] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicePrefs, setVoicePrefs] = useState({ rate: 1, voice: '' });
  const viewport = useRef<HTMLDivElement>(null);
  const pageArea = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const anchor = useRef(0);
  const openLastPage = useRef(false);
  const legacyProgress = useRef(0);
  const listenPlace = useRef<ListenPlace>(null);
  const prefs = useRef({ rate: 1, voice: '' });
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const keepAwake = useRef(() => {});
  // Narration runs from utterance callbacks, so it keeps its state in refs rather than React state.
  const narration = useRef({ playing: false, token: 0, paragraph: 0, chunk: 0, retries: 0, pending: '' as '' | 'page' | 'chapter', timer: 0, watchdog: 0, utterance: null as SpeechSynthesisUtterance | null });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse([storageKey, ...legacyStorageKeys].map(k => localStorage.getItem(k)).find(Boolean) || 'null');
        if (saved) {
          const s = saved.settings || {};
          setSettings({
            theme: Object.hasOwn(themes, s.theme) ? s.theme : defaults.theme,
            font: Object.hasOwn(fonts, s.font) ? s.font : defaults.font,
            size: [16, 18, 21, 24, 28, 32].includes(s.size) ? s.size : defaults.size,
            spacing: [1.5, 1.8, 2.1].includes(s.spacing) ? s.spacing : defaults.spacing,
            width: [560, 700, 860].includes(s.width) ? s.width : defaults.width,
            layout: s.layout === 'single' ? 'single' : 'auto',
          });
          setChapter(Number.isInteger(saved.chapter) ? Math.max(0, Math.min(chapters.length - 1, saved.chapter)) : 0);
          anchor.current = Number.isInteger(saved.offset) ? Math.max(0, saved.offset) : 0;
          legacyProgress.current = typeof saved.progress === 'number' ? Math.max(0, Math.min(1, saved.progress)) : 0;
          const l = saved.listen;
          if (l && Number.isInteger(l.chapter) && Number.isInteger(l.paragraph)) listenPlace.current = { chapter: l.chapter, paragraph: Math.max(0, l.paragraph) };
        }
      } catch { /* Storage is optional. */ }
      try {
        const v = JSON.parse(localStorage.getItem(voiceKey) || localStorage.getItem(legacyVoiceKey) || 'null');
        if (v) {
          prefs.current = { rate: rates.includes(v.rate) ? v.rate : 1, voice: typeof v.voice === 'string' ? v.voice : '' };
          setVoicePrefs(prefs.current);
        }
      } catch { /* Storage is optional. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [chapters.length]);

  useEffect(() => {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(englishVoices(synth.getVoices()));
    const frame = requestAnimationFrame(() => { setCanSpeak(true); load(); });
    synth.addEventListener('voiceschanged', load);
    return () => { cancelAnimationFrame(frame); synth.removeEventListener('voiceschanged', load); };
  }, []);

  useEffect(() => {
    if (!ready || !viewport.current || !pageArea.current || !article.current) return;
    const box = viewport.current;
    const area = pageArea.current;
    const content = article.current;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || !area.clientWidth || !area.clientHeight) return;
        // Keep a comfortable measure on both pages, even with large text.
        const columns = settings.layout === 'auto' && area.clientWidth >= Math.max(900, settings.size * 42 + gap) ? 2 : 1;
        box.style.width = `${columns === 2 ? area.clientWidth : Math.min(settings.width, area.clientWidth)}px`;
        const width = (box.clientWidth - gap * (columns - 1)) / columns;
        const stride = width + gap;
        content.style.columnWidth = `${width}px`;
        content.style.columnGap = `${gap}px`;
        content.style.height = `${box.clientHeight}px`;
        content.style.width = `${box.clientWidth}px`;
        const total = Math.max(1, Math.round((content.scrollWidth + gap) / stride));
        let page = pageForOffset(content, anchor.current, stride);
        const needsBookmark = !!legacyProgress.current || openLastPage.current;
        if (legacyProgress.current) {
          page = Math.floor(legacyProgress.current * (total - 1));
          legacyProgress.current = 0;
        }
        if (openLastPage.current) { page = total - 1; openLastPage.current = false; }
        page = Math.floor(Math.min(page, total - 1) / columns) * columns;
        if (needsBookmark) anchor.current = offsetForPage(content, page, stride);
        setPagination({ page, total, columns, stride });
        savePlace(settings, chapter, anchor.current, listenPlace.current);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    document.fonts.addEventListener('loadingdone', measure);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    measure();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); document.fonts.removeEventListener('loadingdone', measure); };
  }, [ready, chapter, settings]);

  useEffect(() => {
    if (!controls) return;
    panel.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setControls(false); menuButton.current?.focus(); }
      if (event.key === 'Tab' && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>('button, select, a[href]');
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [controls]);

  function navigate(next: number, last = false) {
    anchor.current = 0;
    if (next === chapter) {
      setPagination(current => ({ ...current, page: 0 }));
      savePlace(settings, chapter, 0, listenPlace.current);
      return;
    }
    openLastPage.current = last;
    setChapter(next);
    setPagination(current => ({ ...current, page: 0, stride: 0 }));
  }

  function showPage(next: number) {
    if (article.current) anchor.current = offsetForPage(article.current, next, pagination.stride);
    setPagination(current => ({ ...current, page: next }));
    savePlace(settings, chapter, anchor.current, listenPlace.current);
  }

  function turn(direction: number) {
    const { page, total, columns } = pagination;
    const next = page + direction * columns;
    if (next < 0) { if (chapter > 0) { navigate(chapter - 1, true); return true; } return false; }
    if (next >= total) { if (chapter < chapters.length - 1) { navigate(chapter + 1); return true; } return false; }
    showPage(next);
    return true;
  }

  // A page or chapter the reader chose restarts narration from the top of that page.
  function userTurn(direction: number) {
    if (turn(direction) && narration.current.playing) narration.current.pending = 'page';
  }

  function userChapter(next: number) {
    if (narration.current.playing) narration.current.pending = 'page';
    navigate(next);
  }

  function pageOf(el: HTMLElement, offset: number) {
    return article.current && pagination.stride ? pageForTextIn(article.current, el, offset, pagination.stride) : -1;
  }

  function firstOnPage(): [number, number] {
    const blocks = article.current ? narrationBlocks(article.current) : [];
    for (let i = 0; i < blocks.length; i++) {
      const text = blocks[i].textContent || '';
      if (pageOf(blocks[i], Math.max(0, text.trimEnd().length - 1)) < pagination.page) continue;
      const chunks = speechChunks(blocks[i]);
      const j = chunks.findIndex(c => pageOf(blocks[i], c.start) >= pagination.page);
      return [i, Math.max(0, j)];
    }
    return [blocks.length, 0];
  }

  function paragraphVisible(paragraph: number) {
    const el = article.current ? narrationBlocks(article.current)[paragraph] : undefined;
    if (!el) return false;
    const end = pageOf(el, Math.max(0, (el.textContent || '').trimEnd().length - 1));
    return pageOf(el, 0) < pagination.page + pagination.columns && end >= pagination.page;
  }

  // Highlight a paragraph, keep it on screen, and remember it as the listening place.
  function focusParagraph(el: HTMLElement, paragraph: number, offset: number) {
    if (!el.classList.contains('reader-speaking')) {
      article.current?.querySelectorAll('.reader-speaking').forEach(e => e.classList.remove('reader-speaking'));
      el.classList.add('reader-speaking');
    }
    const page = pageOf(el, offset);
    const spread = Math.floor(page / pagination.columns) * pagination.columns;
    if (page >= 0 && spread !== pagination.page) showPage(spread);
    if (listenPlace.current?.chapter !== chapter || listenPlace.current.paragraph !== paragraph) {
      listenPlace.current = { chapter, paragraph };
      savePlace(settings, chapter, anchor.current, listenPlace.current);
    }
  }

  function speak(paragraph: number, chunk: number) {
    const n = narration.current;
    window.clearTimeout(n.timer);
    window.clearTimeout(n.watchdog);
    const token = ++n.token;
    // Cancelling an idle queue right before speak() can make Chrome drop the next utterance.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) window.speechSynthesis.cancel();
    n.paragraph = paragraph;
    n.chunk = chunk;
    if (!n.playing) return;
    const blocks = article.current ? narrationBlocks(article.current) : [];
    if (paragraph >= blocks.length) {
      if (chapter < chapters.length - 1) { n.pending = 'chapter'; navigate(chapter + 1); }
      else { stopListening(); article.current?.querySelectorAll('.reader-speaking').forEach(e => e.classList.remove('reader-speaking')); }
      return;
    }
    const el = blocks[paragraph];
    const chunks = speechChunks(el);
    if (chunk >= chunks.length) { speak(paragraph + 1, 0); return; }
    const part = chunks[chunk];
    focusParagraph(el, paragraph, part.start);
    const utterance = new SpeechSynthesisUtterance(part.text);
    const available = window.speechSynthesis.getVoices();
    const voice = available.find(v => v.voiceURI === prefs.current.voice) || englishVoices(available).find(v => v.default) || englishVoices(available)[0];
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-US';
    utterance.rate = prefs.current.rate;
    const advance = () => { if (token === n.token) n.timer = window.setTimeout(() => latest.current.speak(paragraph, chunk + 1), part.pause); };
    // Chrome can stall after long sessions: if speech never starts (or never ends), cancel and retry.
    const retry = () => {
      if (token !== n.token) return;
      if (++n.retries > 3) { latest.current.stopListening(); return; }
      latest.current.speak(paragraph, chunk);
    };
    utterance.onstart = () => {
      if (token !== n.token) return;
      n.retries = 0;
      window.clearTimeout(n.watchdog);
      n.watchdog = window.setTimeout(retry, Math.max(10000, part.text.length * 200 / utterance.rate));
    };
    utterance.onend = () => { window.clearTimeout(n.watchdog); advance(); };
    utterance.onerror = event => { window.clearTimeout(n.watchdog); if (event.error !== 'interrupted' && event.error !== 'canceled') advance(); };
    n.watchdog = window.setTimeout(retry, 5000);
    n.utterance = utterance; // Chrome can garbage-collect an unreferenced utterance before onend fires.
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    const n = narration.current;
    n.playing = true;
    n.retries = 0;
    setListening(true);
    keepAwake.current();
    const saved = listenPlace.current;
    if (saved?.chapter === chapter && paragraphVisible(saved.paragraph)) speak(saved.paragraph, saved.paragraph === n.paragraph ? n.chunk : 0);
    else speak(...firstOnPage());
  }

  function stopListening() {
    const n = narration.current;
    n.playing = false;
    n.pending = '';
    n.token++;
    window.clearTimeout(n.timer);
    window.clearTimeout(n.watchdog);
    window.speechSynthesis.cancel();
    setListening(false);
    savePlace(settings, chapter, anchor.current, listenPlace.current);
  }

  function skipParagraph(delta: number) {
    const n = narration.current;
    const count = article.current ? narrationBlocks(article.current).length : 0;
    const paragraph = Math.max(0, n.paragraph + delta);
    if (n.playing) { speak(paragraph, 0); return; }
    const el = article.current ? narrationBlocks(article.current)[Math.min(paragraph, count - 1)] : undefined;
    if (!el) return;
    n.paragraph = Math.min(paragraph, count - 1);
    n.chunk = 0;
    focusParagraph(el, n.paragraph, 0);
  }

  function changeVoice(key: 'rate' | 'voice', value: number | string) {
    prefs.current = { ...prefs.current, [key]: value };
    setVoicePrefs(prefs.current);
    try { localStorage.setItem(voiceKey, JSON.stringify(prefs.current)); } catch { /* Storage is optional. */ }
    if (narration.current.playing) speak(narration.current.paragraph, narration.current.chunk);
  }

  const latest = useRef({ speak, stopListening, startListening, firstOnPage });
  useLayoutEffect(() => { latest.current = { speak, stopListening, startListening, firstOnPage }; });

  // Resume narration once a new page or chapter has been laid out.
  useEffect(() => {
    const n = narration.current;
    if (!pagination.stride || !n.playing || !n.pending) return;
    const pending = n.pending;
    n.pending = '';
    if (pending === 'chapter') latest.current.speak(0, 0);
    else latest.current.speak(...latest.current.firstOnPage());
  }, [pagination, chapter]);

  useEffect(() => {
    const n = narration.current;
    let mounted = true;
    let idle = false;
    let idleTimer = 0;
    const stop = () => {
      mounted = false;
      n.playing = false;
      n.token++;
      window.clearTimeout(n.timer);
      window.clearTimeout(n.watchdog);
      window.clearTimeout(idleTimer);
      try { window.speechSynthesis?.cancel(); } catch { /* Speech is optional. */ }
      releaseWakeLock(wakeLock);
    };
    // Keep the screen awake while the reader is in use, listening or not, and let it sleep after 15 minutes without a scroll or page turn.
    const goIdle = () => {
      if (n.playing) { stillReading(); return; }
      idle = true;
      releaseWakeLock(wakeLock);
    };
    const stillReading = () => {
      idle = false;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(goIdle, wakeIdleMs);
      void acquireWakeLock(wakeLock, () => mounted && !idle);
    };
    keepAwake.current = stillReading;
    stillReading();
    const onPageHide = () => { if (n.playing) latest.current.stopListening(); };
    // Browsers drop the wake lock whenever the tab is hidden, so coming back counts as reading.
    const onVisibility = () => { if (document.visibilityState === 'visible') stillReading(); };
    const scrolls = ['wheel', 'touchmove', 'scroll'] as const;
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibility);
    for (const type of scrolls) window.addEventListener(type, stillReading, { capture: true, passive: true });
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibility);
      for (const type of scrolls) window.removeEventListener(type, stillReading, { capture: true });
      keepAwake.current = () => {};
      stop();
    };
  }, []);

  // Every page or chapter turn, whether by the reader or by narration, restarts the idle clock.
  useEffect(() => { keepAwake.current(); }, [pagination.page, chapter]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const session = navigator.mediaSession;
    try {
      if (listening) session.metadata = new MediaMetadata({ title: chapters[chapter]?.title, artist: 'Insular Imperium', album: 'Insular Imperium' });
      session.playbackState = listening ? 'playing' : 'paused';
      session.setActionHandler('play', () => { if (!narration.current.playing) latest.current.startListening(); });
      session.setActionHandler('pause', () => { if (narration.current.playing) latest.current.stopListening(); });
    } catch { /* Media Session is optional. */ }
  }, [listening, chapter, chapters]);

  useEffect(() => () => {
    if (!('mediaSession' in navigator)) return;
    try { navigator.mediaSession.setActionHandler('play', null); navigator.mediaSession.setActionHandler('pause', null); } catch { /* Media Session is optional. */ }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (dim && event.key === 'Escape') { setDim(false); return; }
      if (controls || dim || !pagination.stride || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest('select, input, textarea, [contenteditable]')) return;
      // Space still activates focused buttons and links through their native behavior.
      if (event.key === ' ' && target?.closest('button, a')) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp', ' '].includes(event.key)) {
        event.preventDefault();
        userTurn(['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey) ? -1 : 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function change(key: keyof typeof defaults, value: string | number) {
    setSettings(current => ({ ...current, [key]: value }));
  }

  const theme = themes[settings.theme as keyof typeof themes];
  const markdown = useMemo(() => <Markdown>{chapters[chapter]?.text || ''}</Markdown>, [chapters, chapter]);
  const lastVisible = Math.min(pagination.page + pagination.columns, pagination.total);
  const pageLabel = pagination.columns === 2 && lastVisible > pagination.page + 1 ? `Pages ${pagination.page + 1}–${lastVisible}` : `Page ${pagination.page + 1}`;
  const toggleListening = () => (listening ? stopListening() : startListening());
  return (
    <div className="story-reader" style={{ '--reader-bg': theme.background, '--reader-fg': theme.color, '--reader-accent': theme.accent, colorScheme: ['light', 'sepia'].includes(settings.theme) ? 'light' : 'dark' } as CSSProperties}>
      <header className="reader-toolbar">
        <Link href="/media">← Media</Link>
        <span className="reader-brand">Insular Imperium</span>
        <div className="reader-toolbar-actions">
          {canSpeak && <button className="reader-listen" disabled={!pagination.stride} onClick={toggleListening} aria-label={listening ? 'Pause listening' : 'Listen'}>{listening ? '⏸︎' : '▶︎'} <span>{listening ? 'Pause' : 'Listen'}</span></button>}
          {listening && <button onClick={() => setDim(true)} aria-label="Dim mode" title="Dim the screen while listening">◐ <span>Dim</span></button>}
          <button ref={menuButton} aria-haspopup="dialog" aria-expanded={controls} aria-controls="reader-settings" onClick={() => setControls(!controls)}>Aa <span>Menu</span></button>
        </div>
      </header>
      <div className="reader-chapterbar">
        <label className="reader-sr-only" htmlFor="chapter-select">Choose chapter</label>
        <select id="chapter-select" value={chapter} onChange={e => userChapter(Number(e.target.value))}>{chapters.map((c, i) => <option key={c.title} value={i}>{c.title}</option>)}</select>
        <span className="reader-chapter-count">{chapter + 1} / {chapters.length}</span>
      </div>
      <main className="reader-main" aria-label="Book pages">
        <div ref={pageArea} className="reader-page-area" style={{ maxWidth: settings.width * (settings.layout === 'single' ? 1 : 2) + (settings.layout === 'single' ? 0 : gap) }}>
        <div ref={viewport} className={`reader-book ${pagination.columns === 2 ? 'reader-spread' : ''}`}>
          <article ref={article} className="reader-prose" aria-label={chapters[chapter]?.title} style={{ fontFamily: fonts[settings.font as keyof typeof fonts], fontSize: settings.size, lineHeight: settings.spacing, transform: `translateX(-${pagination.page * pagination.stride}px)`, visibility: ready && pagination.stride ? 'visible' : 'hidden' }}>
            <p className="reader-eyebrow">INSULAR IMPERIUM</p>
            <h1>{chapters[chapter]?.title}</h1>
            {markdown}
          </article>
          {!pagination.stride && <div className="reader-loading" role="status">Preparing your pages…</div>}
        </div>
        </div>
      </main>
      <nav className="reader-pagination" aria-label="Page navigation">
        <button disabled={!pagination.stride || (chapter === 0 && pagination.page === 0)} onClick={() => userTurn(-1)} aria-label="Previous page" aria-keyshortcuts="PageUp ArrowLeft ArrowUp" title="Previous page (PgUp, Left, or Up)">← <span>Previous</span></button>
        <div className="reader-page-status" role="status" aria-live="polite">
          <span>{pagination.stride ? `${pageLabel} of ${pagination.total}` : 'Preparing pages'}</span>
          <small>Chapter {chapter + 1} · Place saved</small>
        </div>
        <button disabled={!pagination.stride || (chapter === chapters.length - 1 && lastVisible === pagination.total)} onClick={() => userTurn(1)} aria-label="Next page" aria-keyshortcuts="PageDown ArrowRight ArrowDown" title="Next page (PgDn, Right, or Down)"><span>Next</span> →</button>
      </nav>
      {dim && <div className="reader-dim" role="dialog" aria-modal="true" aria-label="Dim mode">
        <p className="reader-dim-title">{chapters[chapter]?.title}</p>
        <div className="reader-dim-controls">
          <button aria-label="Previous paragraph" onClick={() => skipParagraph(-1)}>{icons.prev}</button>
          <button className="reader-dim-play" autoFocus aria-label={listening ? 'Pause' : 'Play'} onClick={toggleListening}>{listening ? icons.pause : icons.play}</button>
          <button aria-label="Next paragraph" onClick={() => skipParagraph(1)}>{icons.next}</button>
        </div>
        <button className="reader-dim-exit" onClick={() => setDim(false)}>Exit dim mode</button>
      </div>}
      {controls && <div className="reader-menu-backdrop" onClick={() => { setControls(false); menuButton.current?.focus(); }}>
        <div ref={panel} id="reader-settings" className="reader-settings" role="dialog" aria-modal="true" aria-labelledby="reader-settings-title" tabIndex={-1} onClick={e => e.stopPropagation()}>
          <div className="reader-menu-heading"><h2 id="reader-settings-title">Make yourself comfortable</h2><button aria-label="Close menu" onClick={() => { setControls(false); menuButton.current?.focus(); }}>✕</button></div>
          <div className="reader-settings-grid">
            <label>Appearance<select value={settings.theme} onChange={e => change('theme', e.target.value)}><option value="charcoal">Charcoal · soft ivory</option><option value="black">Black · high contrast</option><option value="sepia">Warm parchment</option><option value="light">White · high contrast</option></select></label>
            <label>Font<select value={settings.font} onChange={e => change('font', e.target.value)}><option value="serif">Georgia</option><option value="garamond">Garamond</option><option value="sans">Arial</option><option value="mono">Monospace</option></select></label>
            <label>Font size<select value={settings.size} onChange={e => change('size', Number(e.target.value))}>{[16,18,21,24,28,32].map(n => <option key={n} value={n}>{n} px</option>)}</select></label>
            <label>Line spacing<select value={settings.spacing} onChange={e => change('spacing', Number(e.target.value))}><option value={1.5}>Compact</option><option value={1.8}>Comfortable</option><option value={2.1}>Spacious</option></select></label>
            <label>Page width<select value={settings.width} onChange={e => change('width', Number(e.target.value))}><option value={560}>Narrow</option><option value={700}>Medium</option><option value={860}>Wide</option></select></label>
            <label>Page layout<select value={settings.layout} onChange={e => change('layout', e.target.value)}><option value="auto">Automatic · two pages when they fit</option><option value="single">Always one page</option></select></label>
            {canSpeak && <label>Listening speed<select value={voicePrefs.rate} onChange={e => changeVoice('rate', Number(e.target.value))}>{rates.map(r => <option key={r} value={r}>{r}×</option>)}</select></label>}
            {canSpeak && <label>Voice<select value={voicePrefs.voice} onChange={e => changeVoice('voice', e.target.value)}><option value="">Automatic</option>{voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}</select></label>}
          </div>
          <p className="reader-note">Next page: PgDn, Right arrow, or Down arrow. Previous page: PgUp, Left arrow, or Up arrow. Space also advances; Shift+Space goes back. Your place follows you when you change the font or resize the window.{canSpeak && ' Listen reads aloud from the top of the page and remembers the paragraph where you paused.'}</p>
          <button className="reader-done" onClick={() => { setControls(false); menuButton.current?.focus(); }}>Back to the book</button>
        </div>
      </div>}
    </div>
  );
}
