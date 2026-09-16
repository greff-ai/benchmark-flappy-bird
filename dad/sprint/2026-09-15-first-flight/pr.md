## Summary

Build a playable full-viewport Three.js Flappy Bird game with Matter.js physics, keyboard/touch controls, pause, sound, and persistent best scores. This sprint also exercises dad's real GitHub leaf and nested-feature workflows, verifies desktop/mobile rendering, and installs the benchmark-driven setup, branch-safety, and archive-link fixes.

## Issues

| Issue | Title | Type | PR | Archived change |
| --- | --- | --- | --- | --- |
| #7 | Build the first-flight Flappy Bird game | feature | [#14](https://github.com/greff-ai/benchmark-flappy-bird/pull/14) | [Nested ledger](https://github.com/greff-ai/benchmark-flappy-bird/blob/3c214205eb6d58aa0d349a36da5e7f0395550cf9/dad/sprint/2026-09-15-first-flight/issues/feat-7-first-flight-game/tasks.md) |
| #6 | Establish tested Three.js application tooling | internal | [#9](https://github.com/greff-ai/benchmark-flappy-bird/pull/9) | [Tooling](https://github.com/greff-ai/benchmark-flappy-bird/tree/fc3f3009b61d21ce5e9418f3239faa256087e53a/openspec/changes/archive/2026-09-15-tested-game-tooling) |
| #8 | Verify real-browser gameplay and rendering | internal | [#15](https://github.com/greff-ai/benchmark-flappy-bird/pull/15) | [Verification](https://github.com/greff-ai/benchmark-flappy-bird/tree/6adba1db1bde4d1ae710d0b1ce97c8bfdccadd03/openspec/changes/archive/2026-09-16-verify-gameplay-rendering) |
| #16 | Publish durable archive links in workflow evidence | bug | [#17](https://github.com/greff-ai/benchmark-flappy-bird/pull/17) | [Archive-link correction](https://github.com/greff-ai/benchmark-flappy-bird/tree/26b1ff5f5d5243679eec8ca766e306c5991077e8/openspec/changes/archive/2026-09-16-durable-archive-links) |

Game children: #10 in [PR #12](https://github.com/greff-ai/benchmark-flappy-bird/pull/12), [flight archive](https://github.com/greff-ai/benchmark-flappy-bird/tree/3c214205eb6d58aa0d349a36da5e7f0395550cf9/openspec/changes/archive/2026-09-15-threejs-obstacle-course); #11 in [PR #13](https://github.com/greff-ai/benchmark-flappy-bird/pull/13), [controls archive](https://github.com/greff-ai/benchmark-flappy-bird/tree/3c214205eb6d58aa0d349a36da5e7f0395550cf9/openspec/changes/archive/2026-09-15-polished-flight-controls).

## Evidence

- [Gameplay verification and screenshots](https://github.com/greff-ai/benchmark-flappy-bird/blob/6adba1db1bde4d1ae710d0b1ce97c8bfdccadd03/dad/sprint/2026-09-15-first-flight/issues/task-8-verify-gameplay-rendering/evidence/README.md): actual desktop keyboard and mobile touch scoring, crash/restart, pause/resume, mute, persistence, native-clock flaps, canvas pixels/motion, and compact landscape regression coverage.
- [Archive links after branch deletion](https://github.com/greff-ai/benchmark-flappy-bird/blob/448c426eb7023a77f7b14320a735d71bca50d094/dad/sprint/2026-09-15-first-flight/issues/bug-16-durable-archive-links/evidence/README.md): identical rendered absolute URLs across four records, with authenticated target-byte verification.
- Installed dad matches all 39 source payload files; seven unrelated installed files are unchanged and all eleven init checks pass. The real GitHub contract suite passed 25 tests in this project.

## Not in this PR

No planned or discovered sprint work remains unfinished. External hosting, physical-device and non-Chromium testing, and dad distribution publication were not performed. The existing production bundle-size advisory remains; optional lint is unconfigured.

## Merge instructions

Please review and use a **merge commit**, not squash or rebase, so the sprint's issue commits remain in main. This PR is intentionally left open; main has not been merged automatically.

Suite: PASS on `59e63bed4079fb26d8cd6a4f496d0b35839fa718`: typecheck, 26 unit tests, 14 browser cases, production build, and strict OpenSpec 3/3. No repair was made during the final read-only gate. Logs: `/private/tmp/first-flight-suite-waMehj/`.

Container directory: `dad/sprint/2026-09-15-first-flight`
