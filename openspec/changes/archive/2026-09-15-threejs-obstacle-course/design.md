## Context

The Vite/TypeScript app already separates `simulation.ts`, `renderer.ts`, and `main.ts`. Its fixed-step loop drives a Matter.js pendulum; Vitest checks model progression and Playwright inspects moving canvas pixels at desktop/mobile sizes. See `proposal.md` for motivation. Existing foundation requirements remain applicable.

## Goals / Non-Goals

**Goals:** Keep physics independent of rendering, make each run reproducible, and preserve existing build and browser verification workflows.

**Non-Goals:** Pause, audio, records, backend services, imported game artwork, and changes to the development toolchain.

## Decisions

- Extend `simulation.ts` with ready/running/crashed states, seeded gate generation, immutable snapshots, and start/flap/restart commands. Use a fixed default seed and reset it on restart for reproducible initial layouts. Compared with wall-clock randomness, this supports precise replay and stable browser observation.
- Retain the 60 Hz accumulator in `main.ts`, consume input at tick boundaries, and bound catch-up after stalled frames. Matter.js owns gravity, bird velocity, and collisions with translated pipe bodies and floor/ceiling bodies. Gate movement and spawn intervals use simulation ticks. Process fatal contacts before pass scoring, award only after the bird's trailing edge passes a gate, and remove offscreen bodies. Handwritten collision math would duplicate the existing physics dependency.
- Keep world coordinates and game difficulty independent of viewport size. Use an orthographic Three.js camera that contains the playable vertical span and a minimum horizontal span showing the bird and next gate, expanding the other axis as necessary. Render extra scenery outside course bounds. This preserves undistorted gameplay across portrait and landscape without changing physics on resize.
- Replace pendulum geometry with original bird, pipe, and layered background geometry. Share and dispose resources, cap device pixel ratio as today, and reconcile pipe meshes by gate ID. Use cyan scenery, green pipes, a yellow bird, and coral accents with directional/ambient lighting; all geometry comes from game state except decorative motion.
- Bind Space/ArrowUp and primary pointer input once, ignore key repeats, and keep UI activation from bubbling into playfield flaps. Use semantic start/restart buttons with lucide icons, accessible names, tooltips, stable touch targets, and a compact score overlay. Continue rendering in ready/crashed states while gameplay ticks remain stopped.
- Expose only cloned observation snapshots for browser tests. Tests use Playwright's clock to advance the normal browser animation loop between real key presses or touch taps, so screenshot capture cannot interrupt the controller. They cannot inject positions, set score, disable collisions, or call simulation commands. Adapt the existing PNG color/position checks to bird/pipes and retain resize/error assertions.

## Risks / Trade-offs

- Collision geometry could disagree with visible pipe lips or the bird silhouette: align meshes and bodies and validate near-contact cases.
- Browser timing can destabilize successful-flight tests: use generous reachable gate spacing and observation-guided real input; retain deterministic unit replays for exact accounting.
- Narrow screens may reveal excessive scenery under contain framing: tune camera spans and geometry scale against portrait and landscape screenshots while preserving the same simulation bounds.

## Migration Plan

Replace the demo modules and tests together, run unit/e2e/typecheck/build checks, then archive the implemented OpenSpec change through the apply workflow. Merge only into `feat/7-first-flight-game`; reverting that implementation restores the demo without data migration.
