# First Flight Verification

Tested implementation: `17714d9`, September 15, 2026 (America/Chicago). Chromium desktop and Pixel 7 emulation; Node 22.17.1. All screenshots below were visually inspected.

| Check | Result |
| --- | --- |
| `npm test` | 26 passed; existing deterministic model, collision, scoring, pause, audio, and storage coverage retained |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; existing 627.21 kB JavaScript chunk warning remains |
| `npm run test:e2e` | 14 passed with four workers: existing 10 cases plus compact/native-clock checks in both profiles |
| `openspec validate --all --strict` | 4 passed, 0 failed |
| Installed dad `init --tracker github --project 1 --json` | All 11 checks passed; no warnings; project settings byte-identical |

| Viewport (CSS pixels) | Input and evidence |
| --- | --- |
| 1440x900 | Keyboard gameplay: start, flap, two earned points, crash, restart, pause/resume, mute, saved best after reload; [running](desktop-running.png) |
| 412x839 | Pixel 7 touch gameplay with the same complete loop; [running](mobile-running.png) |
| 900x500 | Existing resize/framing checks retained in both profiles |
| 320x568 | Both profiles, ready/running/paused/crashed framing; [portrait](compact-portrait.png) |
| 568x320 | Both profiles, ready/running/paused/crashed framing; [landscape](compact-landscape.png), [crashed](compact-landscape-crashed.png) |

The compact checks verify canvas dimensions, no overflow, bounded controls/scores, 44px touch targets, and nonoverlapping UI groups. Visible yellow-character counts ranged from 125 to 332 pixels on desktop and 867 to 2,348 on mobile; course pixels were also present. Screenshots confirm the character and next opening are framed and distinguishable. Pixel counts use image pixels, including device scale, rather than CSS pixels.

The native-clock smoke uses actual keyboard/touch start and second-flap input with read-only animation-frame observations. Desktop velocity changed from +1.15 to -2.60; mobile changed from +0.90 to -4.10. Character centroid displacement was 345.28 image pixels on desktop and 629.10 on mobile. Browser errors: none. No model writes, scoring bypass, mocked clock, or mocked rendering are used in this smoke. Screenshot latency allowed natural collision before both final captures, after the upward second-flap response was observed.

- Desktop native clock: [before](desktop-native-before.png), [after](desktop-native-after.png).
- Mobile native clock: [before](mobile-native-before.png), [after](mobile-native-after.png).
- Exact observations: [browser metrics](browser-metrics.json).

Verification found and fixed one layout regression: at 568x320 the crashed character was covered by the game-over text, leaving only 28 recognized yellow pixels. The crash overlay now moves upward only for viewport heights at most 600px; the final landscape capture exposes 125 character pixels with no HUD overlap. Taller layouts retain their original position. Yellow detection excludes the coral restart control, and compact pixel thresholds scale by image area while larger-viewport thresholds remain unchanged.

The nine installed dad skill directories were refreshed from `/Users/greff/Projects/greff-ai/dad/skills`. All 39 relative files matched exact bytes; all seven unrelated installed files, including OpenSpec, retained their hashes. Six documentation files changed, with no stale payload files. Installed CLI verification ran without `DAD_SKILL_DIR`; setup preserved project settings.

Full logs, every final screenshot, Playwright reports, metrics, skill before/after SHA-256 manifests, and installed-init JSON are retained at `/private/tmp/first-flight-issue-8-evidence/`. The final full-suite log is `/private/tmp/first-flight-suite-sHaeMD/full.log`, also copied there as `full-passing.log`. Earlier diagnostic runs are retained separately. Lint is not configured and was explicitly skipped.

For the required merge gate, the installed-CLI runner is `/private/tmp/first-flight-suite.mjs`: run `node /private/tmp/first-flight-suite.mjs /Users/greff/Projects/greff-ai/benchmark-flappy-bird full`, followed by strict OpenSpec validation. Normal merge verification remains required; this report records the implementation check.
