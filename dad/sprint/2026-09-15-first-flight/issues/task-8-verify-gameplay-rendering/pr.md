## Summary

Verify the finished game through real keyboard and touch input, rendered pixels, and native animation timing. Compact crash-state checks found and fixed game-over text covering the fallen bird on short viewports. The benchmark now also uses the validated installed dad skills.

## Changes

- Preserve the complete real-input gameplay loop and add compact portrait/landscape and native-clock coverage, with accurate bird-pixel detection.
- Keep the fallen bird visible by raising the crash overlay on viewports at most 600px tall.
- Retain a concise verification report, measured observations, and nine inspected screenshots under the issue's evidence directory.
- Refresh nine dad skill directories; verify 39 exact-byte files, seven unchanged unrelated files, and all 11 installed init checks.

Validation: 26 unit tests, 14 browser cases, typecheck, build, and strict OpenSpec validation pass. The existing bundle-size advisory remains; lint is unconfigured. Native-clock screenshots can show natural collision after the observed second flap; metrics record the actual capture phase.

## Openspec change

verify-gameplay-rendering

Issue directory: `dad/sprint/2026-09-15-first-flight/issues/task-8-verify-gameplay-rendering`
