import { describe, expect, it } from 'vitest';
import { COURSE, createSimulation } from './simulation';

function fly(simulation: ReturnType<typeof createSimulation>, until: number) {
  for (let i = 0; i < until; i++) {
    const state = simulation.getState();
    const next = state.gates.find((gate) => gate.x + COURSE.gateWidth / 2 >= state.bird.x - COURSE.radius)!;
    if (state.bird.y > next.center + 20 && state.bird.velocity >= 0) simulation.flap();
    simulation.step();
  }
}
describe('flight simulation', () => {
  it('waits for start, flaps upward, then falls under gravity', () => {
    const simulation = createSimulation();
    const ready = simulation.getState();
    simulation.step();
    expect(simulation.getState()).toEqual(ready);
    simulation.start();
    simulation.step();
    expect(simulation.getState().bird.y).toBeLessThan(ready.bird.y);
    for (let i = 0; i < 30; i++) simulation.step();
    expect(simulation.getState().bird.velocity).toBeGreaterThan(0);
    simulation.dispose();
  });
  it('replays equivalent seeded input and protects observations', () => {
    const a = createSimulation(13);
    const b = createSimulation(13);
    a.start(); b.start();
    for (let i = 0; i < 700; i++) {
      fly(a, 1); fly(b, 1);
      expect(a.getState()).toEqual(b.getState());
    }
    const snapshot = a.getState();
    snapshot.bird.y = -1000;
    snapshot.gates[0].center = -1000;
    expect(a.getState()).toEqual(b.getState());
    a.dispose(); b.dispose();
  });
  it('scores cleared gates exactly once and restarts from fresh state', () => {
    const simulation = createSimulation();
    const initial = simulation.getState();
    simulation.start();
    let previous = 0;
    for (let i = 0; i < 370; i++) {
      fly(simulation, 1);
      const state = simulation.getState();
      expect(state.phase).toBe('running');
      expect(state.score - previous).toBeGreaterThanOrEqual(0);
      expect(state.score - previous).toBeLessThanOrEqual(1);
      expect(state.score).toBe(state.gates.filter((gate) => gate.scored).length);
      previous = state.score;
    }
    expect(simulation.getState().score).toBe(2);
    for (let i = 0; i < 200; i++) simulation.step();
    const crashed = simulation.getState();
    expect(crashed.phase).toBe('crashed');
    simulation.flap(); simulation.step();
    expect(simulation.getState()).toEqual(crashed);
    simulation.restart();
    const fresh = simulation.getState();
    expect(fresh.score).toBe(0);
    expect(fresh.gates).toEqual(initial.gates);
    expect(fresh.bird).toEqual(initial.bird);
    expect(fresh.tick).toBe(0);
    simulation.step();
    expect(simulation.getState().bird.velocity).toBeLessThan(0);
    simulation.dispose();
  });
  it.each(['floor', 'ceiling', 'pipe'] as const)('ends on %s without awarding a point', (hazard) => {
    const simulation = createSimulation();
    simulation.start();
    for (let i = 0; i < 500 && simulation.getState().phase === 'running'; i++) {
      const state = simulation.getState();
      if (hazard === 'ceiling') simulation.flap();
      if (hazard === 'pipe' && state.bird.y > 170 && state.bird.velocity >= 0) simulation.flap();
      simulation.step();
    }
    expect(simulation.getState().phase).toBe('crashed');
    expect(simulation.getState().crash).toBe(hazard);
    expect(simulation.getState().score).toBe(0);
    simulation.dispose();
  });
});
