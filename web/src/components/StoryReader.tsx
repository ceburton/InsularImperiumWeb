'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { offsetForPage, pageForOffset } from '@/lib/readerPagination';
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
const storageKey = 'sunstone-reader-v2';
const gap = 64;
type Pagination = { page: number; total: number; columns: number; stride: number };

export default function StoryReader({ chapters }: { chapters: Chapter[] }) {
  const [settings, setSettings] = useState(defaults);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [controls, setControls] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({ page: 0, total: 1, columns: 1, stride: 0 });
  const viewport = useRef<HTMLDivElement>(null);
  const pageArea = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const anchor = useRef(0);
  const openLastPage = useRef(false);
  const legacyProgress = useRef(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || localStorage.getItem('sunstone-reader-v1') || 'null');
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
        }
      } catch { /* Storage is optional. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [chapters.length]);

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
        try { localStorage.setItem(storageKey, JSON.stringify({ settings, chapter, offset: anchor.current })); } catch { /* Storage is optional. */ }
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
      try { localStorage.setItem(storageKey, JSON.stringify({ settings, chapter, offset: 0 })); } catch { /* Storage is optional. */ }
      return;
    }
    openLastPage.current = last;
    setChapter(next);
    setPagination(current => ({ ...current, page: 0, stride: 0 }));
  }

  function turn(direction: number) {
    const { page, total, columns, stride } = pagination;
    const next = page + direction * columns;
    if (next < 0) { if (chapter > 0) navigate(chapter - 1, true); return; }
    if (next >= total) { if (chapter < chapters.length - 1) navigate(chapter + 1); return; }
    if (article.current) anchor.current = offsetForPage(article.current, next, stride);
    setPagination(current => ({ ...current, page: next }));
    try { localStorage.setItem(storageKey, JSON.stringify({ settings, chapter, offset: anchor.current })); } catch { /* Storage is optional. */ }
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (controls || !pagination.stride || event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof HTMLElement && event.target.closest('button, select, input, a, [contenteditable]'))) return;
      if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', ' '].includes(event.key)) {
        event.preventDefault();
        turn(event.key === 'ArrowLeft' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey) ? -1 : 1);
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
  return (
    <div className="story-reader" style={{ '--reader-bg': theme.background, '--reader-fg': theme.color, '--reader-accent': theme.accent, colorScheme: ['light', 'sepia'].includes(settings.theme) ? 'light' : 'dark' } as CSSProperties}>
      <header className="reader-toolbar">
        <Link href="/media">← Media</Link>
        <span className="reader-brand">The Sunstone Saga</span>
        <button ref={menuButton} aria-haspopup="dialog" aria-expanded={controls} aria-controls="reader-settings" onClick={() => setControls(!controls)}>Aa <span>Menu</span></button>
      </header>
      <div className="reader-chapterbar">
        <label className="reader-sr-only" htmlFor="chapter-select">Choose chapter</label>
        <select id="chapter-select" value={chapter} onChange={e => navigate(Number(e.target.value))}>{chapters.map((c, i) => <option key={c.title} value={i}>{c.title}</option>)}</select>
        <span className="reader-chapter-count">{chapter + 1} / {chapters.length}</span>
      </div>
      <main className="reader-main" aria-label="Book pages">
        <div ref={pageArea} className="reader-page-area" style={{ maxWidth: settings.width * (settings.layout === 'single' ? 1 : 2) + (settings.layout === 'single' ? 0 : gap) }}>
        <div ref={viewport} className={`reader-book ${pagination.columns === 2 ? 'reader-spread' : ''}`}>
          <article ref={article} className="reader-prose" aria-label={chapters[chapter]?.title} style={{ fontFamily: fonts[settings.font as keyof typeof fonts], fontSize: settings.size, lineHeight: settings.spacing, transform: `translateX(-${pagination.page * pagination.stride}px)`, visibility: ready && pagination.stride ? 'visible' : 'hidden' }}>
            <p className="reader-eyebrow">THE SUNSTONE SAGA</p>
            <h1>{chapters[chapter]?.title}</h1>
            {markdown}
          </article>
          {!pagination.stride && <div className="reader-loading" role="status">Preparing your pages…</div>}
        </div>
        </div>
      </main>
      <nav className="reader-pagination" aria-label="Page navigation">
        <button disabled={!pagination.stride || (chapter === 0 && pagination.page === 0)} onClick={() => turn(-1)} aria-label="Previous page">← <span>Previous</span></button>
        <div className="reader-page-status" role="status" aria-live="polite">
          <span>{pagination.stride ? `${pageLabel} of ${pagination.total}` : 'Preparing pages'}</span>
          <small>Chapter {chapter + 1} · Place saved</small>
        </div>
        <button disabled={!pagination.stride || (chapter === chapters.length - 1 && lastVisible === pagination.total)} onClick={() => turn(1)} aria-label="Next page"><span>Next</span> →</button>
      </nav>
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
          </div>
          <p className="reader-note">Use the page buttons, arrow keys, or space bar to read. Your place follows you when you change the font or resize the window.</p>
          <button className="reader-done" onClick={() => { setControls(false); menuButton.current?.focus(); }}>Back to the book</button>
        </div>
      </div>}
    </div>
  );
}
