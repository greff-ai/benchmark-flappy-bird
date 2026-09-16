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
