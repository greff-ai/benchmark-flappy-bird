## Context

The merged game separates deterministic Matter.js state in `simulation.ts`, Three.js projection in `renderer.ts`, and DOM/input/timing in `main.ts`. It has ready/running/crashed phases, start/restart icons, and one fixed score counter. Vitest verifies physics and Playwright drives real inputs with a controlled browser clock and read-only snapshots. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:** Extend the existing boundaries so optional audio/storage failures cannot affect physics, preserve established course framing, and make keyboard/touch transitions predictable.

**Non-Goals:** Physics tuning, new scenery, music, backend records, cross-tab synchronization, or persisting mute preference.

## Decisions

- Add a paused phase plus guarded pause/resume commands in `simulation.ts`. Paused steps do nothing; pause clears pending flap input, and resume preserves velocity and the seeded course. This makes preservation directly unit-testable; a DOM-only pause flag would leave model behavior ambiguous.
- In `main.ts`, pause an active run on window blur or document hiding and require explicit resume. Reset the accumulator and previous frame timestamp on resume and visibility changes. Keep rendering the frozen course and resize normally; suppress paused wing animation. The simulation remains independent of browser lifecycle APIs.
- Add a small `audio.ts` helper with lazy Web Audio initialization only inside accepted player gestures. Default to sound enabled for the session, with short synthesized flap/score/crash effects and a master mute gain. Detect scored/crashed transitions from snapshots and play each event once. Guard API lookup, constructor, resume promises, and node operations; dispose nodes/context, silence active sounds on mute/pause, and discard missed feedback. A packaged audio engine or asset downloads add no value for three short cues.
- Add a small `records.ts` helper that accepts a storage accessor for testing. Wrap obtaining `window.localStorage`, reading, parsing, and writing independently. Store the highest earned score as a JSON number under `first-flight.best-score`; accept only nonnegative safe integers and use zero for invalid/missing data. Keep the current session's maximum in memory and attempt persistence only when it increases. Eager record writes preserve an earned record even if the player reloads before crashing.
- Extend the HUD with separate SCORE and BEST counters plus lucide pause/resume and mute controls. Preserve the existing camera, bird, pipes, and physics constants. Use at least 44px targets, visible focus, names/state/tooltips, and responsive grouping outside the main flight corridor. Buttons handle their own commands; return focus to the canvas after start/restart/resume and in-flight mute activation, while controls remain keyboard navigable in ready/paused states. Focused buttons keep native Space/Enter activation without accidental flaps; a paused playfield ignores flight keys/taps.
- Extend existing Vitest and Playwright coverage. Test helper failure paths with injected browser-service boundaries, including a throwing storage accessor and rejected audio resume. Browser tests continue using real keyboard/touch commands, clock scheduling, and read-only telemetry; API fault injection must not alter physics or score. Exercise keyboard focus after pause/resume, mute, and restart, plus earned-best reload and unavailable-service playability.

## Risks / Trade-offs

- Browser audio support and autoplay policies vary: initialize from gestures, contain synchronous/asynchronous failures, and expose an unavailable state without disrupting play.
- Focus moves during control interaction: only window focus loss pauses automatically, preserve native button activation, and verify resumed keyboard flight explicitly.
- Additional HUD content crowds portrait screens: retain the current playable corridor and check desktop, portrait, and landscape screenshots with fixed counter/control dimensions.
- Storage may fail after a valid record loads: maintain the maximum in memory even if a later write throws.

## Migration Plan

Add the new local record key without modifying existing game data; no dependency migration is needed. Complete the focused tests and full existing gate before archiving the change and merging only into `feat/7-first-flight-game`. A revert leaves the optional record key harmlessly unused.
