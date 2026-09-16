# Build the first-flight Flappy Bird game

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/7

## Summary
Create an immediately playable, polished Three.js interpretation of Flappy Bird. This feature is the nested-container benchmark for dad and follows the completed application tooling task.

## User story
As a player, I want to flap through a readable 3D obstacle course, improve my score, and restart quickly on desktop or phone.

## Acceptance criteria
- A full-bleed Three.js world contains a clearly visible original bird, pipes, and a layered environment, with deliberate lighting and framing.
- Matter.js owns gravity and collision detection; keyboard and touch/pointer input produce predictable flaps.
- Gates score once, collisions end a run, and restart produces a fresh playable run.
- A second independently testable feature adds pause/resume, mute/sound, persisted best score, and accessible responsive controls.
- Real tests, production build, and current OpenSpec artifacts stay green after each child.
- Child issues merge into this feature branch; the complete parent merges into the sprint, never directly into main.

## Implementation sketch
Decompose into exactly two feature leaves: Fly through a Three.js obstacle course; Polish controls, sound, and persistent records. Keep a deterministic testable simulation behind the rendered scene. Use a bright cyan sky, green pipes, yellow bird, restrained coral accents, and legible dark text; avoid boxed preview scenes or tutorial/marketing copy. Responsive camera bounds preserve the actual playable corridor.

## Size
- [ ] single-branch
- [x] multi-branch

Two user-visible increments can each pass the full suite.

## Links
- https://github.com/greff-ai/benchmark-flappy-bird/issues/1

Related: #1

Working branch: feat/7-first-flight-game

## Added after planning - 2026-09-15

| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| needs issue | Fly through a Three.js obstacle course | feature | single-branch | ready |
| needs issue | Polish controls, sound, and persistent records | feature | single-branch | ready |

## Plan
1. Fly through a Three.js obstacle course: Play a complete real-physics flight with once-per-gate scoring, collision game-over, and restart; none
2. Polish controls, sound, and persistent records: Pause and resume, control sound, retain a personal best, and use accessible responsive controls; after Fly through a Three.js obstacle course

## Sub-issues
- #10 - Fly through a Three.js obstacle course
- #11 - Polish controls, sound, and persistent records

## Added after planning - 2026-09-15
Resolved planned item "Fly through a Three.js obstacle course" to #10.
Resolved planned item "Polish controls, sound, and persistent records" to #11.

| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| #10 | Fly through a Three.js obstacle course | feature | single-branch | ready |
| #11 | Polish controls, sound, and persistent records | feature | single-branch | ready |

## Plan
1. #10: Play a complete real-physics flight with once-per-gate scoring, collision game-over, and restart; none
2. #11: Pause and resume, control sound, retain a personal best, and use accessible responsive controls; after #10
