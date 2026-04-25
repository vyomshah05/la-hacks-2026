from anthropic import AsyncAnthropic

from app.providers.base import LLMProvider
from app.schemas import ChatTurn


class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY is not set")
        self._client = AsyncAnthropic(api_key=api_key)
        self._model = model

    async def generate(self, prompt: str, history: list[ChatTurn]) -> str:
        messages: list[dict[str, str]] = [
            {"role": h.role, "content": h.content} for h in history
        ]
        messages.append({"role": "user", "content": prompt})

        resp = await self._client.messages.create(
            model=self._model,
            max_tokens=400,
            messages=messages,
        )

        parts: list[str] = []
        for block in resp.content:
            text = getattr(block, "text", None)
            if text:
                parts.append(text)
        return "".join(parts).strip()
