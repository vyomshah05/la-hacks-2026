import asyncio
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.providers import get_provider
from app.schemas import ChatRequest, ChatResponse


logger = logging.getLogger("trailsafe")
logging.basicConfig(level=logging.INFO)

SERVER_TIMEOUT_S = 30.0

app = FastAPI(title="TrailSafe Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    try:
        provider = get_provider()
    except Exception as e:
        logger.exception("provider init failed")
        raise HTTPException(status_code=500, detail=f"provider init failed: {e}")

    try:
        reply = await asyncio.wait_for(
            provider.generate(req.prompt, req.history),
            timeout=SERVER_TIMEOUT_S,
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="provider timed out")
    except Exception as e:
        logger.exception("provider call failed")
        raise HTTPException(status_code=502, detail=f"provider error: {e}")

    if not reply:
        raise HTTPException(status_code=502, detail="provider returned empty reply")

    return ChatResponse(reply=reply)
