## Purpose

Provide a reproducible, tested browser application foundation so subsequent game features can depend on working rendering, simulation, and developer commands.

## ADDED Requirements

### Requirement: Reproducible local application commands
The repository SHALL provide a committed dependency lockfile and executable commands for installing dependencies, starting development, running unit tests, checking types, building production assets, and running browser tests.

#### Scenario: Clean dependency installation and verification
- **WHEN** a developer uses the documented supported runtime and browser prerequisites in a clean checkout
- **THEN** `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` complete successfully
- **AND** the test commands execute real test suites and report failure when their assertions fail

#### Scenario: Local application startup
- **WHEN** a developer runs `npm run dev` after installation
- **THEN** the application is available at the local address reported by the development server

### Requirement: Responsive rendered application shell
The application SHALL display a nonblank, full-viewport 3D scene with a clearly visible object whose rendered state updates from the running simulation, without browser console errors or uncaught page errors during normal startup and resizing.

#### Scenario: Desktop and mobile rendering
- **WHEN** the application opens at representative desktop and mobile viewport sizes
- **THEN** the scene fills the viewport without page overflow
- **AND** scene content is visibly distinguishable from the background and remains framed within the canvas
- **AND** advancing the simulation produces an observable rendered change
- **AND** no browser console errors or uncaught page errors occur

#### Scenario: Viewport resize
- **WHEN** the viewport dimensions change while the application is running
- **THEN** the canvas and camera framing adapt to the new dimensions
- **AND** visible scene content remains correctly framed and undistorted

### Requirement: Independently verifiable simulation behavior
The simulation used by the running application SHALL support controlled advancement without browser rendering and SHALL produce equivalent state for equivalent initial conditions and update sequences.

#### Scenario: Headless progression
- **WHEN** a unit test creates the application's simulation and advances it by a known sequence of steps without a DOM or graphics context
- **THEN** the simulation exposes a meaningful physics-driven state change
- **AND** a second simulation with equivalent initial conditions and the same steps produces equivalent state

### Requirement: Browser verification checks actual rendering
The browser smoke suite SHALL open the actual application, inspect rendered canvas output, and fail for blank rendering or browser errors at desktop and mobile viewport sizes.

#### Scenario: Working browser smoke suite
- **WHEN** `npm run test:e2e` runs with its documented browser installed
- **THEN** it launches the application and checks actual nonblank canvas output, visible progression, responsive dimensions, and absence of browser errors
- **AND** it does not substitute mocked rendering for those checks

### Requirement: Documented setup and clean generated output
The README SHALL document runtime prerequisites, dependency and browser installation, and local development and verification commands. Dependencies, production output, and generated test reports SHALL remain ignored by version control.

#### Scenario: Setup and verification leave only source under version control
- **WHEN** a developer follows the README to install, build, and test the application
- **THEN** the documented commands match executable package scripts
- **AND** dependency directories, production assets, and generated test artifacts do not appear as untracked source files
