## Summary

Replace the pendulum demonstration with a playable flight game. Keyboard and touch input guide an original yellow bird through green gates in a full-viewport Three.js world, with scores, collisions, and fresh restarts.

## Changes

- Deterministic fixed-step Matter.js simulation with seeded gates, one-time scoring, and pipe/floor/ceiling collisions.
- Responsive cyan scenery, original Three.js bird and pipe geometry, and compact accessible start/restart controls.
- Headless model tests and real-input desktop/mobile browser checks for gameplay, pixels, movement, and resizing.

Validation: typecheck, six unit tests, four desktop/mobile browser tests, and production build passed. Browser checks use real keyboard/touch input with controlled animation scheduling, plus rendered pixels and retained screenshots.

## Openspec change

`threejs-obstacle-course`

Issue directory: `dad/sprint/2026-09-15-first-flight/issues/feat-7-first-flight-game/issues/feat-10-threejs-obstacle-course`
