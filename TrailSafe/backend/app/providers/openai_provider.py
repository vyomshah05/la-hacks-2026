from openai import AsyncOpenAI

from app.providers.base import LLMProvider
from app.schemas import ChatTurn


class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise ValueError("OPENAI_API_KEY is not set")
        self._client = AsyncOpenAI(api_key=api_key)
        self._model = model

    async def generate(self, prompt: str, history: list[ChatTurn]) -> str:
        messages: list[dict[str, str]] = [
            {"role": h.role, "content": h.content} for h in history
        ]
        messages.append({"role": "user", "content": prompt})

        resp = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            max_tokens=400,
        )
        choice = resp.choices[0]
        return (choice.message.content or "").strip()
