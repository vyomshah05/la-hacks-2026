# AI Brain Agent — Changes

Scope of this document: everything the AI Brain agent added to TrailSafe. Owns
`src/agent/` (on-device client) and `backend/` (cloud LLM proxy). Does not touch
`App.tsx`, `src/shared/`, or any other agent's folder.

## What was added

### `src/agent/` — on-device chat brain

The Voice/SOS agent calls `sendMessage(text, appState, history)` and is
guaranteed a string back, even with no internet, no local model, and no
matching tip.

| File | Purpose |
| --- | --- |
| `tips.json` | 20 hand-written survival scenarios. Each entry: `{trigger, keywords[], response}`. Used for offline keyword fallback. |
| `localModel.ts` | `callLocalModel(prompt)` — POSTs to ZETIC's `http://localhost:8080/generate` with a 10 s timeout. Strips model artefacts (`<\|...\|>`, `</s>`, `[INST]`). Exports `LocalModelError`. |
| `cloudModel.ts` | `callCloudModel(prompt, history)` — POSTs to `${EXPO_PUBLIC_BACKEND_URL}/chat` with an 8 s timeout. Trims history to the last 10 messages. Exports `CloudModelError`. |
| `survivalAgent.ts` | `sendMessage` — public surface. Builds the prompt (location, stationary, battery, user text) and runs the fallback chain. |

### `backend/` — Python FastAPI proxy (uv-managed, model-agnostic)

| File | Purpose |
| --- | --- |
| `pyproject.toml` | uv project file. FastAPI + uvicorn + pydantic + provider SDKs. |
| `requirements.txt` | Mirror of `pyproject.toml` for non-uv installs. Regenerate via `uv pip compile pyproject.toml -o requirements.txt`. |
| `.env.example` | `PROVIDER`, `MODEL`, three optional API keys, host/port. |
| `app/main.py` | FastAPI app with `POST /chat` and `GET /health`. CORS open. 30 s server-side per-call timeout. |
| `app/config.py` | `pydantic-settings` reading `.env`. |
| `app/schemas.py` | `ChatRequest`, `ChatResponse`, `ChatTurn`. |
| `app/providers/base.py` | `LLMProvider` ABC with one method: `async generate(prompt, history) -> str`. |
| `app/providers/__init__.py` | `get_provider()` factory. Reads `PROVIDER` env, returns the matching instance. Cached. |
| `app/providers/{openai,anthropic,gemini}_provider.py` | Three concrete implementations. Each translates `(prompt, history)` into the SDK's native call shape. |
| `README.md` | Quick start, switching providers, adding new providers, prod notes. |

## Why

### Why a 4-tier fallback (cloud → local → tips → hardcoded)?
TrailSafe's whole pitch is "works when you're lost in the woods." Any single
network or model failure must not silently brick the chat. Each tier is
strictly worse but strictly more available than the previous one. The
hardcoded fallback (`"Stay calm, stay put, conserve energy, and signal for help."`)
is universally true survival advice that's never wrong to surface.

### Why an 8 s client-side timeout (vs 15 s)?
Decided with integration agent. On 1-bar LTE, a 30 s round-trip is common; we'd
rather give up fast and fall through to ZETIC than make the user stare at a
spinner. The backend keeps a 30 s server-side timeout so fast providers can
still finish even after the client gives up.

### Why a dynamic `require` for ZETIC's `testLocalModel`?
`src/zetic/modelConfig.ts` is owned by another agent and isn't shipped yet. A
static `import` would break `tsc --noEmit` until they land. Dynamic `require`
in a try/catch lets us ship now and degrades cleanly to "local model
unavailable" if the module is missing, the function isn't exported, or the
health check throws.

### Why a Python backend with `uv`?
The user asked for `uv` and a `requirements.txt`, plus a model-agnostic design
so devs can swap models. uv gives a fast, reproducible install (`uv sync`,
`uv.lock`) while `requirements.txt` keeps non-uv users unblocked. The
`LLMProvider` ABC + factory means **adding a new model = one new file + one
branch in the factory** — no route changes, no schema changes.

### Why severity-ordered tips?
Many user phrases match multiple scenarios (e.g. "cold water rising in the
canyon" hits hypothermia, water, and flash flood). On a tie in keyword score,
the earlier-listed scenario wins, so tips are ordered by severity — broken
bone, snake bite, hypothermia, flash flood first. A wrong-but-action-first
answer for a less urgent scenario is fine; missing a life-threatening one is
not.

### Why is `sendMessage` guaranteed never to throw?
Voice/SOS calls this on every user turn. If a bug in keyword matching or an
unexpected exception crashed the chat, the user would see a frozen UI with no
way to recover. The outer try/catch around the whole routing chain guarantees
we always return a string, even if it's just the hardcoded fallback.

## Resolved decisions (from integration agent)

1. **ZETIC import**: dynamic `require` with graceful fallback.
2. **Cloud contract**: `POST /chat` with `{prompt, history: [{role, content}]}` returning `{reply: string}`.
3. **History cap**: last 10 messages.
4. **Cloud timeout**: 8 s client-side, 30 s server-side.
5. **Tips JSON loading**: `import tips from './tips.json'` (Metro bundles JSON natively).
6. **Package manager**: uv, with committed `requirements.txt`.
7. **Default provider**: `openai` / `gpt-4o-mini`.

## Verification status

- Python files compile cleanly (`python -m py_compile` on all 9 files: exit 0).
- TypeScript files **not yet type-checked** — `node_modules/` is not installed.
  After `npm install` in `TrailSafe/`, run `npx tsc --noEmit`.
- Backend not yet run — uv is not installed on this machine. Install per
  `backend/README.md`, then `uv sync && uv run uvicorn app.main:app`.

## Next steps

### Blocking on other agents
1. **ZETIC agent** must ship `src/zetic/modelConfig.ts` exporting
   `testLocalModel(): Promise<boolean>` and a working server at
   `http://localhost:8080/generate`. Until then, the local tier always falls
   through to tips.
2. **Voice/SOS agent** wires `sendMessage` from `src/agent/survivalAgent` into
   their chat UI. No interface change needed — just import and call.

### What I should do next
1. **Type-check**: install node modules in `TrailSafe/` and run
   `npx tsc --noEmit`. Fix any strict-mode violations from the new files.
2. **Smoke test the fallback chain** with a tiny script:
   - "my leg is broken" + offline → broken-bone tip
   - "zzqqxx" + offline + no ZETIC → hardcoded fallback
   - "hi" + online + no `EXPO_PUBLIC_BACKEND_URL` → falls through to local → tips
3. **Backend end-to-end**: install uv, `uv sync`, set OpenAI key in `.env`,
   start uvicorn, `curl /chat` to confirm `{reply}` shape.
4. **Cross-provider check**: flip `PROVIDER=anthropic`, restart, repeat curl.
   Then `PROVIDER=gemini`. All three should round-trip without code changes.
5. **Commit `uv.lock`** once generated, so all devs get reproducible installs.

### Improvements worth considering later
- **Streaming**: backend currently returns the whole reply at once. For long
  responses on weak signal, partial streaming would feel snappier. Would
  require changes on both ends.
- **Auth**: `/chat` is unauthenticated. Add a bearer token before exposing
  publicly.
- **Tips i18n**: `tips.json` is English-only. If TrailSafe ever ships in other
  languages, swap to a per-locale file or a translation step.
- **Better fuzzy match**: current scoring is exact-keyword + substring. A
  small stemmer or edit-distance pass would catch "fractured" → "fracture",
  "burnt" → "burn", etc. Skipped to stay zero-dependency.
- **Per-call provider override**: if a future caller wants to force a specific
  provider per request, add an optional `provider` field to `ChatRequest` and
  resolve it in the route handler instead of via env.
