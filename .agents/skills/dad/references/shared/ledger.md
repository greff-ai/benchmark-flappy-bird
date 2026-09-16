# Container ledger

`<container-dir>/tasks.md` is the durable resume point. Keep its format and
row identity stable across runs. Paths are repo-relative. Existing ledgers
using an em dash as the title separator remain valid.

```markdown
# Ledger — <title>

container: <type> <key> — <title> (<url>)
bindings: <reference path>
branch: <container branch>
parent: <parent branch>
directory: <container-dir>
created: <YYYY-MM-DD>
pr: none
updated: <YYYY-MM-DD>

## Rows

- [ ] 1. <key> — <title>
  type: <type>
  size: single-branch
  branch: <branch>
  dir: <container-dir>/issues/<branch with / replaced by ->
  depends on: none
  state: pending
  sub-step: none
  pr: none
  archived: none
  halt: none
  warnings: none
```

All keys are required. Header identity must match the active bindings.
PR values are `<number> <url>` or none. Preserve older `? <url>` recovery
records; use the URL to view that PR when needed. Never infer completion from
an archive path alone: it may have arrived in an unrelated merge.

- Append rows, numbered from 1; never remove or renumber them.
- State is pending, running, done, halted, or `blocked by <keys>`.
  Only done is checked. Unknown states or invalid size halt the affected row
  with CONFLICT and are not dispatched until repaired.
- Size is always single-branch or multi-branch. A binding that disallows
  containers accepts only single-branch children.
- Dependencies name earlier row keys. Explicit `none` means independent;
  only an omitted plan entry uses the binding default. Reject missing,
  self, or forward references and cycles.
- A retry preserves sub-step, PR, archive, warnings, and halt. Blocking a
  previously halted row does not erase its resume evidence.
- Commit only changed files owned by the container, and push before dispatch.
  Skip empty commits. A failed push preserves the commit and stops dispatch;
  a later run may push a verified local descendant of origin to recover.

## Checkpoints

Leaf tokens: branch, propose, apply, test, reconcile, verify, pr, merge-test,
archive, merge, done. Container-child tokens: plan, execute, merge-test, merge,
done. None means no completed checkpoint.

Leaf evidence: branch exists; propose has committed proposal/design/tasks/specs;
apply and later have completed tasks; archive has exactly one matching archive
and no active change; merge has a confirmed merged PR with the expected head
and base. A checkpoint is the last completed step, not the step that failed.
Resume after it, verifying its evidence first. Re-run tests after code or base
changes; do not treat an old test checkpoint as proof for a new tree.

## Child report

```text
issue: <key> <url>
branch: <child> <- <container>
pr: <number> <url> | none
archived: <archive path, nested tasks.md for a container, or none>
sub-step: <last completed token or none>
warnings: <details or none>
files written: <paths or none>
result: pass | fail
halt: <CODE>: <reason, only on failure; last line>
```

A child returns on the container branch with a clean tree.
Success requires done plus confirmed merge evidence; a failed report updates
the row and leaves it unchecked. Test and verification details may precede
this block.

## Interrupted merge recovery

For running rows or a retry with merge evidence, find the PR from the row,
the child's pr.md, the nested ledger header, or the issue's Merged in PR /
Issue PR line.
Use `dad pr view`; confirm head, base, merged state, and a mergeCommit
reachable from origin's container branch before marking done.
A leaf also needs its unique archive on that branch; a container needs its
nested ledger with all children done.

Finish missing issue bookkeeping and the done-column move, then record done.
No branch recreation and no new PR. If a known PR is closed without merging,
halt CONFLICT. If proof is absent, record an interrupted halt and resume the
child using existing checkpoint evidence; never guess that it merged.
