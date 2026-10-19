# Verification record

Date: 2026-10-19 (Asia/Seoul)

## Passed

- `npm test`: **6/6** tests. Early-abstention illustrative call count, both pass
  outcomes, explicit-only baseline comparison, edited/reordered-input rejection,
  input validation, and all 40 manuscript result rows.
- `npm run build`: TypeScript and Vite production build passed. Final assets:
  JavaScript 256.09 kB (80.00 kB gzip); CSS 28.58 kB (7.00 kB gzip).
  Known-secret-pattern and accidental-publication checks passed.
- `npm run test:browser`: **6/6** Playwright tests on desktop, iPhone-13-sized
  Chromium, and 320×700 Chromium. Tested all example paths, separate comparison,
  editing/reset/add/remove, cleared stale results, disabled custom simulation,
  result controls, exact table, citation feedback, mobile navigation and no
  inference requests. No JavaScript page errors observed in flow tests.
- Production `dist/` served under `/sns-project-page/`, with screenshots inspected.
  Viewports 1440×1100, 390×844 and 320×700: no horizontal document overflow;
  JS/CSS, favicon, result CSV and source audit returned HTTP 200.
- Local research checkout was not edited. No remote inference was submitted.

## Environment and limits

The host's default Node was v10.19.0. Validation used the official Node v22.23.3
Linux archive, SHA256-checked against the official distribution manifest and
extracted under `/tmp`. The project requires Node >=22.12; CI selects Node 22.
Tests used the installed `/opt/google/chrome/chrome` executable. CI installs its
matching Playwright Chromium. Mobile coverage is viewport/touch emulation, not
physical iOS Safari. Keyboard focus and reduced-motion CSS are present; no full
assistive-technology audit was performed.

Local test servers required permission to bind loopback ports and were stopped
after testing. No persistent preview server remains. No GitHub repository was
created or pushed, no Pages deployment was triggered, and no hosted URL has been
verified. The supplied arXiv link was opened and its title/authors matched.

No checkpoint download, GPU inference, original-wrapper parity test, API test,
model scoring, calibration, GPU-memory benchmark, service latency measurement,
Runpod submission, or worker compatibility check was performed. These remain
subsequent backend work, as documented in the source audit.
