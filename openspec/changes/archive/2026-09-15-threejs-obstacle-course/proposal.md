## Why

The application currently demonstrates a tethered Matter.js body, but players cannot fly, clear obstacles, or restart a run. Issue #10 delivers the first complete playable milestone on the tested Three.js foundation.

## What Changes

- Replace the pendulum with a deterministic Matter.js flight simulation, moving pipe gates, one-time scoring, collision failure, and fresh restarts.
- Connect keyboard and touch/pointer input to ready, running, and crashed states with a compact score and start/restart controls.
- Render an original yellow bird and green pipes in a layered cyan, full-viewport Three.js world with responsive framing.
- Replace demonstration tests with model coverage and real-input browser gameplay checks, including rendered pixels and movement.
- Leave pause, audio, mute, and persistent best scores to issue #11.

## Capabilities

### New Capabilities
- `obstacle-course`: Deterministic flight, gate scoring, crash/restart, keyboard/touch controls, responsive original rendering, and real gameplay verification.

### Modified Capabilities
None. The existing `application-foundation` requirements continue to apply to the game replacing its demonstration scene.

## Impact

Updates `src/simulation.ts`, `src/renderer.ts`, `src/main.ts`, `src/style.css`, `index.html`, and their unit/browser tests. Reuses installed Matter.js, Three.js, lucide, Vitest, and Playwright; no backend or new runtime dependency is required. Implementation and eventual spec archive belong to issue #10's branch, merging only into `feat/7-first-flight-game`.
