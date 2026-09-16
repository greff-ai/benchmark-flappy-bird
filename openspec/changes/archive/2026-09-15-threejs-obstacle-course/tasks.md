## 1. Deterministic Gameplay

- [x] 1.1 Replace the pendulum model with fixed-step Matter.js bird physics, seeded gates, and ready/running/crashed commands; verify gravity, flap response, deterministic replay, and snapshot isolation with Vitest.
- [x] 1.2 Implement one-time gate scoring, pipe/floor/ceiling crashes, and fresh restart; verify two cleared gates, no duplicate or collision points, frozen crashed progression, and repeatable restart state in unit tests.

## 2. Playable Scene

- [x] 2.1 Replace the pendulum renderer with the original yellow bird, green pipes, layered cyan scenery, lighting, and responsive orthographic framing; verify nonblank ready/running canvas pixels and bird/gate visibility at desktop, portrait, and landscape sizes.
- [x] 2.2 Wire real keyboard/pointer/touch input, start/restart controls, score UI, fixed-step updates, and read-only browser observations; verify single-gesture flaps, ignored held-key repeats, accessible controls, and a complete manual start/crash/restart loop without scrolling or UI overlap.

## 3. Integrated Verification

- [x] 3.1 Replace pendulum Playwright assertions with desktop keyboard and mobile touch runs that earn points, crash, and restart using real input; verify visible bird motion and rendered bird/pipe pixels, resize framing, no overflow or browser errors, and retained screenshots.
- [x] 3.2 Run `npm test`, `npm run test:e2e`, `npm run typecheck`, and `npm run build`; review desktop/mobile screenshots and validate OpenSpec artifacts against delivered behavior before the issue #10 change is archived and merged only into `feat/7-first-flight-game`.
