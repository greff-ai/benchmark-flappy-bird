# flight-controls Specification

## Purpose

Let players pause a flight, control gameplay sound, and retain a best score through accessible controls that remain usable when optional browser services fail.

## Requirements

### Requirement: Pause preserves the flight
The game SHALL allow an active run to pause and explicitly resume. While paused, bird position and velocity, gates, tick, and score SHALL remain unchanged, and flight input SHALL be ignored. Resume SHALL continue the same run without a flap or accumulated inactive-time jump. Losing window focus or hiding the page during active flight SHALL pause the run; returning SHALL require explicit resume.

#### Scenario: Pause and resume with keyboard or touch
- **WHEN** a player pauses an active run, waits, attempts to flap, and explicitly resumes
- **THEN** paused observations preserve all gameplay state except the phase
- **AND** resumed flight continues from the preserved state without delayed input or a time jump

#### Scenario: Leave and return to the game
- **WHEN** an active game loses focus or becomes hidden and later returns
- **THEN** the run remains paused until the player resumes
- **AND** time spent away does not advance physics or score on resume

### Requirement: Controlled gameplay sound
When supported and enabled, the game SHALL provide short, distinct flap, score, and crash sounds only after a player gesture permits audio. A mute control SHALL silence current and subsequent feedback until sound is enabled again. Unavailable audio or failed initialization/resume SHALL leave gameplay usable without uncaught errors or delayed bursts of queued sounds.

#### Scenario: Enable and mute feedback
- **WHEN** a player starts flight, toggles mute, and later enables sound using keyboard or touch controls
- **THEN** feedback follows gameplay events only while sound is enabled and available
- **AND** audio does not start before a player gesture or replay events accumulated while muted

#### Scenario: Audio cannot initialize
- **WHEN** the audio API is absent, construction throws, or resuming audio rejects
- **THEN** the game remains playable with silent feedback and no uncaught errors
- **AND** the control state communicates that sound is unavailable when initialization has failed

### Requirement: Resilient persistent best score
The game SHALL display best score distinctly from current score, update it when earned score exceeds the record, preserve it across restarts, and restore it across reloads when storage works. Only nonnegative safe-integer records SHALL be accepted; missing, malformed, fractional, negative, or unsafe values SHALL default to zero. Storage access, reads, or writes failing SHALL preserve normal gameplay and an in-memory best score for the current page session.

#### Scenario: Earn and retain a record
- **WHEN** actual flight earns a new best score and the player restarts or reloads
- **THEN** restart resets current score while retaining the displayed best
- **AND** reload restores the saved best when storage is available

#### Scenario: Invalid or inaccessible storage
- **WHEN** saved data is invalid or obtaining, reading, or writing storage throws
- **THEN** the game starts and remains playable without uncaught errors
- **AND** valid records already known in memory are not reduced by a storage failure

### Requirement: Accessible responsive controls
Start, restart, pause/resume, and mute controls SHALL use recognizable icons, accessible names and state, hover tooltips, visible keyboard focus, and stable touch targets of at least 44 by 44 CSS pixels. Desktop, portrait, and landscape layouts SHALL keep controls and both scores legible without obscuring the playable corridor or overlapping each other. Pause/resume and mute activation SHALL NOT trigger a flap, and no control SHALL strand keyboard focus on a hidden element.

#### Scenario: Navigate controls across layouts and phases
- **WHEN** a player operates controls with Tab and activation keys or touch across ready, running, paused, and crashed states
- **THEN** labels, states, and focus reflect the available action
- **AND** each gesture triggers only its intended command while bird, gate opening, controls, and scores remain readable

### Requirement: Verify controls through real gameplay
Verification SHALL cover pause preservation, audio and storage failure handling, and actual keyboard/touch use of pause/resume, mute, earned records, reload, and restart on desktop and mobile. Existing deterministic simulation, rendered-pixel, movement, and resize checks SHALL remain effective, with no game-state mutation or scoring bypass.

#### Scenario: Complete controls verification
- **WHEN** unit, browser, typecheck, and production build checks run
- **THEN** all pass with real input earning records and exercising the controls
- **AND** failure cases for optional browser services do not break gameplay or create uncaught errors
