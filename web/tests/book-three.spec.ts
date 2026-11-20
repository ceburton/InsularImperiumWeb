import { test, expect } from '@playwright/test';
import book3 from '../src/data/audiobook-book3.json';

// Typed here because the list is empty until the first chapter is published.
const chapters: { slug: string }[] = book3.chapters;

test('the media page has a Book Three reader and audiobook', async ({ page }) => {
  await page.goto('/media');
  await expect(page.getByText('New · Book Three')).toBeVisible();
  await expect(page.getByText('Coming soon', { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: "Read The King's Table →" }).click();
  await expect(page).toHaveURL(/\/media\/story\/book-three$/);
  await expect(page.locator('.reader-prose h1')).toHaveText('Chapter One: The Hours After');
  await page.goto('/media');
  await page.getByRole('link', { name: "Listen to The King's Table →" }).click();
  await expect(page).toHaveURL(/\/media\/audiobook\/book-three$/);
  await expect(page.getByRole('heading', { level: 1, name: "Insular Imperium: The King's Table" })).toBeVisible();
});

test('Book Three keeps its own place, starts in Book Two\'s look, and links to both earlier books', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/media/story');
  await expect(page.locator('.reader-page-status')).toContainText(/Page[s]? \d/);
  await page.getByRole('button', { name: /Menu/ }).click();
  await page.getByLabel('Appearance').selectOption('sepia');
  await page.getByRole('button', { name: 'Back to the book' }).click();

  // Book Two gets a look of its own; Book Three should take that one, the nearest earlier book's.
  await page.getByRole('link', { name: "The Heir's Promise", exact: true }).click();
  await expect(page).toHaveURL(/\/media\/story\/book-two$/);
  await page.getByRole('button', { name: /Menu/ }).click();
  await page.getByLabel('Appearance').selectOption('black');
  await page.getByRole('button', { name: 'Back to the book' }).click();
  await page.getByRole('button', { name: 'Next page' }).click();
  const bookTwo = await page.evaluate(() => localStorage.getItem('insular-reader-book2-v1'));

  await page.getByRole('link', { name: "The King's Table", exact: true }).click();
  await expect(page).toHaveURL(/\/media\/story\/book-three$/);
  await expect(page.locator('.reader-page-status')).toContainText(/Page[s]? 1/);
  await expect(page.locator('.reader-eyebrow')).toHaveText("INSULAR IMPERIUM · THE KING'S TABLE");
  await expect(page.locator('.story-reader')).toHaveAttribute('style', /--reader-bg: #000000/);
  await page.getByRole('button', { name: 'Next page' }).click();
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('insular-reader-book3-v1') || 'null')?.offset)).toBeGreaterThan(0);
  expect(await page.evaluate(() => localStorage.getItem('insular-reader-book2-v1'))).toBe(bookTwo);

  await page.reload();
  await expect(page.locator('.reader-page-status')).toContainText(/Pages? [3-9]/);
  await expect(page.getByRole('link', { name: "The Coward's Answer", exact: true })).toHaveAttribute('href', '/media/story');
  await page.getByRole('button', { name: /Menu/ }).click();
  await expect(page.getByRole('link', { name: "Read Book One, The Coward's Answer →" })).toHaveAttribute('href', '/media/story');
  await expect(page.getByRole('link', { name: "Read Book Two, The Heir's Promise →" })).toHaveAttribute('href', '/media/story/book-two');
  await page.getByRole('button', { name: 'Back to the book' }).click();
  await page.getByRole('link', { name: "The Heir's Promise", exact: true }).click();
  await expect(page).toHaveURL(/\/media\/story\/book-two$/);
  await expect(page.locator('.reader-page-status')).toContainText(/Pages? [2-9]/);
});

test('a first visit to Book Three falls back to Book One\'s look when Book Two was never opened', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/media/story');
  await page.getByRole('button', { name: /Menu/ }).click();
  await page.getByLabel('Appearance').selectOption('sepia');
  await page.getByRole('button', { name: 'Back to the book' }).click();
  await page.goto('/media/story/book-three');
  await expect(page.locator('.story-reader')).toHaveAttribute('style', /--reader-bg: #f2e7ce/);
});

test('the Book Three audiobook has its own podcast feed and links to the other books', async ({ page, request }) => {
  await page.goto('/media/audiobook/book-three');
  await expect(page.getByRole('link', { name: 'https://www.insularimperium.com/media/audiobook/book-three/feed.xml' })).toBeVisible();
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute('href', /book-three\/feed\.xml$/);
  await expect(page.getByRole('link', { name: "The Coward's Answer audiobook" })).toHaveAttribute('href', '/media/audiobook');
  await expect(page.getByRole('link', { name: "The Heir's Promise audiobook" })).toHaveAttribute('href', '/media/audiobook/book-two');
  await expect(page.getByRole('link', { name: "Read The King's Table" })).toHaveAttribute('href', '/media/story/book-three');
  if (chapters.length) await expect(page.locator('.audiobook-chapters li')).toHaveCount(chapters.length);
  else await expect(page.getByText('The first chapters are being recorded.')).toBeVisible();

  const res = await request.get('/media/audiobook/book-three/feed.xml');
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  expect(xml).toContain('<title>Insular Imperium: The King&apos;s Table</title>');
  expect(xml.match(/<item>/g)?.length ?? 0).toBe(chapters.length);
  for (const c of chapters) expect(xml).toContain(`<guid isPermaLink="false">insular-imperium-book-three-audiobook-${c.slug}</guid>`);
});

test('the Book One and Book Two audiobooks link to Book Three', async ({ page }) => {
  await page.goto('/media/audiobook');
  await expect(page.getByRole('link', { name: "The King's Table audiobook" })).toHaveAttribute('href', '/media/audiobook/book-three');
  await page.goto('/media/audiobook/book-two');
  await expect(page.getByRole('link', { name: "The King's Table audiobook" })).toHaveAttribute('href', '/media/audiobook/book-three');
});
