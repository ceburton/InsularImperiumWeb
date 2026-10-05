import { test, expect, type Page } from '@playwright/test';

async function openReader(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto('/media/story');
  await expect(page.locator('.reader-page-status')).toContainText(/Page[s]? \d/);
  await page.evaluate(() => document.fonts.ready);
}

async function assertFits(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const book = document.querySelector('.reader-book') as HTMLElement;
    const prose = document.querySelector('.reader-prose') as HTMLElement;
    return Math.abs(parseFloat(prose.style.width) - book.clientWidth) < 1 && Math.abs(parseFloat(prose.style.height) - book.clientHeight) < 1;
  })).toBe(true);
  const layout = await page.evaluate(() => {
    const box = document.querySelector('.reader-book')!.getBoundingClientRect();
    const content = document.querySelector('.reader-prose')!;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const clipped: string[] = [];
    while (walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      for (const rect of range.getClientRects()) {
        if (rect.width > 0 && rect.right > box.left + 1 && rect.left < box.right - 1 && (rect.top < box.top - 1 || rect.bottom > box.bottom + 1 || rect.left < box.left - 1 || rect.right > box.right + 1)) clipped.push(walker.currentNode.textContent!.slice(0, 30));
      }
    }
    const controls = ['.reader-toolbar', '.reader-chapterbar', '.reader-pagination'].every(selector => {
      const r = document.querySelector(selector)!.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
    });
    return { clipped, controls, scroll: document.documentElement.scrollHeight > innerHeight || document.documentElement.scrollWidth > innerWidth };
  });
  expect(layout.controls).toBe(true);
  expect(layout.scroll).toBe(false);
  expect(layout.clipped).toEqual([]);
}

async function assertChapterEndVisible(page: Page) {
  expect(await page.evaluate(() => {
    const box = document.querySelector('.reader-book')!.getBoundingClientRect();
    const walker = document.createTreeWalker(document.querySelector('.reader-prose')!, NodeFilter.SHOW_TEXT);
    let last: Text | null = null;
    while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) last = walker.currentNode as Text;
    if (!last) return false;
    const range = document.createRange();
    range.setStart(last, last.textContent!.trimEnd().length - 1);
    range.setEnd(last, last.textContent!.trimEnd().length);
    const rect = range.getBoundingClientRect();
    return rect.left >= box.left - 1 && rect.right <= box.right + 1 && rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1;
  })).toBe(true);
}

for (const size of [{ width: 1440, height: 900, spread: true }, { width: 390, height: 844, spread: false }, { width: 844, height: 390, spread: false }, { width: 320, height: 568, spread: false }]) {
  test(`pages fit ${size.width} × ${size.height} with persistent navigation`, async ({ page }) => {
    await openReader(page, size.width, size.height);
    await expect(page.locator('.reader-book')).toHaveClass(size.spread ? /reader-spread/ : /^reader-book\s*$/);
    await assertFits(page);
    if (size.width === 1440 || size.width === 390) await page.screenshot({ path: `test-results/reader-${size.width}.png` });
    const start = await page.locator('.reader-page-status').textContent();
    await page.getByRole('button', { name: 'Next page', exact: true }).click();
    await expect(page.locator('.reader-page-status')).not.toHaveText(start!);
    await assertFits(page);
    await page.getByRole('button', { name: 'Previous page', exact: true }).click();
    await expect(page.locator('.reader-page-status')).toHaveText(start!);
  });
}

test('fonts repaginate, bookmarks survive resize and reload, and one-page mode works', async ({ page }) => {
  await openReader(page, 1440, 900);
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('sunstone-reader-v2')!));
  await page.getByRole('button', { name: 'Aa Menu' }).click();
  await page.getByRole('combobox', { name: 'Font size', exact: true }).selectOption('32');
  await page.getByRole('combobox', { name: 'Line spacing', exact: true }).selectOption('2.1');
  await page.getByRole('button', { name: 'Back to the book' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sunstone-reader-v2')!).settings.size)).toBe(32);
  await assertFits(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.reader-book')).not.toHaveClass(/reader-spread/);
  await assertFits(page);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('sunstone-reader-v2')!));
  expect(after.offset).toBeGreaterThan(0);
  expect(after.offset).toBe(before.offset);
  const position = await page.locator('.reader-page-status').textContent();
  await page.reload();
  await expect(page.locator('.reader-page-status')).toHaveText(position!);
  await assertFits(page);
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.getByRole('button', { name: 'Aa Menu' }).click();
  await page.getByRole('combobox', { name: 'Page layout', exact: true }).selectOption('single');
  await page.getByRole('button', { name: 'Back to the book' }).click();
  await expect(page.locator('.reader-book')).not.toHaveClass(/reader-spread/);
  await assertFits(page);
});

test('largest fonts fit short screens and all chapter openings', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sunstone-reader-v2', JSON.stringify({ settings: { font: 'sans', size: 32, spacing: 2.1 }, chapter: 0, offset: 0 })));
  await openReader(page, 844, 390);
  for (let chapter = 0; chapter < 13; chapter++) {
    await page.getByLabel('Choose chapter').selectOption(String(chapter));
    await expect(page.locator('.reader-page-status')).toContainText(`Chapter ${chapter + 1} ·`);
    await expect(page.locator('.reader-page-status')).not.toContainText('Preparing');
    await assertFits(page);
  }
  await page.setViewportSize({ width: 320, height: 480 });
  await page.getByLabel('Choose chapter').selectOption('2');
  await expect(page.locator('.reader-page-status')).toContainText('Chapter 3 ·');
  await assertFits(page);
});

test('page turns cross chapter boundaries in both directions and finish at the end', async ({ page }) => {
  await openReader(page, 1440, 900);
  await page.getByLabel('Choose chapter').selectOption('1');
  await expect(page.locator('.reader-page-status')).toContainText('Chapter 2');
  await page.getByRole('button', { name: 'Previous page', exact: true }).click();
  await expect(page.locator('.reader-page-status')).toContainText('Chapter 1');
  await assertFits(page);
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page.locator('.reader-page-status')).toContainText('Chapter 2');
  await expect(page.locator('.reader-page-status')).toContainText('Pages 1–2');
  await page.getByLabel('Choose chapter').selectOption('12');
  await expect(page.locator('.reader-page-status')).toContainText('Chapter 13');
  const total = Number((await page.locator('.reader-page-status > span').textContent())!.split('of ')[1]);
  for (let i = 0; i < Math.ceil(total / 2) - 1; i++) await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeDisabled();
  await assertFits(page);
  await assertChapterEndVisible(page);
});

test('every chapter ending remains reachable with large text', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sunstone-reader-v2', JSON.stringify({ settings: { font: 'mono', size: 32, spacing: 2.1 }, chapter: 0, offset: 0 })));
  await openReader(page, 390, 844);
  for (let chapter = 0; chapter < 12; chapter++) {
    await page.getByLabel('Choose chapter').selectOption(String(chapter + 1));
    await expect(page.locator('.reader-page-status')).toContainText(`Chapter ${chapter + 2} ·`);
    await expect(page.locator('.reader-page-status')).not.toContainText('Preparing');
    await page.getByRole('button', { name: 'Previous page', exact: true }).click();
    await expect(page.locator('.reader-page-status')).toContainText(`Chapter ${chapter + 1} ·`);
    await expect(page.locator('.reader-page-status')).not.toContainText('Preparing');
    await assertFits(page);
    await assertChapterEndVisible(page);
  }
});

test('keyboard turns pages and the menu retains focus until dismissed', async ({ page }) => {
  await openReader(page, 1440, 900);
  await page.locator('.reader-brand').click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.reader-page-status')).toContainText('Pages 3–4');
  await page.keyboard.press('PageUp');
  await expect(page.locator('.reader-page-status')).toContainText('Pages 1–2');
  await page.getByRole('button', { name: 'Aa Menu' }).click();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Back to the book' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Aa Menu' })).toBeFocused();
});

for (const width of [1440, 390]) {
  test(`all page hotkeys work with navigation focused at width ${width}`, async ({ page }) => {
    await openReader(page, width, 900);
    const next = page.getByRole('button', { name: 'Next page', exact: true });
    await next.click();
    const start = await page.locator('.reader-page-status').textContent();
    for (const [forward, backward] of [['PageDown', 'PageUp'], ['ArrowRight', 'ArrowLeft'], ['ArrowDown', 'ArrowUp']]) {
      await page.keyboard.press(forward);
      await expect(page.locator('.reader-page-status')).not.toHaveText(start!);
      await page.keyboard.press(backward);
      await expect(page.locator('.reader-page-status')).toHaveText(start!);
    }
    await page.getByRole('button', { name: 'Previous page', exact: true }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.reader-page-status')).not.toHaveText(start!);
    await page.keyboard.press('Space');
    await expect(page.locator('.reader-page-status')).toHaveText(start!);
    await page.keyboard.press('Control+ArrowRight');
    await expect(page.locator('.reader-page-status')).toHaveText(start!);
    await page.getByRole('button', { name: 'Aa Menu' }).click();
    await page.getByRole('button', { name: 'Close menu' }).focus();
    await page.keyboard.press('PageDown');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.reader-page-status')).toHaveText(start!);
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.keyboard.press('PageUp');
    await expect(page.locator('.reader-page-status')).toContainText(width === 1440 ? 'Pages 1–2' : 'Page 1 of');
    await assertFits(page);
  });
}
