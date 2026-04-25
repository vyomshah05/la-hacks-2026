# TrailSafe Backend

Model-agnostic LLM proxy for the TrailSafe app. Single endpoint, swappable
providers, managed with [uv](https://docs.astral.sh/uv/).

## Quick start

```bash
cd backend

# 1. Install uv (one time, if not already installed)
#   Windows PowerShell:  irm https://astral.sh/uv/install.ps1 | iex
#   macOS / Linux:       curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Install deps
uv sync

# 3. Configure
cp .env.example .env       # then edit .env, set PROVIDER + API key

# 4. Run
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Smoke test:

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"hello","history":[]}'
# -> {"reply":"..."}
```

For the Expo app, set `EXPO_PUBLIC_BACKEND_URL=http://<your-lan-ip>:8000`
so phones on the same wifi can reach this service.

## Switching providers

Edit `.env`:

```
PROVIDER=anthropic
MODEL=claude-haiku-4-5
ANTHROPIC_API_KEY=sk-ant-...
```

Restart. No code changes.

## Adding a new provider

1. Create `app/providers/<name>_provider.py` subclassing `LLMProvider` from
   `app/providers/base.py`. Implement `async def generate(prompt, history)`.
2. Register it in `app/providers/__init__.py` (one new branch in
   `get_provider()`).
3. Add the SDK to `pyproject.toml`, then:
   ```bash
   uv lock
   uv pip compile pyproject.toml -o requirements.txt
   ```

That's it — `/chat` automatically routes to the new provider when
`PROVIDER=<name>`.

## requirements.txt

`requirements.txt` is included for devs who don't use uv:

```bash
pip install -r requirements.txt
```

Regenerate it after dependency changes:

```bash
uv pip compile pyproject.toml -o requirements.txt
```

## Layout

```
backend/
├── pyproject.toml
├── requirements.txt
├── .env.example
└── app/
    ├── main.py              # FastAPI + /chat
    ├── config.py            # Settings (env-driven)
    ├── schemas.py           # ChatRequest / ChatResponse
    └── providers/
        ├── __init__.py      # get_provider() factory
        ├── base.py          # LLMProvider ABC
        ├── openai_provider.py
        ├── anthropic_provider.py
        └── gemini_provider.py
```

## Production notes

- CORS is wide open for dev. Restrict `allow_origins` in `app/main.py` before
  exposing this publicly.
- The TS client expects a `{reply: string}` response and times out at 8 s.
  Server-side timeout is 30 s.
- No auth on `/chat`. Add a bearer token check before deploying.
