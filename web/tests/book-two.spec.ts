import { test, expect } from '@playwright/test';
import book2 from '../src/data/audiobook-book2.json';

const { chapters } = book2;

test('the media page has a Book Two reader and audiobook', async ({ page }) => {
  await page.goto('/media');
  await expect(page.getByRole('link', { name: "Read The Coward's Answer →" })).toHaveAttribute('href', '/media/story');
  await expect(page.getByRole('link', { name: "Listen to The Coward's Answer →" })).toHaveAttribute('href', '/media/audiobook');
  await page.getByRole('link', { name: "Read The King's Table →" }).click();
  await expect(page).toHaveURL(/\/media\/story\/book-two$/);
  await expect(page.locator('.reader-prose h1')).toHaveText('Chapter One: The Dullest Day');
  await page.goto('/media');
  await page.getByRole('link', { name: "Listen to The King's Table →" }).click();
  await expect(page).toHaveURL(/\/media\/audiobook\/book-two$/);
  await expect(page.getByRole('heading', { level: 1, name: "Insular Imperium: The King's Table" })).toBeVisible();
});

test('Book Two keeps its own place, starts in Book One\'s look, and links between the books', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/media/story');
  await expect(page.locator('.reader-page-status')).toContainText(/Page[s]? \d/);
  await page.getByRole('button', { name: /Menu/ }).click();
  await page.getByLabel('Appearance').selectOption('sepia');
  await page.getByRole('button', { name: 'Back to the book' }).click();
  await page.getByRole('button', { name: 'Next page' }).click();
  const bookOne = await page.evaluate(() => localStorage.getItem('insular-reader-v2'));

  await page.getByRole('link', { name: "The King's Table", exact: true }).click();
  await expect(page).toHaveURL(/\/media\/story\/book-two$/);
  await expect(page.locator('.reader-page-status')).toContainText(/Page[s]? 1/);
  await expect(page.locator('.reader-eyebrow')).toHaveText("INSULAR IMPERIUM · THE KING'S TABLE");
  await expect(page.locator('.story-reader')).toHaveAttribute('style', /--reader-bg: #f2e7ce/);
  await page.getByRole('button', { name: 'Next page' }).click();
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('insular-reader-book2-v1') || 'null')?.offset)).toBeGreaterThan(0);
  expect(await page.evaluate(() => localStorage.getItem('insular-reader-v2'))).toBe(bookOne);

  await page.reload();
  await expect(page.locator('.reader-page-status')).toContainText(/Pages? [3-9]/);
  await page.getByRole('link', { name: "The Coward's Answer", exact: true }).click();
  await expect(page).toHaveURL(/\/media\/story$/);
  await expect(page.locator('.reader-page-status')).toContainText(/Pages? [2-9]/);
});

test('the Book Two audiobook has its own podcast feed and links back to Book One', async ({ page, request }) => {
  await page.goto('/media/audiobook/book-two');
  await expect(page.getByRole('link', { name: 'https://www.insularimperium.com/media/audiobook/book-two/feed.xml' })).toBeVisible();
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute('href', /book-two\/feed\.xml$/);
  await expect(page.getByRole('link', { name: "The Coward's Answer audiobook" })).toHaveAttribute('href', '/media/audiobook');
  await expect(page.getByRole('link', { name: "Read The King's Table" })).toHaveAttribute('href', '/media/story/book-two');
  if (chapters.length) await expect(page.locator('.audiobook-chapters li')).toHaveCount(chapters.length);
  else await expect(page.getByText('The first chapters are being recorded.')).toBeVisible();

  const res = await request.get('/media/audiobook/book-two/feed.xml');
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  expect(xml).toContain('<title>Insular Imperium: The King&apos;s Table</title>');
  expect(xml.match(/<item>/g)?.length ?? 0).toBe(chapters.length);
  for (const c of chapters) expect(xml).toContain(`<guid isPermaLink="false">insular-imperium-book-two-audiobook-${c.slug}</guid>`);
});
