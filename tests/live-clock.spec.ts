import { expect, test } from '@playwright/test';
import { pixels } from './rendering';

test('native browser clock renders keyboard and touch flight motion', async ({ page, isMobile }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  const canvas = page.getByLabel('First Flight obstacle course');
  await expect(page.getByRole('button', { name: 'Start flight' })).toBeVisible();
  const before = await pixels(canvas, testInfo.outputPath('native-before.png'));
  const state = () => page.evaluate(() => window.flight.state);
  async function flap() {
    if (isMobile) await page.touchscreen.tap(55, 250);
    else await page.keyboard.press('Space');
  }
  await flap();
  const falling = (await (await page.waitForFunction(() => {
    const current = window.flight.state;
    return current.phase === 'running' && current.tick > 5 && current.bird.velocity > 0 ? current : null;
  })).jsonValue())!;
  expect(falling.phase).toBe('running');
  const rising = page.waitForFunction(() => {
    const current = window.flight.state;
    return current.phase === 'running' && current.bird.velocity < 0 ? current : null;
  });
  await flap();
  const flapped = (await (await rising).jsonValue())!;
  expect(flapped.tick).toBeGreaterThan(falling.tick);
  expect(flapped.phase).toBe('running');
  // Capture after input assertions: screenshot latency must not race the next flap.
  const after = await pixels(canvas, testInfo.outputPath('native-after.png'));
  const captured = await state();
  expect(before.bird).toBeGreaterThan(150);
  expect(after.bird).toBeGreaterThan(150);
  expect(after.pipes).toBeGreaterThan(300);
  const displacement = Math.hypot(after.x - before.x, after.y - before.y);
  expect(displacement).toBeGreaterThan(5);
  expect(errors).toEqual([]);
  await testInfo.attach('native-motion.json', {
    body: JSON.stringify({ viewport: page.viewportSize(), input: isMobile ? 'touch' : 'keyboard',
      before, after, displacement, falling, flapped, captured, errors }, null, 2),
    contentType: 'application/json',
  });
});
