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

## Benchmark maintenance

As part of this verification task, refresh the nine installed dad skill directories from the locally validated source payload after recording benchmark-driven fixes. Preserve the installed OpenSpec workflows and all unrelated files. Verify the refreshed payload and rerun dad init, then include the update in this task's scoped commit and PR. This leaves the benchmark itself using the corrected skills instead of relying only on an external DAD_SKILL_DIR override.

Working branch: `task/8-verify-gameplay-rendering`

## Verification outcome

Desktop and mobile real-input gameplay passes, including two earned points, collision/restart, pause/resume, mute, and best-score reload. Added compact 320x568/568x320 framing and native-clock input/motion checks; fixed crash text covering the fallen bird on short viewports. Verification passes 26 unit tests, 14 browser cases, typecheck, build, and strict OpenSpec validation.

Refreshed all nine installed dad skill directories: 39 files match source bytes, seven unrelated files remain unchanged, and installed init passes all 11 checks. Stable screenshots, metrics, and the verification report are in `dad/sprint/2026-09-15-first-flight/issues/task-8-verify-gameplay-rendering/evidence/`.

Deviations from original issue: none. The narrow layout repair and installed-skill maintenance are within its approved scope. Existing bundle-size advisory remains; lint is not configured.
