import { expect, type Locator, type Page } from '@playwright/test';
import { PNG } from 'pngjs';

export async function pixels(canvas: Locator, path?: string) {
  const image = PNG.sync.read(await canvas.screenshot({ path }));
  let bird = 0, pipes = 0, sumX = 0, sumY = 0;
  let minX = image.width, minY = image.height, maxX = 0, maxY = 0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const offset = (y * image.width + x) * 4;
      const [r, g, b] = image.data.subarray(offset, offset + 3);
      if (r > 185 && g > 130 && b < 150 && r > g * 1.05 && r < g * 1.6) {
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

export async function expectFraming(page: Page, canvas: Locator) {
  await expect.poll(() => canvas.evaluate((element) => {
    const c = element as HTMLCanvasElement;
    const ratio = Math.min(devicePixelRatio, 2);
    return c.width === Math.floor(innerWidth * ratio) && c.height === Math.floor(innerHeight * ratio)
      && document.documentElement.scrollWidth === innerWidth
      && document.documentElement.scrollHeight === innerHeight;
  })).toBe(true);
  const image = await pixels(canvas);
  const compactArea = Math.min(1, image.height / 500) ** 2;
  expect(image.bird).toBeGreaterThan(150 * compactArea);
  expect(image.pipes).toBeGreaterThan(300);
  expect(image.minX).toBeGreaterThan(0);
  expect(image.maxX).toBeLessThan(image.width - 1);
  expect(image.minY).toBeGreaterThan(0);
  expect(image.maxY).toBeLessThan(image.height - 1);
  for (const control of await page.locator('button:visible').all()) {
    const bounds = (await control.boundingBox())!;
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);
  }
  const viewport = page.viewportSize()!;
  const boxes = await page.locator('.brand, .scoreboard, .tools, #overlay:visible').evaluateAll((elements) =>
    elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }));
  for (const box of boxes) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  }
  for (const element of await page.locator('button:visible, .score').all()) {
    const bounds = (await element.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
    expect(await element.evaluate((node) => node.scrollWidth <= node.clientWidth && node.scrollHeight <= node.clientHeight)).toBe(true);
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y).toBe(true);
    }
  }
  return image;
}
