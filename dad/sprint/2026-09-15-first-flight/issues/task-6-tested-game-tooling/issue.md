# Establish tested Three.js application tooling

Issue: https://github.com/greff-ai/benchmark-flappy-bird/issues/6

## Summary
Provide the internal application foundation for the approved first-flight sprint. The repository currently contains only a README, OpenSpec, and installed dad skills. Test commands are configured but their package scripts do not exist yet.

## Scope
Create a minimal Vite and TypeScript application with Three.js, Matter.js, and lucide icons available for the next feature. Add Vitest unit tests and Playwright browser smoke tests with real executable npm scripts. Keep the initial shell simple; game implementation belongs to the following feature.

## Definition of done
- npm ci, npm test, npm run typecheck, npm run build, and npm run test:e2e succeed.
- The browser smoke test opens the actual app and verifies a working, nonblank Three.js scene without console errors.
- Unit tests exercise real application behavior; no placeholder or no-op test commands.
- Build output, dependencies, and generated reports stay ignored; README documents local commands.

## Implementation sketch
Use current compatible packages and a lockfile. Prefer small modules separating simulation, renderer, and browser controls so future work can test Matter.js physics independently. Keep rendering full-bleed and establish responsive canvas sizing.

## Size
- [x] single-branch
- [ ] multi-branch

## Links
- https://github.com/greff-ai/benchmark-flappy-bird/issues/1

Related: #1

Working branch: task/6-tested-game-tooling

## Implementation deviations

None. The application remains a minimal rendered physics foundation; gameplay belongs to the following feature.

## Archived openspec change

- [Proposal](openspec/changes/archive/2026-09-15-tested-game-tooling/proposal.md)
- [Design](openspec/changes/archive/2026-09-15-tested-game-tooling/design.md)
- [Tasks](openspec/changes/archive/2026-09-15-tested-game-tooling/tasks.md)

Merged in PR https://github.com/greff-ai/benchmark-flappy-bird/pull/9
