## Why

The approved first-flight sprint has no runnable application or executable test commands yet. Establishing a tested application foundation lets the next feature build gameplay against working rendering, physics, and verification tools.

## What Changes

- Add a minimal Vite and TypeScript application with Three.js, Matter.js, and lucide icons available to subsequent work.
- Render a simple, nonblank Three.js scene across desktop and mobile viewports, with a Matter.js-backed update separated from browser rendering and input wiring.
- Provide executable unit tests, browser smoke tests, type checking, development, and production build commands with a committed npm lockfile.
- Document setup and local commands, and keep dependencies, builds, and generated reports ignored.
- Exclude gameplay, scoring, collisions as game rules, restart, sound, persistence, and polished game controls, which belong to the following feature.

## Capabilities

### New Capabilities

- `application-foundation`: A reproducible application toolchain with a responsive Three.js shell, independently testable Matter.js simulation, and real automated verification.

### Modified Capabilities

None.

## Impact

Introduces the application entry point, small simulation/rendering/browser modules, npm manifest and lockfile, TypeScript/Vite/Vitest/Playwright configuration, and tests. Updates README and ignore patterns as needed. There are no existing application APIs or specs to migrate; the existing dad command configuration remains satisfied by the new npm scripts.
