# Polish controls, sound, and persistent records

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/11

## Summary
Finish the playable first-flight game with pause, sound, persistent records, and accessible responsive controls. Build on the completed obstacle-course increment while preserving deterministic gameplay.

## User story
As a player, I want to pause my run, choose whether to hear sound, and retain my best score across visits with comfortable controls on desktop and phone.

## Acceptance criteria
- Pause and resume preserve a run without advancing physics or score while paused.
- Mute and sound controls provide appropriate gameplay feedback and handle unavailable audio gracefully.
- The best score persists across reloads, handles unavailable or invalid storage gracefully, and is visibly distinct from the current score.
- Responsive controls use lucide icons, accessible names and tooltips, stable dimensions, keyboard focus, and ergonomic touch targets without overlapping gameplay.
- Real keyboard and touch browser tests exercise pause/resume, mute, records, restart, and visible rendering on desktop and mobile.
- Unit, e2e, typecheck, production build, and current OpenSpec artifacts pass; this child merges only into feat/7-first-flight-game.

## Implementation sketch
Extend the existing game increment with explicit pause state, user-gesture-safe audio, resilient storage, and a restrained accessible HUD. Retain the full-bleed cyan/green/yellow/coral world and avoid tutorial or marketing copy.

## Size
- [x] single-branch
- [ ] multi-branch

These finishing controls form one independently testable user-visible milestone.

## Links
- https://github.com/greff-ai/benchmark-flappy-bird/issues/7

Working branch: `feat/11-polished-flight-controls`

## Deviations

None. The controls and browser-service safeguards extend the completed obstacle course without changing its physics or geometry.

## Archived openspec change

- [Proposal](openspec/changes/archive/2026-09-15-polished-flight-controls/proposal.md)
- [Design](openspec/changes/archive/2026-09-15-polished-flight-controls/design.md)
- [Tasks](openspec/changes/archive/2026-09-15-polished-flight-controls/tasks.md)

Merged in PR https://github.com/greff-ai/benchmark-flappy-bird/pull/13
