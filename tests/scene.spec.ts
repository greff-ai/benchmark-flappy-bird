import { expect, test, type Locator } from '@playwright/test';
import { PNG } from 'pngjs';

async function inspectObject(canvas: Locator) {
  const image = PNG.sync.read(await canvas.screenshot());
  let count = 0;
  let minX = image.width;
  let minY = image.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const offset = (y * image.width + x) * 4;
      const [red, green, blue] = image.data.subarray(offset, offset + 3);
      if (red > 120 && red > green * 1.25 && red > blue * 1.25) {
        count++;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { count, minX, minY, maxX, maxY, width: image.width, height: image.height };
}

function expectFramedObject(object: Awaited<ReturnType<typeof inspectObject>>) {
  expect(object.count).toBeGreaterThan(object.width * object.height * 0.002);
  expect(object.minX).toBeGreaterThan(0);
  expect(object.minY).toBeGreaterThan(0);
  expect(object.maxX).toBeLessThan(object.width - 1);
  expect(object.maxY).toBeLessThan(object.height - 1);
  const aspect = (object.maxX - object.minX) / (object.maxY - object.minY);
  expect(aspect).toBeGreaterThan(0.8);
  expect(aspect).toBeLessThan(1.2);
}

test('renders moving, correctly framed physics at the viewport size and after resize', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  const scene = page.getByLabel('Animated three-dimensional pendulum');
  await expect(scene).toBeVisible();

  async function expectCanvasSize() {
    await expect.poll(() => scene.evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio, 2);
      return bounds.width === innerWidth && bounds.height === innerHeight
        && canvas.width === Math.floor(innerWidth * ratio)
        && canvas.height === Math.floor(innerHeight * ratio)
        && document.documentElement.scrollWidth === innerWidth
        && document.documentElement.scrollHeight === innerHeight;
    })).toBe(true);
  }

  await expectCanvasSize();
  await expect.poll(async () => (await inspectObject(scene)).count).toBeGreaterThan(100);
  const first = await inspectObject(scene);
  expectFramedObject(first);
  await expect.poll(async () => {
    const next = await inspectObject(scene);
    return Math.hypot(next.minX - first.minX, next.minY - first.minY);
  }, { timeout: 5000 }).toBeGreaterThan(8);
  await scene.screenshot({ path: testInfo.outputPath('scene.png') });

  await page.setViewportSize({ width: 900, height: 500 });
  await expectCanvasSize();
  expectFramedObject(await inspectObject(scene));
  await scene.screenshot({ path: testInfo.outputPath('resized-scene.png') });
  expect(errors).toEqual([]);
});
