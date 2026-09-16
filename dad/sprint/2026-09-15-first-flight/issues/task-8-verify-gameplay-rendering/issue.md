# Verify real-browser gameplay and rendering

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/8

## Summary
Prove the finished game works through real browser input and document the benchmark evidence. This internal verification task runs after the complete game feature is merged into the sprint.

## Scope
Strengthen Playwright and unit coverage for desktop/mobile gameplay, capture screenshots, and check actual canvas pixels and motion. Fix narrow regressions found during verification while keeping the feature scope unchanged.

## Definition of done
- Desktop and mobile can start, flap, score, collide, restart, pause/resume, mute, and retain best score after reload.
- Browser tests operate real controls; do not inject a fake score or bypass collision rules to claim gameplay works.
- Canvas is nonblank and visibly changes across frames; camera bounds and controls do not overlap or clip at desktop and mobile sizes.
- Screenshots and a concise verification report identify tested viewports and outcomes.
- npm test, npm run typecheck, npm run build, npm run test:e2e, and strict OpenSpec validation pass.

## Implementation sketch
Reuse the actual game API and browser controls. Read-only test telemetry is acceptable for deterministic assertions; no production god-mode shortcuts. Test mobile touch and desktop keyboard separately. Use screenshot pixel analysis and visual inspection, not only DOM assertions.

## Size
- [x] single-branch
- [ ] multi-branch

## Links
- https://github.com/greff-ai/benchmark-flappy-bird/issues/1

Related: #1
