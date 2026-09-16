import { expect, test, type Locator, type Page } from '@playwright/test';
import { COURSE, type SimulationState } from '../src/simulation';
import { pixels, expectFraming } from './rendering';

test.describe.configure({ mode: 'default' });

test.beforeEach(async ({ page }) => {
  const time = new Date('2026-09-15T12:00:00Z');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
});

async function state(page: Page): Promise<SimulationState> {
  return page.evaluate(() => window.flight.state);
}

test('real input clears two gates, crashes, restarts, and renders at responsive sizes', async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.clock.runFor(32);
  const canvas = page.getByLabel('First Flight obstacle course');
  await expect(page.getByRole('button', { name: 'Start flight' })).toBeVisible();
  await expectFraming(page, canvas);
  await page.screenshot({ path: testInfo.outputPath('ready.png') });
  const initial = await state(page);
  expect(initial.phase).toBe('ready');
  expect(await page.evaluate(() => window.flight.audio.ready)).toBe(false);
  const before = await pixels(canvas);
  async function flap() {
    if (isMobile) await page.touchscreen.tap(55, 250);
    else await page.keyboard.press('Space');
  }
  await flap();
  await expect.poll(async () => (await state(page)).phase).toBe('running');
  await page.clock.runFor(160);
  const after = await pixels(canvas);
  expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeGreaterThan(5);
  const pause = page.locator('#pause');
  const mute = page.locator('#mute');
  async function control(button: Locator) {
    if (isMobile) await button.tap({ force: true });
    else { await button.focus(); await page.keyboard.press('Enter'); }
  }
  if (!isMobile) {
    await page.keyboard.press('Tab');
    await expect(pause).toBeFocused();
  }
  const beforePause = await state(page);
  await control(pause);
  const paused = await state(page);
  expect(paused).toEqual({ ...beforePause, phase: 'paused' });
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
  await canvas.focus();
  await flap();
  await page.clock.fastForward(60000);
  expect(await state(page)).toEqual(paused);
  await page.screenshot({ path: testInfo.outputPath('paused.png') });
  await control(page.locator('#action'));
  await expect(canvas).toBeFocused();
  expect(await state(page)).toEqual(beforePause);
  await page.clock.runFor(32);
  expect((await state(page)).tick - beforePause.tick).toBeLessThanOrEqual(2);
  expect((await state(page)).bird.velocity).toBeGreaterThan(beforePause.bird.velocity);

  await expect.poll(() => page.evaluate(() => window.flight.audio.ready)).toBe(true);
  await control(mute);
  await expect(canvas).toBeFocused();
  await expect(mute).toHaveAttribute('aria-label', 'Enable sound');
  const mutedCues = await page.evaluate(() => window.flight.audio.played);
  await flap();
  await page.clock.runFor(32);
  expect(await page.evaluate(() => window.flight.audio.played)).toEqual(mutedCues);
  await control(mute);
  await expect(canvas).toBeFocused();
  await expect(mute).toHaveAttribute('aria-label', 'Mute sound');
  await flap();
  await page.clock.runFor(32);
  expect((await page.evaluate(() => window.flight.audio.played)).flap).toBe(mutedCues.flap + 1);
  for (let attempt = 0; attempt < 150 && (await state(page)).score < 2; attempt++) {
    const current = await state(page);
    expect(current.phase).toBe('running');
    const next = current.gates.find((gate) => gate.x + COURSE.gateWidth / 2 >= current.bird.x - COURSE.radius)!;
    if (current.bird.y > next.center + 15 && current.bird.velocity >= 0) await flap();
    await page.clock.runFor(50);
  }
  expect((await state(page)).score).toBe(2);
  await expect(page.getByLabel('Score', { exact: true })).toHaveText('02');
  await expect(page.getByLabel('Best score', { exact: true })).toHaveText('02');
  expect(await page.evaluate(() => window.flight.audio.played.score)).toBe(2);
  await page.screenshot({ path: testInfo.outputPath('running.png') });
  await page.clock.runFor(1500);
  await expect.poll(async () => (await state(page)).phase, { timeout: 5000 }).toBe('crashed');
  const crashed = await state(page);
  expect(await page.evaluate(() => window.flight.audio.played.crash)).toBe(1);
  await page.clock.runFor(150);
  expect(await state(page)).toEqual(crashed);
  await page.screenshot({ path: testInfo.outputPath('crashed.png') });
  const restart = page.getByRole('button', { name: 'Restart flight' });
  if (isMobile) await restart.tap({ force: true }); else { await restart.focus(); await page.keyboard.press('Enter'); }
  await page.clock.runFor(32);
  await expect.poll(async () => (await state(page)).phase).toBe('running');
  await expect(canvas).toBeFocused();
  const fresh = await state(page);
  expect(fresh.score).toBe(0);
  expect(fresh.tick).toBeLessThan(15);
  expect(fresh.gates[0].center).toBe(initial.gates[0].center);
  expect(fresh.bird.velocity).toBeLessThan(0);
  await expect(page.getByLabel('Best score', { exact: true })).toHaveText('02');
  await page.reload();
  await expect(page.getByLabel('Best score', { exact: true })).toHaveText('02');
  await page.setViewportSize({ width: 900, height: 500 });
  await page.clock.runFor(32);
  await expectFraming(page, canvas);
  await page.screenshot({ path: testInfo.outputPath('landscape.png') });
  expect(errors).toEqual([]);
});

test('focus and visibility loss preserve the run until explicit resume', async ({ page }) => {
  await page.goto('/');
  await page.clock.runFor(32);
  await page.keyboard.press('Space');
  await page.clock.runFor(64);
  const before = await state(page);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.clock.fastForward(60000);
  expect(await state(page)).toEqual({ ...before, phase: 'paused' });
  await page.locator('#pause').focus();
  await page.keyboard.press('Enter');
  expect(await state(page)).toEqual(before);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(60000);
  expect(await state(page)).toEqual({ ...before, phase: 'paused' });
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect((await state(page)).phase).toBe('paused');
  await page.locator('#action').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('First Flight obstacle course')).toBeFocused();
  expect(await state(page)).toEqual(before);
  await page.clock.runFor(32);
  expect((await state(page)).tick - before.tick).toBeLessThanOrEqual(2);
});

test('compact portrait and landscape keep rendered flight and controls framed', async ({ page, isMobile }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const evidence = [];
  for (const viewport of [{ width: 320, height: 568 }, { width: 568, height: 320 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.clock.runFor(32);
    const canvas = page.getByLabel('First Flight obstacle course');
    for (const phase of ['ready', 'running', 'paused', 'crashed'] as const) {
      if (phase === 'running') {
        if (isMobile) await page.touchscreen.tap(55, 220);
        else await page.keyboard.press('Space');
        await page.clock.runFor(160);
      } else if (phase === 'paused') {
        if (isMobile) await page.locator('#pause').tap();
        else await page.locator('#pause').click();
      } else if (phase === 'crashed') {
        if (isMobile) await page.locator('#action').tap();
        else await page.locator('#action').click();
        await page.clock.runFor(2000);
      }
      expect((await state(page)).phase).toBe(phase);
      const image = await expectFraming(page, canvas);
      await page.screenshot({ path: testInfo.outputPath(`${viewport.width}x${viewport.height}-${phase}.png`) });
      evidence.push({ viewport, phase, pixels: image });
    }
  }
  expect(errors).toEqual([]);
  await testInfo.attach('compact-framing.json', {
    body: JSON.stringify(evidence, null, 2), contentType: 'application/json',
  });
});

for (const failure of ['unavailable', 'invalid-record'] as const) {
  test(`plays through optional browser-service failure: ${failure}`, async ({ page, isMobile }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript((mode) => {
      if (mode === 'unavailable') {
        Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
        Object.defineProperty(window, 'AudioContext', { value: class { constructor() { throw new Error('Audio blocked'); } } });
      } else {
        localStorage.setItem('first-flight.best-score', '-4.5');
      }
    }, failure);
    await page.goto('/');
    await page.clock.runFor(32);
    await expect(page.getByLabel('Best score', { exact: true })).toHaveText('00');
    if (isMobile) await page.touchscreen.tap(55, 250);
    else await page.keyboard.press('Space');
    await page.clock.runFor(64);
    expect((await state(page)).phase).toBe('running');
    expect((await state(page)).bird.velocity).toBeLessThan(0);
    if (failure === 'unavailable') {
      await expect(page.getByRole('button', { name: 'Sound unavailable' })).toBeDisabled();
      expect(await page.evaluate(() => window.flight.audio.available)).toBe(false);
    }
    expect(errors).toEqual([]);
  });
}

test('ready control starts one flap and held keyboard repeats do not add flaps', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.clock.runFor(32);
  const start = page.getByRole('button', { name: 'Start flight' });
  if (isMobile) await start.tap({ force: true }); else await start.click({ force: true });
  await page.clock.runFor(32);
  await expect.poll(async () => (await state(page)).phase).toBe('running');
  if (!isMobile) {
    await page.keyboard.down('Space');
    for (let i = 0; i < 9; i++) {
      await page.clock.runFor(50);
      await page.keyboard.down('Space');
    }
    expect((await state(page)).bird.velocity).toBeGreaterThan(0);
    await page.keyboard.up('Space');
  } else {
    await page.clock.runFor(450);
    expect((await state(page)).bird.velocity).toBeGreaterThan(0);
  }
});
