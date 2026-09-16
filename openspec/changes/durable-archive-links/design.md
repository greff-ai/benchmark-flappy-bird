## Context

See proposal.md. Installed dad still requests repo-relative archive paths and a combined archive/link commit. Corrected source requires published commit-pinned forge URLs and two publication steps. The benchmark's product specs cover gameplay and application verification, so this documentation change declares `skip_specs: true`; no spec delta or spec sync is needed.

## Goals / Non-Goals

**Goals:** Install the corrected instructions and prove URL construction before this leaf is archived, then provide an explicit coordinator procedure for final publication checks.

**Non-Goals:** Gameplay, test-harness/framework changes, source dad edits, or rewriting historical merged PR bodies.

## Decisions

1. Refresh exactly `dad`, `dad-bug`, `dad-feature`, `dad-issue`, `dad-sprint`, `dad-sprint-plan`, `dad-sprint-pr`, `dad-sprint-update`, and `dad-task` under `.agents/skills` from `/Users/greff/Projects/greff-ai/dad/skills`. Compare all 39 relative files and bytes plus before/after hashes for unrelated installed files. Only the two corrected references are expected to differ.
2. Use a one-off temporary script with structured `gh api` requests and Playwright's DOM parser. Read PR #15's rendered HTML to demonstrate the relative href, then render absolute candidate Markdown and validate parsed hrefs and authenticated file contents for proposal/design/tasks at published commit `6adba1db1bde4d1ae710d0b1ce97c8bfdccadd03`, under `openspec/changes/archive/2026-09-16-verify-gameplay-rendering/`. This validates the procedure without requiring this unfinished change's archive. Retain the script and detailed API evidence in `/private/tmp/durable-archive-links-evidence/`, and commit a concise report beside issue #16.
3. After implementation tasks and merge gates pass, the coordinator archives this docs-only change without a spec sync, commits and pushes the archive, and reads that full published commit ID. Form `https://github.com/greff-ai/benchmark-flappy-bird/blob/<full-commit>/<archive-path>/<artifact>.md` URLs. Append identical links once to the local issue mirror, local PR mirror, remote issue body, and remote PR body; commit/push the local mirrors separately. Before merge, compare all four surfaces, parse rendered remote hrefs, and read all three targets at the pinned commit. On retry, reuse valid published links.
4. After merge and child-branch deletion, the coordinator repeats authenticated target reads and rendered-href checks, then appends final observations to issue evidence during merge bookkeeping. These are workflow gates, not implementation task prerequisites. The final sprint PR links merged children through reachable merge commits. Relative URLs and child-branch URLs are unsuitable because their resolution or lifetime differs.

## Risks / Trade-offs

- An unpublished or incorrect SHA creates unusable links: publish first and verify each target's content at the exact full SHA.
- Markdown source alone misses renderer behavior: parse actual returned HTML and compare hrefs to expected absolute URLs.
- Archive-dependent task completion would be cyclic: complete preflight evidence first, then record final leaf-specific observations at coordinator gates.
