import { test, expect, type Page } from '@playwright/test';

// Headless Chrome has no reliable voices, so swap in a fake speech engine and wake lock.
async function fakeSpeech(page: Page, delay = 15) {
  await page.addInitScript((delay: number) => {
    const w = window as unknown as Record<string, unknown>;
    const spoken: string[] = [];
    const locks = { requested: 0, active: 0 };
    w.__spoken = spoken;
    w.__locks = locks;
    let current: { text: string; onstart?: () => void; onend?: () => void; onerror?: (e: { error: string }) => void } | null = null;
    const fake = {
      speaking: false, pending: false,
      getVoices: () => [
        { name: 'Test English', lang: 'en-US', voiceURI: 'test-en', localService: true, default: true },
        { name: 'Test British', lang: 'en-GB', voiceURI: 'test-gb', localService: true, default: false },
        { name: 'Test French', lang: 'fr-FR', voiceURI: 'test-fr', localService: true, default: false },
      ],
      speak(u: typeof current) {
        spoken.push(u!.text);
        current = u;
        fake.speaking = true;
        setTimeout(() => {
          if (current !== u) return;
          u!.onstart?.();
          setTimeout(() => { if (current !== u) return; current = null; fake.speaking = false; u!.onend?.(); }, (w.__speechDelay as number) ?? delay);
        }, 5);
      },
      cancel() { const u = current; current = null; fake.speaking = false; u?.onerror?.({ error: 'interrupted' }); },
      addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
    w.SpeechSynthesisUtterance = class { text: string; constructor(text: string) { this.text = text; } };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => {
      locks.requested++; locks.active++;
      let released = false;
      return { addEventListener() {}, release: async () => { if (!released) { released = true; locks.active--; } } };
    } } });
  }, delay);
}

async function openReader(page: Page, theme = 'charcoal') {
  await page.addInitScript(theme => { if (!localStorage.getItem('sunstone-reader-v2')) localStorage.setItem('sunstone-reader-v2', JSON.stringify({ settings: { theme }, chapter: 0, offset: 0 })); }, theme);
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto('/media/story');
  await expect(page.locator('.reader-page-status')).toContainText(/Page \d/);
  await page.evaluate(() => document.fonts.ready);
}

const spoken = (page: Page) => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.slice());
const saved = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('sunstone-reader-v2')!));
const status = (page: Page) => page.locator('.reader-page-status > span');

async function highlightVisible(page: Page) {
  return page.evaluate(() => {
    const el = document.querySelector('.reader-speaking');
    if (!el) return false;
    const box = document.querySelector('.reader-book')!.getBoundingClientRect();
    return [...el.getClientRects()].some(r => r.right > box.left && r.left < box.right);
  });
}

for (const theme of ['charcoal', 'light']) {
  test(`listen reads, highlights, and turns pages at 412px in ${theme}`, async ({ page }) => {
    await fakeSpeech(page, 60);
    await openReader(page, theme);
    await page.getByRole('button', { name: 'Listen', exact: true }).click();
    await expect.poll(() => spoken(page)).toContain('Marcus.');
    const first = await spoken(page);
    expect(first[0]).toBe('Chapter One: The Drowned Lantern');
    expect(first.join(' ')).not.toMatch(/[*_]|Preparing|Page \d|SUNSTONE SAGA/);
    await expect(page.locator('.reader-speaking')).toHaveCount(1);
    const fits = await page.evaluate(() => [...document.querySelectorAll('.reader-toolbar > *')].every(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
    expect(fits).toBe(true);
    await page.screenshot({ path: `test-results/listen-412-${theme}.png` });
    await page.evaluate(() => { (window as unknown as { __speechDelay: number }).__speechDelay = 5; });
    await expect(status(page)).toContainText('Page 2 of', { timeout: 15000 });
    expect(await highlightVisible(page)).toBe(true);
    await page.getByRole('button', { name: 'Dim mode' }).click();
    await expect(page.getByRole('dialog', { name: 'Dim mode' })).toContainText('Chapter One: The Drowned Lantern');
    await page.screenshot({ path: `test-results/listen-412-${theme}-dim.png` });
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Exit dim mode' }).click();
    await expect(page.getByRole('button', { name: 'Listen', exact: true })).toBeVisible();
  });
}

test('pause saves the paragraph and Listen resumes there after reload', async ({ page }) => {
  await fakeSpeech(page, 40);
  await openReader(page);
  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  await expect.poll(async () => (await saved(page)).listen?.paragraph ?? 0, { intervals: [50], timeout: 15000 }).toBeGreaterThan(8);
  await page.getByRole('button', { name: 'Pause listening' }).click();
  const place = await saved(page);
  expect(place.listen.chapter).toBe(0);
  expect(place.listen.paragraph).toBeGreaterThan(2);
  const expected = await page.evaluate(p => {
    const blocks = [...document.querySelectorAll('.reader-prose h1, .reader-prose p:not(.reader-eyebrow)')].filter(e => e.textContent!.trim());
    return blocks[p].textContent!.trim().slice(0, 20);
  }, place.listen.paragraph);
  const pageText = await status(page).textContent();
  await page.reload();
  await expect(status(page)).toHaveText(pageText!);
  await page.evaluate(() => { (window as unknown as { __spoken: string[] }).__spoken.length = 0; });
  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  await expect.poll(async () => (await spoken(page))[0]?.slice(0, 20)).toBe(expected);
  await page.getByRole('button', { name: 'Pause listening' }).click();
});

test('tapping Next while listening restarts at the top of the new page', async ({ page }) => {
  await fakeSpeech(page, 400);
  await openReader(page);
  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  await expect.poll(() => spoken(page)).toHaveLength(1);
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(status(page)).toContainText('Page 2 of');
  await expect.poll(async () => (await spoken(page)).length).toBe(2);
  // The newly spoken text starts on page 2, so the highlight is on screen and the page stays put.
  expect(await highlightVisible(page)).toBe(true);
  await expect(status(page)).toContainText('Page 2 of');
  await page.getByLabel('Choose chapter').selectOption('3');
  await expect.poll(async () => (await spoken(page)).at(-1)).toBe('Chapter Three: The Clemency');
  await page.getByRole('button', { name: 'Pause listening' }).click();
});

test('narration continues into the next chapter and stops after the last', async ({ page }) => {
  await fakeSpeech(page, 2);
  await openReader(page);
  const select = page.getByLabel('Choose chapter');
  const count = await select.locator('option').count();
  for (const chapter of [0, count - 1]) {
    await select.selectOption(String(chapter));
    await expect(page.locator('.reader-page-status')).toContainText(`Chapter ${chapter + 1} ·`);
    await expect(status(page)).toContainText('Page 1');
    // Jump to the chapter's last page via Previous from the following chapter.
    if (chapter + 1 < count) {
      await select.selectOption(String(chapter + 1));
      await expect(status(page)).toContainText('Page 1');
      await page.getByRole('button', { name: 'Previous page', exact: true }).click();
    } else {
      const total = Number((await status(page).textContent())!.split('of ')[1]);
      for (let i = 1; i < total; i++) await page.getByRole('button', { name: 'Next page', exact: true }).click();
    }
    await expect(page.locator('.reader-page-status')).toContainText(`Chapter ${chapter + 1} ·`);
    await page.getByRole('button', { name: 'Listen', exact: true }).click();
    if (chapter + 1 < count) {
      await expect(page.locator('.reader-page-status')).toContainText(`Chapter ${chapter + 2} ·`, { timeout: 15000 });
      await expect.poll(() => spoken(page)).toContain('Chapter Two: The Eulogy');
      await page.getByRole('button', { name: 'Pause listening' }).click();
    } else {
      await expect(page.getByRole('button', { name: 'Listen', exact: true })).toBeVisible({ timeout: 15000 });
      expect(await page.evaluate(() => (window as unknown as { __locks: { active: number } }).__locks.active)).toBe(0);
    }
  }
});

test('wake lock follows playback and settings persist speed and English voices', async ({ page }) => {
  await fakeSpeech(page, 200);
  await openReader(page);
  const locks = () => page.evaluate(() => (window as unknown as { __locks: { active: number; requested: number } }).__locks);
  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  await expect.poll(async () => (await locks()).active).toBe(1);
  await page.getByRole('button', { name: 'Pause listening' }).click();
  await expect.poll(async () => (await locks()).active).toBe(0);
  await page.getByRole('button', { name: 'Aa Menu' }).click();
  const voice = page.getByRole('combobox', { name: 'Voice' });
  await expect(voice.locator('option')).toHaveText(['Automatic', 'Test English (en-US)', 'Test British (en-GB)']);
  await voice.selectOption('test-gb');
  await page.getByRole('combobox', { name: 'Listening speed' }).selectOption('1.5');
  await page.reload();
  await page.getByRole('button', { name: 'Aa Menu' }).click();
  await expect(page.getByRole('combobox', { name: 'Listening speed' })).toHaveValue('1.5');
  await expect(page.getByRole('combobox', { name: 'Voice' })).toHaveValue('test-gb');
});

test('Listen is hidden without speech synthesis', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    (window as unknown as Record<string, unknown>).SpeechSynthesisUtterance = undefined;
  });
  await openReader(page);
  await expect(page.getByRole('button', { name: 'Aa Menu' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Listen', exact: true })).toHaveCount(0);
});
