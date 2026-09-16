# PR bodies

Every PR uses `dad pr open` with its own issue key; the CLI emits the tracker
linking form. Use title-file and body-file in `references/shared/cli.md`.
Never interpolate titles or prose into shell code.

## Leaf

Write to `{ISSUE_DIR}/pr.md`:

- `## Summary`: 2-5 sentences describing the result.
- `## Changes`: short behavior/file bullets.
- `## Openspec change`: change name, without links to movable active artifacts.
- `Issue directory:` with the permanent repo-relative directory.

At merge, append `## Archived openspec change` with permanent repo paths to
proposal.md, design.md, and tasks.md. A failed merge appends `## Merge issues`
with the failure and attempted repairs. Preserve these sections on retries.

## Container

Write to `<container-dir>/pr.md`:

- `## Summary`: 2-5 sentences.
- `## Issues`: table `Issue | Title | Type | PR | Archived change`, with
  merged children. Lead with user-visible changes. Include internal items but
  mark their type internal when `issueTypes.<type>.releaseNotes` is false.
  A nested container links its ledger and its leaves' archives.
- `## Not in this PR`: unfinished children and halt reasons.
- `## Merge instructions`, only when the binding requests it: ask the human
  to use a merge commit so issue commits survive on the main branch.
- `Suite:` tiers, result, and failing summary if red.
- `Container directory:` permanent repo-relative path.

Reopening an existing head with `dad pr open` updates its title/body.
Regenerate only an open PR, preserving prior audit additions from the local
mirror and remote body. Append merge-time history; never rewrite a merged PR.
A base mismatch is CONFLICT, not permission to retarget.
