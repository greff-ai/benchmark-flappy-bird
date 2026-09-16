import Matter from 'matter-js';

export const STEP_MS = 1000 / 60;
export const COURSE = Object.freeze({
  birdX: 140, birdY: 365, radius: 19, ceiling: 60, floor: 700,
  firstGate: 460, spacing: 310, gateWidth: 76, gap: 230, speed: 2.2,
});
export interface GateState { id: number; x: number; center: number; scored: boolean }
export interface SimulationState {
  phase: 'ready' | 'running' | 'crashed';
  tick: number;
  score: number;
  bird: { x: number; y: number; velocity: number; angle: number };
  gates: GateState[];
  crash: 'pipe' | 'floor' | 'ceiling' | null;
}
export function createSimulation(seed = 42) {
  const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.9 } });
  let bird: Matter.Body;
  let gates: (GateState & { bodies: Matter.Body[] })[] = [];
  let phase: SimulationState['phase'] = 'ready';
  let crash: SimulationState['crash'] = null;
  let score = 0;
  let tick = 0;
  let random = seed >>> 0;
  let nextId = 0;
  let pendingFlap = false;

  function addGate(x: number) {
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    const center = 320 + (random / 4294967296) * 110;
    const upper = center - COURSE.gap / 2;
    const lower = center + COURSE.gap / 2;
    const bodies = [
      Matter.Bodies.rectangle(x, (COURSE.ceiling + upper) / 2, COURSE.gateWidth,
        upper - COURSE.ceiling, { isStatic: true, label: 'pipe' }),
      Matter.Bodies.rectangle(x, (lower + COURSE.floor) / 2, COURSE.gateWidth,
        COURSE.floor - lower, { isStatic: true, label: 'pipe' }),
    ];
    gates.push({ id: nextId++, x, center, scored: false, bodies });
    Matter.Composite.add(engine.world, bodies);
  }
  function reset() {
    Matter.Composite.clear(engine.world, false);
    Matter.Engine.clear(engine);
    engine.timing.timestamp = 0;
    random = seed >>> 0;
    nextId = 0;
    score = 0;
    tick = 0;
    pendingFlap = false;
    phase = 'ready';
    crash = null;
    gates = [];
    bird = Matter.Bodies.circle(COURSE.birdX, COURSE.birdY, COURSE.radius, {
      inertia: Infinity, friction: 0, frictionAir: 0, restitution: 0, label: 'bird',
    });
    Matter.Composite.add(engine.world, [
      bird,
      Matter.Bodies.rectangle(400, COURSE.ceiling - 50, 4000, 100, { isStatic: true, label: 'ceiling' }),
      Matter.Bodies.rectangle(400, COURSE.floor + 50, 4000, 100, { isStatic: true, label: 'floor' }),
    ]);
    for (let i = 0; i < 5; i++) addGate(COURSE.firstGate + i * COURSE.spacing);
  }
  Matter.Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const obstacle = pair.bodyA === bird ? pair.bodyB : pair.bodyB === bird ? pair.bodyA : null;
      if (obstacle && phase === 'running') {
        phase = 'crashed';
        crash = obstacle.label as SimulationState['crash'];
      }
    }
  });
  reset();
  return {
    start() {
      if (phase === 'ready') { phase = 'running'; pendingFlap = true; }
    },
    flap() {
      if (phase === 'running') pendingFlap = true;
    },
    restart() {
      reset();
      phase = 'running';
      pendingFlap = true;
    },
    step() {
      if (phase !== 'running') return;
      if (pendingFlap) Matter.Body.setVelocity(bird, { x: 0, y: -5.6 });
      pendingFlap = false;
      for (const gate of gates) {
        gate.x -= COURSE.speed;
        for (const body of gate.bodies) Matter.Body.translate(body, { x: -COURSE.speed, y: 0 });
      }
      Matter.Engine.update(engine, STEP_MS);
      tick++;
      if (phase !== 'running') return;
      for (const gate of gates) {
        if (!gate.scored && gate.x + COURSE.gateWidth / 2 < bird.position.x - COURSE.radius) {
          gate.scored = true;
          score++;
        }
      }
      while (gates[0].x < -400) {
        const removed = gates.shift()!;
        for (const body of removed.bodies) Matter.Composite.remove(engine.world, body);
        addGate(gates[gates.length - 1].x + COURSE.spacing);
      }
    },
    getState(): SimulationState {
      return {
        phase, tick, score, crash,
        bird: { x: bird.position.x, y: bird.position.y, velocity: bird.velocity.y,
          angle: Math.max(-0.65, Math.min(0.9, bird.velocity.y * 0.08)) },
        gates: gates.map(({ id, x, center, scored }) => ({ id, x, center, scored })),
      };
    },
    dispose() {
      Matter.Events.off(engine, 'collisionStart');
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    },
  };
}
