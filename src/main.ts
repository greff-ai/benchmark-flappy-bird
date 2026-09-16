import { createElement, Play, Pause, RotateCcw, Feather, Volume2, VolumeX } from 'lucide';
import { createRenderer } from './renderer';
import { createSimulation, STEP_MS, type SimulationState } from './simulation';
import { createAudio, type AudioState } from './audio';
import { createRecords } from './records';
import './style.css';

declare global {
  interface Window {
    readonly flight: { readonly state: SimulationState; readonly audio: AudioState; readonly best: number };
  }
}
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const action = document.querySelector<HTMLButtonElement>('#action')!;
const pauseControl = document.querySelector<HTMLButtonElement>('#pause')!;
const muteControl = document.querySelector<HTMLButtonElement>('#mute')!;
const score = document.querySelector<HTMLOutputElement>('#score')!;
const best = document.querySelector<HTMLOutputElement>('#best')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const heading = document.querySelector<HTMLElement>('#state-title')!;
const status = document.querySelector<HTMLElement>('#status')!;
document.querySelector('#brand-icon')!.append(createElement(Feather));
const simulation = createSimulation();
const renderer = createRenderer(canvas);
const audio = createAudio();
const records = createRecords();
Object.defineProperty(window, 'flight', {
  configurable: true,
  value: Object.freeze(Object.defineProperties({}, {
    state: { get: () => simulation.getState() },
    audio: { get: () => audio.getState() },
    best: { get: () => records.getBest() },
  })),
});
let displayedPhase = '';
let displayedScore = -1;
let displayedBest = -1;
let displayedAudio = '';
let previous = performance.now();
let accumulator = 0;
let frame = 0;
const resetTiming = () => { previous = performance.now(); accumulator = 0; };
const focusFlight = () => canvas.focus({ preventScroll: true });

function counter(element: HTMLOutputElement, value: number) {
  element.value = String(value).padStart(2, '0');
  element.style.fontSize = value >= 100 ? `${96 / String(value).length}px` : '';
}
function syncUi() {
  const state = simulation.getState();
  if (displayedScore !== state.score) {
    if (state.score > displayedScore && displayedScore >= 0) audio.play('score');
    counter(score, state.score);
    records.record(state.score);
    displayedScore = state.score;
  }
  if (displayedBest !== records.getBest()) {
    displayedBest = records.getBest();
    counter(best, displayedBest);
  }
  if (displayedPhase !== state.phase) {
    if (state.phase === 'crashed') audio.play('crash');
    displayedPhase = state.phase;
    overlay.hidden = state.phase === 'running';
    action.replaceChildren(createElement(state.phase === 'crashed' ? RotateCcw : Play));
    const label = state.phase === 'crashed' ? 'Restart flight' : state.phase === 'paused' ? 'Resume flight' : 'Start flight';
    action.setAttribute('aria-label', label);
    action.title = label;
    heading.textContent = state.phase === 'crashed' ? 'Flight over' : state.phase === 'paused' ? 'Paused' : 'First Flight';
    status.textContent = state.phase === 'crashed' ? 'RUN COMPLETE' : state.phase === 'paused' ? 'TAKE A BREATHER' : 'OPEN SKY';
    pauseControl.disabled = state.phase === 'ready' || state.phase === 'crashed';
    pauseControl.replaceChildren(createElement(state.phase === 'paused' ? Play : Pause));
    pauseControl.setAttribute('aria-label', state.phase === 'paused' ? 'Resume flight' : 'Pause flight');
    pauseControl.setAttribute('aria-pressed', String(state.phase === 'paused'));
    pauseControl.title = state.phase === 'paused' ? 'Resume flight' : 'Pause flight';
    document.body.dataset.phase = state.phase;
  }
  const sound = audio.getState();
  const soundKey = `${sound.muted}:${sound.available}`;
  if (displayedAudio !== soundKey) {
    displayedAudio = soundKey;
    muteControl.replaceChildren(createElement(sound.muted || !sound.available ? VolumeX : Volume2));
    const label = !sound.available ? 'Sound unavailable' : sound.muted ? 'Enable sound' : 'Mute sound';
    muteControl.setAttribute('aria-label', label);
    muteControl.setAttribute('aria-pressed', String(sound.muted || !sound.available));
    muteControl.title = label;
    muteControl.disabled = !sound.available;
  }
}
function activate() {
  const phase = simulation.getState().phase;
  if (phase !== 'ready' && phase !== 'running') return;
  void audio.unlock();
  if (phase === 'ready') { simulation.start(); resetTiming(); focusFlight(); }
  else simulation.flap();
  audio.play('flap');
}
function pause() {
  simulation.pause();
  audio.silence();
  resetTiming();
  syncUi();
}
function resume() {
  void audio.unlock();
  simulation.resume();
  resetTiming();
  focusFlight();
  syncUi();
}
const pointer = (event: PointerEvent) => {
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  focusFlight();
  activate();
};
const key = (event: KeyboardEvent) => {
  if (!['Space', 'ArrowUp'].includes(event.code)) return;
  if (event.target instanceof HTMLButtonElement) return;
  event.preventDefault();
  if (!event.repeat) activate();
};
const command = () => {
  const phase = simulation.getState().phase;
  if (phase === 'paused') { resume(); return; }
  void audio.unlock();
  if (phase === 'crashed') simulation.restart();
  else simulation.start();
  audio.play('flap');
  resetTiming();
  focusFlight();
  syncUi();
};
const togglePause = () => {
  if (simulation.getState().phase === 'paused') resume();
  else if (simulation.getState().phase === 'running') pause();
};
const toggleMute = () => {
  audio.setMuted(!audio.getState().muted);
  if (!audio.getState().muted) void audio.unlock();
  if (simulation.getState().phase === 'running') focusFlight();
  syncUi();
};
const visibility = () => {
  if (document.hidden) pause();
  resetTiming();
};
const blur = () => { if (simulation.getState().phase === 'running') pause(); };
canvas.addEventListener('pointerdown', pointer);
window.addEventListener('keydown', key);
window.addEventListener('blur', blur);
document.addEventListener('visibilitychange', visibility);
action.addEventListener('click', command);
pauseControl.addEventListener('click', togglePause);
muteControl.addEventListener('click', toggleMute);
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
    window.removeEventListener('blur', blur);
    document.removeEventListener('visibilitychange', visibility);
    canvas.removeEventListener('pointerdown', pointer);
    action.removeEventListener('click', command);
    pauseControl.removeEventListener('click', togglePause);
    muteControl.removeEventListener('click', toggleMute);
    simulation.dispose();
    renderer.dispose();
    audio.dispose();
  });
}
