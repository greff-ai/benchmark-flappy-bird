## Context

See proposal.md for motivation. The current suite has 26 unit tests and five browser tests run in two projects (desktop 1440x900 and Pixel 7), including genuine input-driven scoring, crashes, restart, pause/resume, mute, persisted records, and service failures. `tests/scene.spec.ts` installs a paused Playwright clock for every test, inspects PNG pixels, checks framing, and resizes to 900x500. `src/main.ts` uses requestAnimationFrame with fixed-step accumulation; `window.flight` exposes read-only observations. No product regression is currently established.

## Goals / Non-Goals

**Goals:** Add focused evidence for compact layouts and real animation scheduling; preserve existing coverage; make the benchmark's installed dad payload match the validated source.

**Non-Goals:** Duplicate comprehensive gameplay or unit cases, change gameplay rules, add dependencies or test-only mutation APIs, edit sprint ledgers, or make dad installation a permanent game requirement.

## Decisions

1. Extend existing pixel/framing checks to 320x568 and 568x320. Reuse the existing helpers and verify visible content, canvas sizing, control bounds, readable scores, and nonoverlap across relevant phases. Keep the complete desktop/mobile gameplay test and 900x500 resize coverage. Expanding every gameplay permutation would add cost without closing a distinct gap.
2. Add a separate real-clock browser spec, outside the existing file's clock-installing hook. Drive desktop keyboard and mobile touch through actual browser input; observe bounded state progression and visible bird displacement from canvas pixels while normal requestAnimationFrame runs. Never mutate state or advance a mocked clock. Existing deterministic gameplay remains responsible for exhaustive scoring and controls; this short smoke isolates scheduling/rendering failures without a timing-sensitive full flight.
3. Commit a concise report and small curated screenshot set under `dad/sprint/2026-09-15-first-flight/issues/task-8-verify-gameplay-rendering/evidence/`, using stable descriptive names for desktop/mobile running, compact portrait/landscape, and useful real-clock before/after frames. Copy full runtime outputs to `/private/tmp/first-flight-issue-8-evidence/` and keep automatic test reports ignored. Report the tested revision, actual viewport dimensions/input modes, suite totals, command outcomes, pixel/motion observations, visual inspection, and any limitation. Curated evidence is deliberate documentation, not wholesale generated test output.
4. Refresh only `.agents/skills/{dad,dad-bug,dad-feature,dad-issue,dad-sprint,dad-sprint-plan,dad-sprint-pr,dad-sprint-update,dad-task}` from matching directories in `/Users/greff/Projects/greff-ai/dad/skills`. Compare relative file sets and file bytes for all nine directories, and verify unrelated installed files including OpenSpec remain unchanged. Then invoke `node .agents/skills/dad/scripts/dad.mjs init --json` without a source override, preserving existing settings and recording all 11 checks. A source override alone would not update the installed benchmark payload.

## Risks / Trade-offs

- Real-clock timing varies by host: use bounded polling and clear movement thresholds, short input-driven runs, and browser-error collection rather than exact frame timing.
- Colored-pixel thresholds can be sensitive to viewport scale: reuse current recognition, inspect captured images, and retain meaningful bird/course assertions.
- Screenshots can become stale: identify the tested code revision and capture evidence after the final relevant changes.
- Skill refresh can accidentally touch unrelated tooling: use the exact nine-directory allowlist, compare bytes/file sets, and inspect the scoped diff.

## Migration Plan

No runtime migration is required. Implement focused tests and maintenance, run `npm test`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, and strict OpenSpec validation, then finalize evidence. Any narrow reproduced regression must have a focused regression check and documented repair. Normal merge verification remains required. The scoped commit can be reverted without changing persisted game data.
