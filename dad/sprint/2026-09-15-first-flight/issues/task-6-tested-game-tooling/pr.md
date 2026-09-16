## Summary

Establishes a runnable Vite and TypeScript application with a responsive Three.js scene driven by Matter.js. Real unit and browser tests verify simulation behavior, visible rendering, motion, resizing, and absence of browser errors. Gameplay remains assigned to the following feature.

## Changes

- Add pinned application and test dependencies, a lockfile, and executable development, build, typecheck, unit, and browser scripts.
- Separate simulation, rendering, and browser lifecycle code; make lucide icons available for upcoming controls.
- Add eight simulation tests and desktop/mobile Chromium smoke tests using rendered pixels.
- Document setup and verification commands; preserve ignored build and test output.

## Validation

Clean `npm ci`, `npm run typecheck`, `npm test` (8 tests), `npm run build`, and `npm run test:e2e` (2 tests) passed. Desktop, mobile, and resized screenshots were inspected. The independent unit gate also passed without repairs.

Nonblocking warnings: the bundled Three.js/Matter.js output exceeds Vite's default 500 kB advisory threshold; the inherited terminal color environment emits a FORCE_COLOR/NO_COLOR warning.

## Openspec change

tested-game-tooling

Issue directory: dad/sprint/2026-09-15-first-flight/issues/task-6-tested-game-tooling
