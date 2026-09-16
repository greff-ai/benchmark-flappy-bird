# benchmark-flappy-bird

First Flight is an original full-screen Three.js flight game with deterministic
Matter.js physics. Fly with Space, ArrowUp, or a tap on the playfield. Clear each
green gate for one point; use the restart control after a crash. Pause/resume
and sound controls are in the upper-right toolbar. Leaving the page pauses
flight until explicitly resumed. BEST persists across visits when browser
storage is available; blocked storage keeps a record for the current session.

## Prerequisites

- Node.js 22.12+ on the 22.x line, 24.x, or 26+ (verified with 22.17.1).
- npm (verified with 11.4.2).
- Playwright Chromium and its operating-system dependencies.

## Setup

```sh
npm ci
npx playwright install chromium
```

On a Linux machine without browser system dependencies, use
`npx playwright install --with-deps chromium` instead.

## Local Commands

```sh
npm run dev        # Local URL is printed by Vite (normally http://127.0.0.1:5173)
npm test           # Headless simulation unit tests
npm run typecheck  # TypeScript checks for application, tests, and configuration
npm run build      # Checked production build in dist/
npm run preview    # Serve the production build locally
npm run test:e2e   # Chromium desktop/mobile rendered-scene checks
```

Browser tests start their own Vite server at `http://127.0.0.1:4173` and fail if
that port is occupied. They inspect actual canvas pixels for visible content,
motion, framing, and resizing, and check for browser errors. Screenshots are
written to `test-results/`; the HTML report is in `playwright-report/`.

`src/simulation.ts` owns physics, `src/renderer.ts` maps physics state into the
Three.js scene, and `src/main.ts` owns browser sizing and animation scheduling.
The game uses a seeded course and read-only `window.flight.state` snapshots for
browser observation. Tests earn points using real keyboard and touch input;
they cannot change physics or score through this interface. Lucide supplies
the game control icons. Audio starts only after a player gesture and remains
optional if the browser cannot initialize it. Mute applies to the current
page session. The record key is `first-flight.best-score`. Dependencies,
production assets, and generated test reports are ignored by Git.
