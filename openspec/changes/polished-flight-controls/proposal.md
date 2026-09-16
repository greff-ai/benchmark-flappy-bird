## Why

The playable obstacle course currently has no pause, audio controls, or saved record. Issue #11 completes the everyday controls players need while retaining the verified flight model and responsive scene.

## What Changes

- Add pause/resume that preserves the run and prevents inactive time or paused inputs from affecting resumed flight.
- Add optional gameplay sound with mute, user-gesture initialization, and graceful unavailable-audio handling.
- Display a separate best score that persists when storage works and remains usable in memory when it does not.
- Extend the compact HUD with accessible lucide controls and stable keyboard/touch behavior.
- Verify the new states and browser API failure cases while retaining actual-input scoring and rendering checks.

## Capabilities

### New Capabilities
- `flight-controls`: Pause/resume, controlled sound, resilient records, accessible controls, and integrated verification.

### Modified Capabilities
- `obstacle-course`: Clarify that flight inputs apply during active flight and are ignored while paused, preserving existing start and flap behavior.

## Impact

Updates `src/simulation.ts`, `src/main.ts`, `src/renderer.ts`, `src/style.css`, `index.html`, and focused unit/browser tests. Adds small audio and record helpers using browser APIs, with no new dependency or backend. The course geometry, physics tuning, and deterministic scoring stay established; issue #11 merges only into `feat/7-first-flight-game`.
