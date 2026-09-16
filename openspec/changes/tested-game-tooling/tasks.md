## 1. Application Toolchain

- [ ] 1.1 Add compatible Vite, TypeScript, Three.js, Matter.js, lucide, Vitest, and Playwright dependencies with required types, package scripts, and a committed npm lockfile; verify `npm ci` succeeds on the documented Node runtime.
- [ ] 1.2 Create the minimal browser entry and TypeScript/Vite configuration; verify `npm run typecheck` and `npm run build` execute successfully.

## 2. Testable Rendered Foundation

- [ ] 2.1 Implement a small independently stepped Matter.js simulation used by the application and add meaningful Vitest tests for physics-driven state changes and equivalent progression from equivalent initial states; verify `npm test` passes without a browser or graphics context.
- [ ] 2.2 Connect simulation state to a clearly visible Three.js scene through separate renderer and browser lifecycle modules; verify the full-viewport scene is nonblank and visibly updates when opened with `npm run dev`.
- [ ] 2.3 Add responsive canvas sizing and camera updates; verify the scene stays framed without distortion or overflow at desktop and mobile sizes and after a viewport resize.

## 3. Browser Verification and Handoff

- [ ] 3.1 Configure Playwright to start the actual application and add desktop/mobile smoke coverage for canvas dimensions, nonblank pixels, visible progression, resize behavior, and browser errors; verify `npm run test:e2e` passes with the documented browser installed.
- [ ] 3.2 Document runtime prerequisites, dependency/browser setup, and executable local commands in README, and adjust ignore patterns for any new generated output; verify documented scripts exist and installation/build/test output stays ignored.
- [ ] 3.3 Run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` together against the finished foundation; inspect desktop/mobile screenshots for visible, correctly framed scene content and confirm all commands succeed.
