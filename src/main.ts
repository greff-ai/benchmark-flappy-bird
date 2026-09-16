import { createRenderer } from './renderer';
import { createSimulation, STEP_MS } from './simulation';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('canvas');
if (!canvas) throw new Error('The application canvas is missing.');

const simulation = createSimulation();
const renderer = createRenderer(canvas);
const resize = () => {
  const { width, height } = canvas.getBoundingClientRect();
  renderer.resize(width, height, window.devicePixelRatio);
  renderer.render(simulation.getState());
};
const observer = new ResizeObserver(resize);
observer.observe(canvas);
window.addEventListener('resize', resize);
resize();

let previous = performance.now();
let accumulator = 0;
let frame = 0;
function animate(now: number) {
  // Bound catch-up work after inactive tabs while keeping physics steps consistent.
  accumulator += Math.min(now - previous, 100);
  previous = now;
  while (accumulator >= STEP_MS) {
    simulation.step();
    accumulator -= STEP_MS;
  }
  renderer.render(simulation.getState());
  frame = requestAnimationFrame(animate);
}
frame = requestAnimationFrame(animate);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    simulation.dispose();
    renderer.dispose();
  });
}
