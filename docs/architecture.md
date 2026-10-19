# Architecture and next integration boundary

## Current release

```text
GitHub Actions: npm ci → unit tests → TypeScript/Vite build → browser tests
                                                       → Pages artifact

GitHub Pages → browser React application
               ├─ manuscript result data (static)
               ├─ exact example fixture lookup (local only)
               └─ no inference requests, credentials, storage or analytics
```

The page uses anchor navigation and relative asset URLs. No server, database,
router rewrite, service worker or cloud account is needed to view the result.
Only `dist/` is uploaded to Pages; the research checkout is never bundled.

`src/data.ts` owns manuscript data and examples. `src/figures.ts` supplies
poster figure metadata; `src/ResearchFigure.tsx` provides native-dialog zoom with
keyboard focus restoration. Eight original embedded PNGs and the original poster
PDF are public assets; the complete source deck remains local.

The reading order is summary → key results → demo → background → method → detailed
benchmarks → analysis → conclusion → citation.

`src/data.ts` owns public content. `src/simulation.ts` owns validation and exact
fixture matching. `src/App.tsx` clears results whenever the input changes. There
are no delays masquerading as inference time, token estimators, or synthesized
confidence values. Google Fonts loads presentation assets only.

## Subsequent live integration (not implemented)

```text
Browser → HTTPS FastAPI + SQLite queue → local Sieve on 3090
                                      ├─ distracted → complete / abstain
                                      └─ pass → Runpod /run → persist remote ID
                                                → /status → answer / abstain
```

Implement the user's `GET /health`, `GET /ready`, `GET /examples`, `POST /jobs`,
`GET /jobs/{id}` contract on the backend first. Then replace local fixtures with a
separate API client and explicit live/mock mode. Do not turn an API error into a
simulated success. Preserve IDs and resume polling without automatic paid resubmission.

The future result contract needs: execution mode; actual job status; Sieve label
and score semantics; actual Sage submissions by path; final outcome; exact model,
adapter and tokenizer revisions; prompt/generation settings; per-model token counts
and retained input after truncation; and separately measured Sieve, worker, remote
round-trip and end-to-end durations. Unobserved durations/states must remain null
or unknown. Job completion alone does not reveal cold-start time.

Input limit in this frontend: question 2,000 characters; 1–5 documents with unique
nonempty IDs; 12,000 characters per document. These are UI guardrails, **not token
limits**. The backend must validate independently and preserve shown order.

Live comparison requires explicit user action, fixed checkpoint/common generation
settings, verified method-specific prompts, and separate per-path counts. The
static call-path comparison is only a teaching device and provides no baseline
quality claim. Secrets, stop switch, quota enforcement and paid-call deduplication
belong on the backend, never in Vite environment variables.

## Verification boundaries

- Unit tests: all retrieval paths, explicit comparison, custom-input rejection,
  validation, and every displayed result against an independent manuscript CSV.
- Browser tests: desktop/mobile interactions, input/result invalidation, editing,
  responsive overflow, dataset/metric selection, citation feedback and absence of
  inference traffic. These do not validate GPU/model behavior.
- Build artifact check: known credential patterns, accidental research dumps,
  source maps and root-relative asset paths. This is a guardrail, not proof that
  arbitrary secrets can never be embedded; review any new public variables.
- Research latency values are manuscript data. No service timings or GPU peak
  memory are reported. No claim of deployed inference or original-code parity.

See [source audit](../public/implementation-audit.md) for exact configuration
evidence and unresolved items. After checkpoint verification, perform the user's
512/2048/4096-token batch-size-one benchmarks and real gating tests separately.
