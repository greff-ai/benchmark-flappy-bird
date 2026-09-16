# 2026-09-15-first-flight

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/1

## Goal
Build a polished, playable Three.js Flappy Bird game and exercise dad's real GitHub sprint, leaf, nested-container, archive, merge, and recovery workflows. Feed observed workflow failures back into the dad source library.

## Scope
| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| needs issue | Establish tested Three.js application tooling | task | single-branch | new |
| needs issue | Build the first-flight Flappy Bird game | feature | multi-branch | new |
| needs issue | Verify real-browser gameplay and rendering | task | single-branch | new |

## Plan
1. Establish tested Three.js application tooling: provide Vite/TypeScript, Three.js, Matter.js, unit tests, browser smoke tests, and reproducible commands; none
2. Build the first-flight Flappy Bird game: deliver a full-bleed 3D course with keyboard/touch play, collisions, score, restart, pause, sound, and persistent best; after Establish tested Three.js application tooling
3. Verify real-browser gameplay and rendering: prove real-input play, scoring, collisions, reset, pause, persistence, nonblank moving canvas, and desktop/mobile framing; after Build the first-flight Flappy Bird game

## Out of scope
Accounts, multiplayer, external hosting, monetization, and automatic merge of this sprint into main.

## Sprint
Name: 2026-09-15-first-flight
Created: 2026-09-15

## Approval
The user approved this sprint, its nested feature split, issue/PR creation, and child merges into the sprint. The final sprint PR remains open for human review.

## Added after planning - 2026-09-15

| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| #6 | Establish tested Three.js application tooling | task | single-branch | new |

## Plan
1. #6: Provide tested application tooling; none

Resolves needs issue: Establish tested Three.js application tooling -> #6

## Added after planning - 2026-09-15

| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| #7 | Build the first-flight Flappy Bird game | feature | multi-branch | new |

## Plan
1. #7: Build and polish playable 3D gameplay; after #6

Resolves needs issue: Build the first-flight Flappy Bird game -> #7

## Added after planning - 2026-09-15

| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| #8 | Verify real-browser gameplay and rendering | task | single-branch | new |

## Plan
1. #8: Verify desktop and mobile behavior; after #7

Resolves needs issue: Verify real-browser gameplay and rendering -> #8

Working in branch: sprint/2026-09-15-first-flight

## Added after verification - 2026-09-16

| Issue | Title | Type | Size | Status |
| --- | --- | --- | --- | --- |
| #16 | Publish durable archive links in workflow evidence | bug | single-branch | new |

## Plan
1. #16: Correct and verify installed dad's commit-pinned archive links after GitHub rendering exposed broken relative URLs; after #8

This narrow follow-up is driven by the approved benchmark's final evidence review; it changes no gameplay and leaves the final sprint PR open for human review.

Sprint PR: https://github.com/greff-ai/benchmark-flappy-bird/pull/18
