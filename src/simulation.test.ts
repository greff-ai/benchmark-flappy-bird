import { describe, expect, it } from 'vitest';
import { createSimulation, STEP_MS } from './simulation';

describe('pendulum simulation', () => {
  it('advances under gravity while the constraint keeps the body tethered', () => {
    const simulation = createSimulation();
    const initial = simulation.getState();
    for (let step = 0; step < 60; step++) simulation.step();
    const current = simulation.getState();
    expect(current.y).toBeGreaterThan(initial.y + 20);
    expect(current.x).toBeLessThan(initial.x - 20);
    expect(Math.hypot(current.x, current.y)).toBeCloseTo(120, 0);
    simulation.dispose();
  });

  it('produces equivalent state for equivalent starting conditions and steps', () => {
    const first = createSimulation();
    const second = createSimulation();
    for (let step = 0; step < 180; step++) {
      const delta = step % 2 === 0 ? STEP_MS : STEP_MS / 2;
      first.step(delta);
      second.step(delta);
      expect(first.getState()).toEqual(second.getState());
    }
    first.dispose();
    second.dispose();
  });

  it('returns a snapshot that cannot mutate the physics world', () => {
    const simulation = createSimulation();
    simulation.getState().x = -10000;
    expect(simulation.getState().x).toBe(120);
    simulation.dispose();
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, STEP_MS * 2])(
    'rejects invalid timestep %s before corrupting the world',
    (delta) => {
      const simulation = createSimulation();
      const initial = simulation.getState();
      expect(() => simulation.step(delta)).toThrow(RangeError);
      expect(simulation.getState()).toEqual(initial);
      simulation.dispose();
    },
  );
});
