from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


Provider = Literal["openai", "anthropic", "gemini"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    provider: Provider = "openai"
    model: str = "gpt-4o-mini"

    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""

    host: str = "0.0.0.0"
    port: int = 8000


settings = Settings()
