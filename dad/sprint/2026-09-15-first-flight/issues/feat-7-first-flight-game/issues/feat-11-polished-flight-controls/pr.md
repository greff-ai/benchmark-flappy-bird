## Summary

Complete the flight game with pause/resume, optional gameplay sound, and a persistent best score. Keyboard and touch players can operate accessible controls while browser audio or storage failures leave the game usable.

## Changes

- Preserve the run while paused and prevent hidden time or paused input from changing resumed flight.
- Add user-gesture-safe sound, mute, and resilient best-score storage.
- Extend the responsive lucide HUD without changing the obstacle course or physics tuning.
- Verify controls and failure handling alongside real-input gameplay and rendered output.

Validation: typecheck, 26 unit tests, 10 desktop/mobile browser tests, production build, and OpenSpec verification passed. Real inputs exercise pause/resume, mute, earned records, reload, and restart; rendered pixels and screenshots verify responsive framing.

## Openspec change

`polished-flight-controls`

Issue directory: `dad/sprint/2026-09-15-first-flight/issues/feat-7-first-flight-game/issues/feat-11-polished-flight-controls`
