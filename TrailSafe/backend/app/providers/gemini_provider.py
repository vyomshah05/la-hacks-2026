from google import genai
from google.genai import types

from app.providers.base import LLMProvider
from app.schemas import ChatTurn


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set")
        self._client = genai.Client(api_key=api_key)
        self._model = model

    async def generate(self, prompt: str, history: list[ChatTurn]) -> str:
        contents: list[types.Content] = []
        for h in history:
            role = "user" if h.role == "user" else "model"
            contents.append(
                types.Content(role=role, parts=[types.Part.from_text(text=h.content)])
            )
        contents.append(
            types.Content(role="user", parts=[types.Part.from_text(text=prompt)])
        )

        resp = await self._client.aio.models.generate_content(
            model=self._model,
            contents=contents,
            config=types.GenerateContentConfig(max_output_tokens=400),
        )
        return (resp.text or "").strip()
