## 1. Browser Evidence

- [ ] 1.1 Add compact 320x568 portrait and 568x320 landscape checks using existing pixel/framing helpers; verify actual bird/course pixels, bounded controls/scores, no overlap/overflow, and passing focused browser cases.
- [ ] 1.2 Add a separate real-clock smoke spec for desktop keyboard and mobile touch start/flap; verify rendered bird displacement and normal-clock progression without mocked time, injected state, or browser errors.

## 2. Installed Skill Maintenance

- [ ] 2.1 Refresh exactly the nine dad skill directories listed in design.md from the validated local source; verify identical relative file sets and bytes and unchanged OpenSpec/unrelated installed files.
- [ ] 2.2 Run `node .agents/skills/dad/scripts/dad.mjs init --json` against the refreshed installed payload without a source override; verify all 11 checks pass and existing project settings remain intact.

## 3. Integrated Verification and Record

- [ ] 3.1 Run `npm test`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, and `openspec validate --all --strict`; verify the existing 26 unit/10 browser cases remain represented and passing alongside the added coverage. Repair only demonstrated narrow regressions, with focused checks, and rerun affected verification; retain normal full-suite merge checks.
- [ ] 3.2 Visually inspect final desktop, mobile, compact portrait/landscape, and real-clock screenshots; deliver a concise report plus a small stable screenshot set in the issue's `evidence/` directory, recording revision, viewports/input modes, commands/totals/results, rendering observations, skill byte verification, and init results. Retain full runtime outputs at `/private/tmp/first-flight-issue-8-evidence/` and verify committed report links resolve without committing bulk generated reports.
