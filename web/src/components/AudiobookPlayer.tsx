'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { AudiobookChapter, book as bookInfo } from '@/lib/audiobook';
import './AudiobookPlayer.css';

const storageKey = 'insular-audiobook-v1';
const rates = [0.8, 1, 1.25, 1.5, 1.75, 2];
const back = 15;
const ahead = 30;
const endOfChapter = -1;
const sleepChoices = [[0, 'Off'], [15, '15 minutes'], [30, '30 minutes'], [60, '1 hour'], [endOfChapter, 'End of chapter']] as const;

// t = seconds heard, d = chapter length and v = file version when saved, so a regenerated chapter can resume proportionally.
type Place = { t: number; d: number; v: string; done?: boolean };
type Saved = { current?: string; rate?: number; places: Record<string, Place> };

const icons = {
  play: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>,
  pause: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>,
  prev: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z" /></svg>,
  next: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></svg>,
  download: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10l3.5-3.5 1.4 1.4L12 16.8l-5.9-5.9 1.4-1.4L11 13zM5 19h14v2H5z" /></svg>,
};

const version = (c: AudiobookChapter) => c.sha256.slice(0, 8);

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

function runtime(seconds: number) {
  const h = Math.floor(seconds / 3600), m = Math.round((seconds % 3600) / 60);
  return h ? `${h} h ${m} min` : `${m} min`;
}

function store(saved: Saved) {
  try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* Storage is optional. */ }
}

// Where a chapter starts: the saved second, scaled to the new length if the chapter was regenerated since.
function resumeAt(c: AudiobookChapter, p?: Place) {
  if (!p || p.done) return 0;
  if (p.v === version(c)) return p.t;
  return p.d > 0 ? Math.min(c.duration - 5, (p.t / p.d) * c.duration) : 0;
}

export default function AudiobookPlayer({ chapters, book }: { chapters: AudiobookChapter[]; book: typeof bookInfo }) {
  const audio = useRef<HTMLAudioElement>(null);
  const saved = useRef<Saved>({ places: {} });
  const pendingSeek = useRef<number | null>(null);
  const lastSave = useRef(0);
  const [places, setPlaces] = useState<Record<string, Place>>({});
  const [lastSlug, setLastSlug] = useState<string>();
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [sleep, setSleep] = useState({ minutes: 0, until: 0 });
  const [now, setNow] = useState(0);
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);

  const chapter = index === null ? null : chapters[index];
  const total = chapters.reduce((sum, c) => sum + c.duration, 0);
  // The chapter "Continue" starts: the last one played, or the next one if it was finished.
  const lastIndex = chapters.findIndex(c => c.slug === lastSlug);
  const lastPlace = lastIndex >= 0 ? places[chapters[lastIndex].slug] : undefined;
  const resumeIndex = lastIndex < 0 ? 0 : lastPlace?.done ? Math.min(lastIndex + 1, chapters.length - 1) : lastIndex;
  const resumeChapter = chapters[resumeIndex];
  const resumePoint = resumeChapter ? resumeAt(resumeChapter, places[resumeChapter.slug]) : 0;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const s = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (s && typeof s.places === 'object') saved.current = { current: s.current, rate: s.rate, places: s.places };
      } catch { /* Storage is optional. */ }
      setPlaces(saved.current.places);
      setLastSlug(saved.current.current);
      if (rates.includes(saved.current.rate!)) setRate(saved.current.rate!);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function remember(c: AudiobookChapter, t: number, done = false) {
    const s = saved.current;
    s.places = { ...s.places, [c.slug]: { t: Math.floor(t), d: c.duration, v: version(c), ...(done && { done }) } };
    s.current = c.slug;
    store(s);
    setPlaces(s.places);
    lastSave.current = Date.now();
  }

  function start(i: number, play = true) {
    const a = audio.current, c = chapters[i];
    if (!a || !c) return;
    if (i !== index) {
      if (chapter && a.currentTime > 0 && !a.ended) remember(chapter, a.currentTime);
      const p = saved.current.places[c.slug];
      const at = resumeAt(c, p);
      pendingSeek.current = at;
      a.src = c.url;
      a.defaultPlaybackRate = a.playbackRate = rate;
      setIndex(i);
      setTime(at);
      setLastSlug(c.slug);
      setNotice(p && !p.done && p.t > 0 && p.v !== version(c) ? 'This chapter was updated since you last listened, so it resumes at about the same point.' : '');
      saved.current.current = c.slug;
      store(saved.current);
    }
    if (play) a.play().catch(() => setPlaying(false));
  }

  function toggle(play = !playing) {
    if (index === null) return start(resumeIndex);
    if (play) audio.current?.play().catch(() => setPlaying(false));
    else audio.current?.pause();
  }

  function skip(seconds: number) {
    const a = audio.current;
    if (a && chapter) a.currentTime = Math.max(0, Math.min(a.duration || chapter.duration, a.currentTime + seconds));
  }

  function changeRate(r: number) {
    setRate(r);
    if (audio.current) audio.current.defaultPlaybackRate = audio.current.playbackRate = r;
    saved.current.rate = r;
    store(saved.current);
  }

  function changeSleep(minutes: number) {
    setNow(Date.now());
    setSleep({ minutes, until: minutes > 0 ? Date.now() + minutes * 60000 : 0 });
  }

  function positionState() {
    const a = audio.current;
    if (!a || !('mediaSession' in navigator) || !Number.isFinite(a.duration)) return;
    try { navigator.mediaSession.setPositionState({ duration: a.duration, playbackRate: a.playbackRate, position: Math.min(a.currentTime, a.duration) }); } catch { /* Not supported. */ }
  }

  useEffect(() => {
    if (sleep.minutes <= 0) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= sleep.until) { audio.current?.pause(); setSleep({ minutes: 0, until: 0 }); }
    }, 1000);
    return () => clearInterval(timer);
  }, [sleep]);

  useEffect(() => {
    if (!chapter || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: chapter.title, artist: book.author, album: book.title,
      artwork: [{ src: book.coverSmall, sizes: '600x600', type: 'image/jpeg' }, { src: book.cover, sizes: '3000x3000', type: 'image/jpeg' }],
    });
  }, [chapter, book]);

  // Lock-screen and headset controls; re-registered each render so the handlers see current state.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const handlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
      ['play', () => toggle(true)],
      ['pause', () => toggle(false)],
      ['seekbackward', d => skip(-(d.seekOffset || back))],
      ['seekforward', d => skip(d.seekOffset || ahead)],
      ['seekto', d => { if (audio.current && d.seekTime != null) audio.current.currentTime = d.seekTime; }],
      ['previoustrack', index ? () => start(index - 1) : null],
      ['nexttrack', index !== null && index < chapters.length - 1 ? () => start(index + 1) : null],
    ];
    for (const [action, handler] of handlers) {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Unsupported action. */ }
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null || e.ctrlKey || e.metaKey || e.altKey || (e.target as HTMLElement).closest('input, select, textarea, button, a')) return;
      if (e.key === ' ') { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowLeft') skip(-back);
      else if (e.key === 'ArrowRight') skip(ahead);
    };
    const onHide = () => { if (chapter && audio.current && audio.current.currentTime > 0) remember(chapter, audio.current.currentTime); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pagehide', onHide);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pagehide', onHide); };
  });

  const mainLabel = index !== null ? (playing ? 'Pause' : 'Resume')
    : resumePoint > 0 || resumeIndex > 0 ? `Continue: ${resumeChapter.title}${resumePoint > 0 ? ` at ${clock(resumePoint)}` : ''}` : 'Start listening';
  const duration = chapter?.duration || 0;
  // Whose point of view is being read: the last POV header already spoken, or the first one during the chapter title.
  const pov = chapter?.pov && (chapter.pov.findLast(([t]) => t <= time) ?? chapter.pov[0])?.[1];
  const directories = [['Apple Podcasts', book.directories.apple], ['Spotify', book.directories.spotify], ['Pocket Casts', book.directories.pocketCasts]].filter(([, url]) => url);

  return (
    <div className={`audiobook ${chapter ? 'audiobook-has-bar' : ''}`}>
      <header className="audiobook-top">
        <Link href="/media">← Media</Link>
        <Link href="/media/story">Read the story</Link>
      </header>

      <main className="audiobook-main">
        <section className="audiobook-hero">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static cover, no optimisation needed */}
          <img src={book.coverSmall} alt="Insular Imperium: The Audiobook cover" width={600} height={600} />
          <div>
            <p className="audiobook-eyebrow">The Audiobook</p>
            <h1>{book.title}</h1>
            <p className="audiobook-summary">{book.summary}</p>
            <p className="audiobook-facts">{chapters.length} chapters · {runtime(total)} · {book.narration}</p>
            <button className="audiobook-primary" onClick={() => toggle()}>{index === null || !playing ? icons.play : icons.pause}<span>{mainLabel}</span></button>
          </div>
        </section>

        <section aria-labelledby="chapters-title">
          <h2 id="chapters-title" className="audiobook-heading">Chapters</h2>
          <ol className="audiobook-chapters">
            {chapters.map((c, i) => {
              const current = i === index;
              const place = places[c.slug];
              const heard = current ? time : resumeAt(c, place);
              const status = place?.done && !current ? 'Finished' : heard > 0 ? `${clock(heard)} of ${clock(c.duration)}` : runtime(c.duration);
              return (
                <li key={c.slug} className={current ? 'is-current' : place?.done ? 'is-done' : ''}>
                  <button className="audiobook-chapter" onClick={() => (current ? toggle() : start(i))} aria-label={`${current && playing ? 'Pause' : 'Play'} ${c.title}`} aria-current={current || undefined}>
                    <span className="audiobook-track">{current && playing ? icons.pause : place?.done ? '✓' : c.track}</span>
                    <span className="audiobook-chapter-text">
                      <span className="audiobook-chapter-title">{c.title}</span>
                      <span className="audiobook-chapter-status">{status}</span>
                      {heard > 0 && !place?.done && <span className="audiobook-progress"><span style={{ width: `${Math.min(100, (heard / c.duration) * 100)}%` }} /></span>}
                    </span>
                  </button>
                  <a className="audiobook-download" href={`${c.url}?download=1`} download aria-label={`Download ${c.title} (MP3, ${Math.round(c.bytes / 1048576)} MB)`} title="Download MP3">{icons.download}</a>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="audiobook-subscribe" aria-labelledby="subscribe-title">
          <h2 id="subscribe-title" className="audiobook-heading">Listen in your podcast app</h2>
          <p>Every chapter is also published as a podcast episode, so you can download them for offline listening and pick up where you left off in the app you already use.</p>
          <div className="audiobook-links">
            {directories.map(([name, url]) => <a key={name} href={url}>{name}</a>)}
            <a href={`podcast://${book.feedUrl.replace(/^https:\/\//, '')}`}>Open in Apple Podcasts</a>
            <a href={`overcast://x-callback-url/add?url=${encodeURIComponent(book.feedUrl)}`}>Open in Overcast</a>
            <button onClick={() => navigator.clipboard?.writeText(book.feedUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }, () => {})}>{copied ? 'Copied!' : 'Copy podcast feed link'}</button>
          </div>
          <p className="audiobook-feed"><a href={book.feedUrl}>{book.feedUrl}</a></p>
        </section>
      </main>

      {chapter && (
        <div className="audiobook-bar" role="region" aria-label="Audio player">
          <div className="audiobook-bar-title">
            {pov && <strong className="audiobook-pov" title="Point of view">{pov}</strong>}
            <span>{chapter.title}</span>
            {notice && <small>{notice}</small>}
          </div>
          <div className="audiobook-seek">
            <span>{clock(time)}</span>
            <input type="range" min={0} max={duration} step={1} value={Math.min(time, duration)} aria-label="Seek" aria-valuetext={`${clock(time)} of ${clock(duration)}`}
              onChange={e => { const t = Number(e.target.value); setTime(t); if (audio.current) audio.current.currentTime = t; }} />
            <span>-{clock(duration - time)}</span>
          </div>
          <div className="audiobook-controls">
            <button onClick={() => start(index! - 1)} disabled={!index} aria-label="Previous chapter">{icons.prev}</button>
            <button onClick={() => skip(-back)} aria-label={`Back ${back} seconds`}>−{back}</button>
            <button className="audiobook-play" onClick={() => toggle()} aria-label={playing ? 'Pause' : 'Play'}>{playing ? icons.pause : icons.play}</button>
            <button onClick={() => skip(ahead)} aria-label={`Forward ${ahead} seconds`}>+{ahead}</button>
            <button onClick={() => start(index! + 1)} disabled={index === chapters.length - 1} aria-label="Next chapter">{icons.next}</button>
          </div>
          <div className="audiobook-options">
            <label>Speed<select value={rate} onChange={e => changeRate(Number(e.target.value))}>{rates.map(r => <option key={r} value={r}>{r}×</option>)}</select></label>
            <label>Sleep<select value={sleep.minutes} onChange={e => changeSleep(Number(e.target.value))}>{sleepChoices.map(([m, label]) => <option key={m} value={m}>{label}</option>)}</select></label>
            {sleep.minutes > 0 && <span className="audiobook-sleep-left" role="timer">{clock((sleep.until - now) / 1000)}</span>}
          </div>
        </div>
      )}

      <audio
        ref={audio}
        preload="metadata"
        onLoadedMetadata={e => {
          if (pendingSeek.current) e.currentTarget.currentTime = pendingSeek.current;
          pendingSeek.current = null;
          positionState();
        }}
        onTimeUpdate={e => {
          setTime(e.currentTarget.currentTime);
          if (chapter && Date.now() - lastSave.current > 5000) remember(chapter, e.currentTarget.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={e => { setPlaying(false); if (chapter && !e.currentTarget.ended) remember(chapter, e.currentTarget.currentTime); }}
        onSeeked={positionState}
        onRateChange={positionState}
        onEnded={() => {
          if (!chapter || index === null) return;
          remember(chapter, 0, true);
          const last = index === chapters.length - 1;
          // Sleeping at the end of a chapter loads the next one paused, so Play (here or on the lock screen) starts it.
          // Leaving the ended element in place replayed the finished chapter, or did nothing on some phones.
          if (sleep.minutes === endOfChapter) { setSleep({ minutes: 0, until: 0 }); setPlaying(false); if (!last) start(index + 1, false); }
          else if (!last) start(index + 1);
        }}
      />
    </div>
  );
}
