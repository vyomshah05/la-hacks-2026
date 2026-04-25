from abc import ABC, abstractmethod

from app.schemas import ChatTurn


class LLMProvider(ABC):
    """Provider-agnostic LLM interface.

    Implementations translate (prompt, history) into the provider's
    native call shape and return a single string reply. Errors should
    be raised so the FastAPI layer can convert them to HTTP 502.
    """

    @abstractmethod
    async def generate(self, prompt: str, history: list[ChatTurn]) -> str: ...
