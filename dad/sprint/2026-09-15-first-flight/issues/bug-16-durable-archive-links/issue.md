# Publish durable archive links in workflow evidence

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/16

## Summary
Final sprint review found a dad documentation defect: GitHub renders archive links in PR bodies with literal relative hrefs such as openspec/changes/archive/.../proposal.md. Those resolve relative to the PR page, not the repository file tree.

## Reproduction
PR #15's GitHub HTML API response preserves the relative archive href. Archived files exist in the merged sprint, but that href does not address their repository blob URL.

## Expected behavior
Publish absolute forge blob/tree URLs pinned to a published commit containing the target. Leaf archives must be committed and pushed before generating links; local mirrors and tracker/PR bodies agree. Links remain usable after deleting the child branch.

## Scope
Refresh the benchmark's installed dad payload from the corrected source, preserving unrelated workflows. Add concise regression evidence for the source link instruction and run this leaf with the new archive-link order. Validate GitHub-rendered hrefs, authenticated file existence at the pinned commit, and usability after merge/branch deletion. No gameplay changes. The final sprint PR will provide working commit-pinned links to all completed archives; historical merged PR bodies are not rewritten.

## Definition of done
- Installed dad matches corrected source exactly; unrelated OpenSpec workflows are preserved.
- This leaf's proposal/design/tasks links are absolute, commit-pinned, and identical across issue/PR/local mirrors.
- GitHub rendering preserves those absolute hrefs and targets are readable after branch deletion.
- Full tests, typecheck, build, and strict OpenSpec validation remain green.

## Size
- [x] single-branch
- [ ] multi-branch

## Links
- https://github.com/greff-ai/benchmark-flappy-bird/issues/1
- https://github.com/greff-ai/benchmark-flappy-bird/pull/15

Related: #1

Working branch: `bug/16-durable-archive-links`
