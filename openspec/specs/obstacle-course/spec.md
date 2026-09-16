# obstacle-course Specification

## Purpose

Provide a complete, reproducible flight game in which keyboard and touch players clear visible obstacles, score points, and restart after a crash.

## Requirements

### Requirement: Ready scene and responsive original world
The game SHALL open to a nonblank ready scene with an original yellow bird, green pipe course, layered cyan world, and deliberate lighting. It SHALL fill the viewport with undistorted, readable gameplay and stable score/control placement across desktop, portrait phone, and landscape sizes without overflow, overlapping controls, boxed previews, tutorials, or shortcut copy.

#### Scenario: Ready scene and viewport changes
- **WHEN** the game opens before input and the viewport changes between desktop, portrait, and landscape
- **THEN** the bird, next gate opening, score, and start control remain visible and distinguishable
- **AND** the scene fills the viewport without page scrolling or stretched geometry

### Requirement: Keyboard and pointer flight input
The game SHALL start a run with an upward flap on Space, ArrowUp, a primary pointer/touch activation on the playfield, or the start control. During a run each discrete accepted activation SHALL apply a predictable upward flap while gravity continuously affects flight; held key repeats and a single touch gesture SHALL NOT produce duplicate flaps.

#### Scenario: Start and flap using both input families
- **WHEN** a ready player starts and then flaps using keyboard or touch/pointer input
- **THEN** the run advances, the bird responds visibly upward, and later falls without further input
- **AND** control interaction does not scroll the page or trigger an unintended extra playfield action

### Requirement: Reproducible headless game progression
The game SHALL expose independently testable progression whose equivalent initial seed and fixed-step input sequence produce equivalent bird motion, gate positions, run state, and score. Returned observations SHALL NOT permit mutation of the running model.

#### Scenario: Repeat a recorded run
- **WHEN** two fresh simulations receive the same seed, fixed steps, and flap sequence without a graphics context
- **THEN** their observable gameplay states match throughout the run
- **AND** modifying a returned observation cannot change subsequent simulation state

### Requirement: Score each cleared gate once
The game SHALL begin each run at zero and award exactly one point when the bird fully passes a gate while alive. Unpassed gates and collisions SHALL NOT award points, and each gate SHALL contribute at most once.

#### Scenario: Clear successive gates
- **WHEN** input-guided flight passes completely through two successive gates without collision
- **THEN** the visible score advances from zero to one and then two
- **AND** subsequent updates do not award those gates additional points

### Requirement: Collision and fresh restart
Contact with a pipe, floor, or ceiling SHALL end the run. A crashed run SHALL stop gameplay progression, retain its final score, and expose a restart control. Restart SHALL reset score, bird, obstacles, and run state to a fresh running attempt with an initial flap and no stale collision or input effects.

#### Scenario: Crash and restart
- **WHEN** the bird contacts a course hazard and the player subsequently activates restart
- **THEN** the crashed state first preserves its score without further gate movement or scoring
- **AND** restart begins a fresh attempt at score zero with the initial obstacle layout and functioning flight input

### Requirement: Verification exercises real gameplay and rendered output
Automated verification SHALL cover the model and actual keyboard/touch browser gameplay on desktop and mobile, including score, crash, restart, visible pixels, movement, and responsive framing. Browser observation SHALL be read-only and SHALL NOT bypass physics, input, collisions, or scoring.

#### Scenario: Complete verification
- **WHEN** unit, browser, typecheck, and production build commands run
- **THEN** they pass with browser tests driving gameplay through real input and inspecting nonblank canvas pixels and movement
- **AND** desktop/mobile and resized scenes have no browser errors, page overflow, or incoherent UI overlap
