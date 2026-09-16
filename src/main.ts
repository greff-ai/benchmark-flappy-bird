import { createElement, Play, RotateCcw, Feather } from 'lucide';
import { createRenderer } from './renderer';
import { createSimulation, STEP_MS, type SimulationState } from './simulation';
import './style.css';

declare global {
  interface Window { readonly flight: { readonly state: SimulationState } }
}
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const action = document.querySelector<HTMLButtonElement>('#action')!;
const score = document.querySelector<HTMLOutputElement>('#score')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const heading = document.querySelector<HTMLElement>('#state-title')!;
const status = document.querySelector<HTMLElement>('#status')!;
document.querySelector('#brand-icon')!.append(createElement(Feather));
const simulation = createSimulation();
const renderer = createRenderer(canvas);
Object.defineProperty(window, 'flight', {
  configurable: true,
  value: Object.freeze(Object.defineProperty({}, 'state', { get: () => simulation.getState() })),
});
let displayedPhase = '';
let displayedScore = -1;
function syncUi() {
  const state = simulation.getState();
  if (displayedScore !== state.score) {
    score.value = String(state.score).padStart(2, '0');
    score.style.fontSize = state.score >= 100 ? `${108 / String(state.score).length}px` : '';
    displayedScore = state.score;
  }
  if (displayedPhase !== state.phase) {
    displayedPhase = state.phase;
    overlay.hidden = state.phase === 'running';
    action.replaceChildren(createElement(state.phase === 'crashed' ? RotateCcw : Play));
    const label = state.phase === 'crashed' ? 'Restart flight' : 'Start flight';
    action.setAttribute('aria-label', label);
    action.title = label;
    heading.textContent = state.phase === 'crashed' ? 'Flight over' : 'First Flight';
    status.textContent = state.phase === 'crashed' ? 'RUN COMPLETE' : 'OPEN SKY';
    document.body.dataset.phase = state.phase;
  }
}
function activate() {
  const phase = simulation.getState().phase;
  if (phase === 'ready') simulation.start();
  else if (phase === 'running') simulation.flap();
}
const pointer = (event: PointerEvent) => {
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  activate();
};
const key = (event: KeyboardEvent) => {
  if (!['Space', 'ArrowUp'].includes(event.code)) return;
  if (event.target instanceof HTMLButtonElement) return;
  event.preventDefault();
  if (!event.repeat) activate();
};
const command = () => {
  if (simulation.getState().phase === 'crashed') simulation.restart();
  else simulation.start();
  action.blur();
  canvas.focus({ preventScroll: true });
};
canvas.addEventListener('pointerdown', pointer);
window.addEventListener('keydown', key);
action.addEventListener('click', command);
const resize = () => {
  const { width, height } = canvas.getBoundingClientRect();
  renderer.resize(width, height, window.devicePixelRatio);
  renderer.render(simulation.getState(), performance.now());
};
const observer = new ResizeObserver(resize);
observer.observe(canvas);
window.addEventListener('resize', resize);
resize();
syncUi();
let previous = performance.now();
let accumulator = 0;
let frame = 0;
function animate(now: number) {
  accumulator += Math.min(now - previous, 100);
  previous = now;
  while (accumulator >= STEP_MS) {
    simulation.step();
    accumulator -= STEP_MS;
  }
  syncUi();
  renderer.render(simulation.getState(), now);
  frame = requestAnimationFrame(animate);
}
frame = requestAnimationFrame(animate);
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', key);
    canvas.removeEventListener('pointerdown', pointer);
    action.removeEventListener('click', command);
    simulation.dispose();
    renderer.dispose();
  });
}
