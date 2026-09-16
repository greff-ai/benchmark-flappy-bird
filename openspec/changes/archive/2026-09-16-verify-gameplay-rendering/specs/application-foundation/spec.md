## ADDED Requirements

### Requirement: Reproducible gameplay verification evidence
The repository SHALL provide reproducible browser verification and a concise evidence report identifying tested viewports, input modes, commands, outcomes, and stable screenshot links. Verification SHALL include actual rendered framing at 320x568 portrait and 568x320 landscape, and visible gameplay motion under the browser's normal clock on desktop and mobile. It SHALL use actual player input and rendered pixels without injecting model state or bypassing physics, collisions, or scoring.

#### Scenario: Compact viewport evidence
- **WHEN** browser verification runs at 320x568 portrait and 568x320 landscape
- **THEN** actual canvas pixels show a nonblank, correctly framed bird and visible course
- **AND** controls and scores remain within the viewport without incoherent overlap or page overflow
- **AND** screenshots and viewport-specific results are identifiable in the evidence report

#### Scenario: Normal-clock gameplay evidence
- **WHEN** desktop keyboard and mobile touch input start and flap a run while the browser's normal animation clock runs
- **THEN** the rendered bird visibly moves across captured frames with no browser errors
- **AND** observation does not replace rendering, write gameplay state, or advance a mocked clock

#### Scenario: Reviewable verification record
- **WHEN** the completed verification is reviewed from the repository
- **THEN** the report identifies the tested revision, viewports, input modes, command results, and retained screenshots
- **AND** the existing real-input gameplay coverage and unit, typecheck, build, browser, and strict specification checks remain passing
