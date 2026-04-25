from functools import lru_cache

from app.config import settings
from app.providers.base import LLMProvider


@lru_cache(maxsize=1)
def get_provider() -> LLMProvider:
    name = settings.provider.lower()

    if name == "openai":
        from app.providers.openai_provider import OpenAIProvider
        return OpenAIProvider(api_key=settings.openai_api_key, model=settings.model)

    if name == "anthropic":
        from app.providers.anthropic_provider import AnthropicProvider
        return AnthropicProvider(api_key=settings.anthropic_api_key, model=settings.model)

    if name == "gemini":
        from app.providers.gemini_provider import GeminiProvider
        return GeminiProvider(api_key=settings.google_api_key, model=settings.model)

    raise ValueError(f"unknown provider: {settings.provider}")


__all__ = ["LLMProvider", "get_provider"]
