import Matter from 'matter-js';

export const STEP_MS = 1000 / 60;

export interface SimulationState {
  x: number;
  y: number;
  angle: number;
}

export function createSimulation() {
  const engine = Matter.Engine.create();
  const body = Matter.Bodies.circle(120, 0, 24, { frictionAir: 0.001 });
  const tether = Matter.Constraint.create({
    pointA: { x: 0, y: 0 },
    bodyB: body,
    length: 120,
    stiffness: 1,
  });
  Matter.Composite.add(engine.world, [body, tether]);

  return {
    step(deltaMs = STEP_MS) {
      if (!Number.isFinite(deltaMs) || deltaMs <= 0 || deltaMs > STEP_MS) {
        throw new RangeError('Simulation steps must be positive and at most 1000 / 60 ms.');
      }
      Matter.Engine.update(engine, deltaMs);
    },
    getState(): SimulationState {
      return { x: body.position.x, y: body.position.y, angle: body.angle };
    },
    dispose() {
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    },
  };
}
