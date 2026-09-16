## MODIFIED Requirements

### Requirement: Keyboard and pointer flight input
The game SHALL start a run with an upward flap on Space, ArrowUp, a primary pointer/touch activation on the playfield, or the start control. During active, unpaused flight each discrete accepted activation SHALL apply a predictable upward flap while gravity continuously affects flight; held key repeats and a single touch gesture SHALL NOT produce duplicate flaps. While paused, flight activations SHALL be ignored and SHALL NOT resume the run or queue a flap.

#### Scenario: Start and flap using both input families
- **WHEN** a ready player starts and then flaps using keyboard or touch/pointer input
- **THEN** the run advances, the bird responds visibly upward, and later falls without further input
- **AND** control interaction does not scroll the page or trigger an unintended extra playfield action

#### Scenario: Flight input during pause
- **WHEN** a paused player presses a flight key or taps the playfield
- **THEN** the run stays paused without changing motion or score
- **AND** explicitly resuming does not apply a flap from that ignored input
