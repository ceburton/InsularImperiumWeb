import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import data from '../src/data/audiobook.json';
import type { AudiobookChapter } from '../src/lib/audiobook';

const { chapters } = data;
const tone = readFileSync(path.join(__dirname, 'fixtures', 'tone.mp3'));

// Serve a 4-second tone for every chapter so tests never touch Bunny.
test.beforeEach(async ({ page }) => {
  await page.route('https://audio.insularimperium.com/**', route => route.fulfill({ body: tone, contentType: 'audio/mpeg' }));
});

const saved = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('insular-audiobook-v1') || 'null'));
const bar = (page: Page) => page.getByRole('region', { name: 'Audio player' });

test('lists every chapter with downloads and the podcast feed', async ({ page }) => {
  await page.goto('/media/audiobook');
  await expect(page.getByRole('heading', { level: 1, name: 'Insular Imperium' })).toBeVisible();
  await expect(page.locator('.audiobook-chapters li')).toHaveCount(chapters.length);
  await expect(page.getByRole('link', { name: new RegExp(`Download ${chapters[0].title}`) })).toHaveAttribute('href', `${chapters[0].url}?download=1`);
  await expect(page.getByRole('link', { name: 'https://www.insularimperium.com/media/audiobook/feed.xml' })).toBeVisible();
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute('href', /feed\.xml$/);
  await expect(page.getByRole('button', { name: 'Start listening' })).toBeVisible();
});

test('pause saves the place and Continue resumes it after reload', async ({ page }) => {
  await page.goto('/media/audiobook');
  await page.getByRole('button', { name: `Play ${chapters[1].title}` }).click();
  await expect(bar(page)).toContainText(chapters[1].title);
  await expect.poll(() => page.evaluate(() => document.querySelector('audio')!.currentTime)).toBeGreaterThan(1);
  await bar(page).getByRole('button', { name: 'Pause' }).click();
  await expect.poll(async () => (await saved(page)).places[chapters[1].slug].t).toBeGreaterThanOrEqual(1);
  const place = (await saved(page)).places[chapters[1].slug];
  expect(place.v).toBe(chapters[1].sha256.slice(0, 8));

  await page.reload();
  const resume = page.getByRole('button', { name: new RegExp(`^Continue: ${chapters[1].title} at 0:0${place.t}`) });
  await expect(resume).toBeVisible();
  await resume.click();
  await expect(bar(page)).toContainText(chapters[1].title);
  await expect.poll(() => page.evaluate(() => document.querySelector('audio')!.currentTime)).toBeGreaterThanOrEqual(place.t);
});

test('a finished chapter is marked and the next one starts', async ({ page }) => {
  await page.goto('/media/audiobook');
  await page.getByRole('button', { name: `Play ${chapters[0].title}` }).click();
  await bar(page).getByLabel('Speed').selectOption('2');
  await expect(bar(page)).toContainText(chapters[1].title, { timeout: 10000 });
  await expect(page.locator('.audiobook-chapters li').first()).toContainText('Finished');
  expect((await saved(page)).places[chapters[0].slug].done).toBe(true);

  await page.reload();
  await expect(bar(page)).toHaveCount(0);
  expect((await saved(page)).rate).toBe(2);
  await expect(page.getByRole('button', { name: new RegExp(`^Continue: ${chapters[1].title}`) })).toBeVisible();
});

test('chapters play on one after another without stopping, through to the last', async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { endings: number }).endings = 0;
    document.addEventListener('ended', () => (window as unknown as { endings: number }).endings++, true);
  });
  const from = chapters.length - 3;
  await page.goto('/media/audiobook');
  await page.getByRole('button', { name: `Play ${chapters[from].title}` }).click();
  await bar(page).getByLabel('Speed').selectOption('2');
  for (const c of chapters.slice(from + 1)) {
    await expect(bar(page)).toContainText(c.title, { timeout: 10000 });
    await expect(bar(page).getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  }
  // Each chapter hands over to the next while still playing; only the last one runs to its end.
  await expect.poll(async () => (await saved(page)).places[chapters.at(-1)!.slug]?.done, { timeout: 10000 }).toBe(true);
  expect(await page.evaluate(() => (window as unknown as { endings: number }).endings)).toBe(1);
  await expect(bar(page).getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  for (const c of chapters.slice(from)) expect((await saved(page)).places[c.slug].done).toBe(true);
});

test('the screen stays awake while a chapter plays and may sleep once paused', async ({ page }) => {
  await page.addInitScript(() => {
    const locks = { active: 0 };
    (window as unknown as { locks: typeof locks }).locks = locks;
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => {
      locks.active++;
      let released = false;
      return { addEventListener() {}, release: async () => { if (!released) { released = true; locks.active--; } } };
    } } });
  });
  const active = () => page.evaluate(() => (window as unknown as { locks: { active: number } }).locks.active);
  await page.goto('/media/audiobook');
  expect(await active()).toBe(0);
  await page.getByRole('button', { name: `Play ${chapters[0].title}` }).click();
  await expect.poll(active).toBe(1);
  await bar(page).getByRole('button', { name: 'Pause', exact: true }).click();
  await expect.poll(active).toBe(0);
  await bar(page).getByRole('button', { name: 'Play', exact: true }).click();
  await expect.poll(active).toBe(1);
});

test('sleep at end of chapter stops there, and Play then starts the next chapter', async ({ page }) => {
  await page.goto('/media/audiobook');
  await page.getByRole('button', { name: `Play ${chapters[0].title}` }).click();
  await bar(page).getByLabel('Speed').selectOption('2');
  await bar(page).getByLabel('Sleep').selectOption('End of chapter');
  await expect.poll(async () => (await saved(page)).places[chapters[0].slug]?.done, { timeout: 10000 }).toBe(true);
  await expect(bar(page).getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await expect(bar(page).getByLabel('Sleep')).toHaveValue('0');
  expect(await page.evaluate(() => document.querySelector('audio')!.paused)).toBe(true);
  // The next chapter is loaded but not playing, rather than the finished one sitting at its end.
  await expect(bar(page)).toContainText(chapters[1].title);
  expect(await page.evaluate(() => document.querySelector('audio')!.ended)).toBe(false);

  await bar(page).getByRole('button', { name: 'Play', exact: true }).click();
  await expect(bar(page).getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.querySelector('audio')!.currentTime)).toBeGreaterThan(0.5);
  expect(await page.evaluate(() => document.querySelector('audio')!.src)).toBe(chapters[1].url);
});

test('the player shows whose point of view is being read', async ({ page }) => {
  const c = (chapters as AudiobookChapter[]).find(ch => ch.pov?.length)!;
  await page.goto('/media/audiobook');
  await page.getByRole('button', { name: `Play ${c.title}` }).click();
  await expect(bar(page).locator('.audiobook-pov')).toHaveText(c.pov![0][1]);
});

test('a regenerated chapter resumes at the same proportion and says so', async ({ page }) => {
  const c = chapters[2];
  await page.addInitScript(([slug, d]) => localStorage.setItem('insular-audiobook-v1', JSON.stringify({ current: slug, places: { [slug]: { t: 3, d, v: 'oldversn' } } })), [c.slug, c.duration * 2] as const);
  await page.goto('/media/audiobook');
  await page.getByRole('button', { name: new RegExp(`^Continue: ${c.title} at 0:01`) }).click();
  await expect(bar(page)).toContainText('This chapter was updated since you last listened');
});

test('the podcast feed lists every chapter in order with exact file sizes', async ({ request }) => {
  const res = await request.get('/media/audiobook/feed.xml');
  expect(res.headers()['content-type']).toContain('application/rss+xml');
  const xml = await res.text();
  expect(xml).toContain('<itunes:type>serial</itunes:type>');
  const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map(m => m[0]);
  expect(items).toHaveLength(chapters.length);
  items.forEach((item, i) => {
    expect(item).toContain(`<itunes:episode>${chapters[i].track}</itunes:episode>`);
    expect(item).toContain(`<enclosure url="${chapters[i].url}" length="${chapters[i].bytes}" type="audio/mpeg"/>`);
    expect(item).toContain(`<guid isPermaLink="false">insular-imperium-audiobook-${chapters[i].slug}</guid>`);
  });
});
