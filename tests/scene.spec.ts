import { expect, test, type Locator, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import { COURSE, type SimulationState } from '../src/simulation';

test.beforeEach(async ({ page }) => {
  const time = new Date('2026-09-15T12:00:00Z');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
});

async function state(page: Page): Promise<SimulationState> {
  return page.evaluate(() => window.flight.state);
}
async function pixels(canvas: Locator) {
  const image = PNG.sync.read(await canvas.screenshot());
  let bird = 0, pipes = 0, sumX = 0, sumY = 0;
  let minX = image.width, minY = image.height, maxX = 0, maxY = 0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const offset = (y * image.width + x) * 4;
      const [r, g, b] = image.data.subarray(offset, offset + 3);
      if (r > 185 && g > 130 && b < 150 && r > g * 1.05) {
        bird++; sumX += x; sumY += y;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      if (g > r * 1.2 && g > b * 1.15 && y < image.height * 0.7) pipes++;
    }
  }
  return { bird, pipes, x: sumX / bird, y: sumY / bird, minX, maxX, minY, maxY,
    width: image.width, height: image.height };
}
async function expectFraming(page: Page, canvas: Locator) {
  await expect.poll(() => canvas.evaluate((element) => {
    const c = element as HTMLCanvasElement;
    const ratio = Math.min(devicePixelRatio, 2);
    return c.width === Math.floor(innerWidth * ratio) && c.height === Math.floor(innerHeight * ratio)
      && document.documentElement.scrollWidth === innerWidth
      && document.documentElement.scrollHeight === innerHeight;
  })).toBe(true);
  const image = await pixels(canvas);
  expect(image.bird).toBeGreaterThan(150);
  expect(image.pipes).toBeGreaterThan(300);
  expect(image.minX).toBeGreaterThan(0);
  expect(image.maxX).toBeLessThan(image.width - 1);
  expect(image.minY).toBeGreaterThan(0);
  expect(image.maxY).toBeLessThan(image.height - 1);
  const bounds = await page.getByRole('button', { name: /flight/i }).boundingBox();
  if (bounds) {
    const viewport = page.viewportSize()!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
  }
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
  for (let attempt = 0; attempt < 150 && (await state(page)).score < 2; attempt++) {
    const current = await state(page);
    expect(current.phase).toBe('running');
    const next = current.gates.find((gate) => gate.x + COURSE.gateWidth / 2 >= current.bird.x - COURSE.radius)!;
    if (current.bird.y > next.center + 15 && current.bird.velocity >= 0) await flap();
    await page.clock.runFor(50);
  }
  expect((await state(page)).score).toBe(2);
  await expect(page.getByLabel('Score', { exact: true })).toHaveText('02');
  await page.screenshot({ path: testInfo.outputPath('running.png') });
  await page.clock.runFor(1500);
  await expect.poll(async () => (await state(page)).phase, { timeout: 5000 }).toBe('crashed');
  const crashed = await state(page);
  await page.clock.runFor(150);
  expect(await state(page)).toEqual(crashed);
  await page.screenshot({ path: testInfo.outputPath('crashed.png') });
  const restart = page.getByRole('button', { name: 'Restart flight' });
  if (isMobile) await restart.tap({ force: true }); else { await restart.focus(); await page.keyboard.press('Enter'); }
  await page.clock.runFor(32);
  await expect.poll(async () => (await state(page)).phase).toBe('running');
  const fresh = await state(page);
  expect(fresh.score).toBe(0);
  expect(fresh.tick).toBeLessThan(15);
  expect(fresh.gates[0].center).toBe(initial.gates[0].center);
  expect(fresh.bird.velocity).toBeLessThan(0);
  await page.reload();
  await page.setViewportSize({ width: 900, height: 500 });
  await page.clock.runFor(32);
  await expectFraming(page, canvas);
  await page.screenshot({ path: testInfo.outputPath('landscape.png') });
  expect(errors).toEqual([]);
});

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
