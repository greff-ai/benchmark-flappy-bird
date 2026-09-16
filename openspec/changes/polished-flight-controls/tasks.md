## 1. Model and Browser Services

- [ ] 1.1 Add guarded pause/resume to the existing simulation and freeze paused progression; verify unchanged tick, score, bird, and gates, ignored paused inputs, clean resume, and deterministic continuation with Vitest.
- [ ] 1.2 Add gesture-initialized short audio feedback and mute handling; verify event-specific cues, immediate silence, no queued replay, and safe missing API, constructor, and rejected-resume paths with focused helper tests.
- [ ] 1.3 Add best-score loading, validation, in-memory maximum, and persistence; verify valid reload data, rejected malformed/negative/fractional/unsafe values, and throwing storage accessor/read/write paths with unit tests.

## 2. Controls and Integration

- [ ] 2.1 Wire pause/resume, focus/visibility pause and timing reset, sound, and distinct SCORE/BEST displays into the existing HUD; verify lucide names/states/tooltips, 44px targets, keyboard focus transitions, and unchanged playable framing at desktop, portrait, and landscape sizes.
- [ ] 2.2 Extend actual keyboard/touch browser runs to pause, ignore paused flaps, resume without a time jump, mute/unmute, earn and reload records, crash, and restart; verify focus behavior, optional-service failures without score/physics mutation, rendered pixels, movement, and no browser errors.
- [ ] 2.3 Run `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`; inspect desktop/mobile/landscape screenshots and validate current OpenSpec artifacts before archive and merge only into `feat/7-first-flight-game`.
