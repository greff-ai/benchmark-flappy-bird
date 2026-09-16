# Durable Archive Link Preflight

September 16, 2026. Implementation baseline: `ca828e7`. This records preflight evidence; this leaf's archive publication, four-surface agreement, and post-deletion checks occur later at coordinator gates.

| Check | Result |
| --- | --- |
| Installed dad payload | 39 file paths and exact bytes match source across nine directories |
| Scope | Only `shared/pr-body.md` and `issue/single-branch/merge.md` changed |
| Unrelated installed files | All seven retained their SHA-256 hashes, including OpenSpec workflows |
| PR #15 reproduction | GitHub `body_html` contains three relative archive hrefs; URL resolution places them beneath `/pull/` rather than the repository blob tree |
| Candidate rendering | GitHub's Markdown API preserves all three absolute, full-commit-pinned hrefs |
| Target contents | Three HTTP 200 reads at the exact published SHA; decoded bytes match API blob SHA and local Git contents |
| Apply validation | Strict OpenSpec: 4 passed; gameplay, harness, dependencies, product specs, and issue #8 evidence unchanged |

Candidate archive: `openspec/changes/archive/2026-09-16-verify-gameplay-rendering`, pinned to `6adba1db1bde4d1ae710d0b1ce97c8bfdccadd03`. [Preflight observations](preflight.json) contain the actual hrefs, HTTP results, and content hashes. [Payload comparison](payload-verification.json) identifies changed references and preserved hashes. Raw rendered HTML, detailed API records, and scripts remain under `/private/tmp/durable-archive-links-evidence/`.

The temporary `check-links.mjs` uses structured `gh api` arguments/JSON input and Chromium's DOMParser. It does not publish Markdown, edit remote bodies, or introduce a repository test framework. Preflight command: `node /private/tmp/durable-archive-links-evidence/check-links.mjs preflight`.

## Coordinator Gates

1. Run the separate configured unit checkpoint, independent verification, and full merge suite including production build. Apply validates strict OpenSpec and confirms gameplay, harness, dependencies, product specs, and earlier evidence are unchanged; it does not claim the later gates have passed.
2. Archive this docs-only change with no spec delta to sync, commit and push the archive, and use its full published commit ID for all three artifact URLs.
3. Append the same absolute URLs once to local `issue.md`, local `pr.md`, the issue body, and PR body. Run the checker before merge; commit/push the local links and pre-merge evidence as a second publication step.
4. After merge and remote child-branch deletion, run the checker again and append observations during sprint bookkeeping. Preserve already published valid links on retries. Historical merged PR bodies are not rewritten.

```sh
node /private/tmp/durable-archive-links-evidence/check-links.mjs check \
  --sha <full-archive-commit> --archive <archive-directory> \
  --pr <pr-number> --issue 16 --branch bug/16-durable-archive-links \
  --issue-dir dad/sprint/2026-09-15-first-flight/issues/bug-16-durable-archive-links \
  --stage pre-merge
```

Repeat with `--stage post-delete`. Check mode parses both remote rendered bodies and rendered local mirrors, requires one identical set of three links on each surface, verifies the published commit and target bytes, and checks merged PR status plus absent remote branch in post-delete mode. Each run writes a uniquely named JSON record containing rendered HTML, hrefs, statuses, content hashes, and outcomes. Final leaf-specific results will be appended here by the coordinator.

## Leaf Publication

Archive `openspec/changes/archive/2026-09-16-durable-archive-links` was committed and pushed first at `22662b04e23ac1d2284fe8b35b175c06f18f5951`. Only then were its absolute proposal/design/tasks URLs appended to PR #17, issue #16, and both local mirrors.

Before merge: all four GitHub-rendered surfaces contained exactly the same three pinned hrefs. All three authenticated contents reads returned HTTP 200 and matched both API blob hashes and local Git bytes. [Pre-merge observations](pre-merge.json) retain rendered HTML, parsed hrefs, request outcomes, and target hashes.

Unit and merge gates passed: typecheck, 26 unit tests, 14 browser cases, production build, and strict OpenSpec (4/4 before archive; 3/3 afterward). Logs: `/private/tmp/first-flight-suite-FAxZel/unit.log` and `/private/tmp/first-flight-suite-TGwino/{full,openspec-strict}.log`. Independent verification found no issues. Lint is unconfigured; the existing bundle-size advisory remains.

Post-deletion verification: pending the authorized merge and child-branch deletion.
