## Summary

Publish archive links as absolute GitHub blob URLs pinned to a published commit. The benchmark installs the corrected dad instructions and records live GitHub rendering and file-target verification for the archive-first publication sequence.

## Changes

- Refresh the installed archive and PR-body references from the validated source payload.
- Commit and publish archives before generating identical pinned links for the issue, PR, and both local mirrors.
- Record the relative-link regression and corrected candidate-link checks, then verify this leaf's own links before merge and after child-branch deletion.

Validation: typecheck, 26 unit tests, strict OpenSpec validation, and live candidate-link checks pass. The full merge suite and leaf-specific publication checks follow at the merge gates.

## Openspec change

durable-archive-links (documentation only; no specification sync needed)

Issue directory: `dad/sprint/2026-09-15-first-flight/issues/bug-16-durable-archive-links`

PR: 17 https://github.com/greff-ai/benchmark-flappy-bird/pull/17

## Merge verification

Typecheck, 26 unit tests, 14 browser cases, production build, and strict OpenSpec validation passed. The archive was committed and pushed before these URLs were generated. Live rendered-href and target-content checks are recorded in this issue's evidence directory.

## Archived openspec change

- [Proposal](https://github.com/greff-ai/benchmark-flappy-bird/blob/22662b04e23ac1d2284fe8b35b175c06f18f5951/openspec/changes/archive/2026-09-16-durable-archive-links/proposal.md)
- [Design](https://github.com/greff-ai/benchmark-flappy-bird/blob/22662b04e23ac1d2284fe8b35b175c06f18f5951/openspec/changes/archive/2026-09-16-durable-archive-links/design.md)
- [Tasks](https://github.com/greff-ai/benchmark-flappy-bird/blob/22662b04e23ac1d2284fe8b35b175c06f18f5951/openspec/changes/archive/2026-09-16-durable-archive-links/tasks.md)
