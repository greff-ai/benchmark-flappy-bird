## Why

The finished game already has comprehensive deterministic gameplay coverage, but compact phone framing and normal browser-clock motion need explicit evidence. Issue #8 closes those verification gaps and leaves a concise, reviewable benchmark record.

## What Changes

- Retain the existing 26 unit tests and 10 desktop/mobile browser cases covering real-input gameplay, controls, records, and optional-service failures.
- Add rendered framing checks at 320x568 portrait and 568x320 landscape, plus a separate real-clock browser smoke check using keyboard/touch input and actual canvas pixels.
- Record tested viewports, commands, outcomes, and stable screenshot links in a concise verification report.
- Refresh exactly the nine installed dad skill directories from the validated local source, verify their bytes, and rerun the installed CLI's 11 init checks while preserving unrelated skills.
- Fix the reproduced short-viewport crash overlay overlap so the fallen bird remains visible, without changing gameplay rules.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `application-foundation`: Require reproducible gameplay verification evidence covering real-clock rendering and compact viewport framing.

## Impact

Changes are scoped to browser tests, a narrow crash-overlay CSS repair, curated verification documentation/screenshots, installed dad skill payloads, and this OpenSpec change. Existing game requirements, dependency choices, and full-suite merge checks remain applicable. Dad maintenance is a task-specific repository update, not a permanent game behavior requirement.
