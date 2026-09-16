## Context

See proposal.md for motivation. The repository contains a one-line README, empty OpenSpec capability inventory, installed workflow skills, and sprint records. It has no package manifest, source, or tests. dad/settings.json already invokes `npm test`, `npm run test:e2e`, and `npm run typecheck`. Existing ignore patterns cover node_modules, dist, test-results, and playwright-report.

## Goals / Non-Goals

**Goals:** Keep the shell small and provide stable module boundaries between a Matter.js simulation, Three.js rendering, and browser lifecycle wiring. Make the same simulation used by the scene independently testable without a DOM or WebGL context.

**Non-Goals:** Do not establish game rules or a reusable engine framework. Do not require a UI framework or introduce external asset services for this geometric foundation scene.

## Decisions

1. Use a plain TypeScript Vite entry point with npm scripts and a committed package-lock.json. Include Three.js, Matter.js, and lucide's browser-compatible package, with required type packages. Select mutually compatible current versions during apply and document their supported Node version. A UI framework adds no value to this shell; leaving versions for installation avoids an unverified version prescription.
2. Separate simulation, renderer, and browser composition into small modules. The simulation owns a Matter.js engine and representative body state, accepts explicit elapsed simulation steps, and exposes state for rendering. The renderer maps that state into a visible scene object. The browser entry owns animation scheduling and responsive sizing. Keep controls wiring separate from physics as future controls arrive; do not add empty abstractions for unimplemented input. A single module would make headless physics tests depend on browser setup.
3. Use an unframed canvas filling the viewport and a clearly visible geometric scene. Resize both the drawing buffer and camera projection from the current container bounds. Keep the representative object visible and visibly update it through actual physics-backed state. This is a tooling demonstration, not a playable course; visual details can be chosen during apply without changing requirements.
4. Use Vitest for real simulation behavior, including deterministic progression from equivalent initial states and an observable state change caused by advancing Matter.js. Use Playwright against the real Vite-served application to check canvas dimensions, nonblank rendered pixels, visible progression, and browser errors at desktop and mobile sizes. Screenshots or pixel sampling must inspect canvas output, not merely canvas existence or a mocked render call. A DOM-only smoke test cannot establish working WebGL rendering.
5. Configure the browser test web server on a deterministic local address without silently reusing an unrelated server. Document Playwright browser installation separately from dependency installation. Preserve existing ignore rules and add only generated paths introduced by the selected tools.

## Risks / Trade-offs

- Headless WebGL availability varies by environment -> use a supported Playwright Chromium setup, inspect actual rendered output, and report environment failures rather than replacing rendering assertions with mocks.
- Animation timing can make browser checks flaky -> wait for observable rendered state and compare frames within bounded polling; unit tests advance the simulation explicitly.
- A minimal shell is temporary -> use a small shared simulation boundary that the following gameplay feature can extend; avoid freezing the demonstration's appearance or motion into game rules.
- Package engine requirements may exceed the local Node runtime -> resolve compatible maintained package versions and record the selected Node prerequisite before committing the lockfile.

## Migration Plan

Add the foundation on this task branch, run clean dependency installation and the full local command suite, and merge through the sprint workflow. No user data or deployed application requires migration. Reverting the foundation commit removes the application if rollback is needed.
