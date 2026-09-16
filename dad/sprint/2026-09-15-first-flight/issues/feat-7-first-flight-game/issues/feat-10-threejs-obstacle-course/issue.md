# Fly through a Three.js obstacle course

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/10

## Summary
Replace the tooling demonstration with a complete playable Flappy Bird interpretation. Establish a deterministic Matter.js simulation and an original full-bleed Three.js world as the first independently testable increment of the first-flight game.

## User story
As a player, I want to flap through a readable obstacle course, earn a score, and restart after a collision on my keyboard or phone.

## Acceptance criteria
- A clearly visible original yellow bird flies through green pipes in a layered cyan Three.js world with deliberate lighting and responsive camera bounds.
- Matter.js owns gravity and collision detection; real keyboard and touch/pointer inputs produce predictable flaps.
- A deterministic testable game model scores each cleared gate once, ends runs on collision, and restarts with fresh state.
- The scene fills the screen and uses stable, readable game UI without marketing, boxed previews, tutorials, or shortcut copy.
- Tests cover the model and real keyboard/touch gameplay with rendered pixels and movement; unit, e2e, typecheck, and production build pass.
- Current OpenSpec artifacts describe the delivered game, and this child merges only into feat/7-first-flight-game.

## Implementation sketch
Use the existing Vite/TypeScript/Three.js/Matter.js/lucide foundation. Build a fixed-step deterministic simulation behind the rendered scene, with read-only telemetry for browser testing and no scoring or physics bypasses. Use custom Three.js geometry with a cyan, green, yellow, and coral palette.

## Size
- [x] single-branch
- [ ] multi-branch

A complete playable loop is one independently testable milestone.

## Links
- https://github.com/greff-ai/benchmark-flappy-bird/issues/7

Working branch: `feat/10-threejs-obstacle-course`

## Deviations

None. Pause, sound, and persistent records remain scoped to issue #11.
