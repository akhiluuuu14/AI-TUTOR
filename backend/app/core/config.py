from typing import Any, List, Union
from pydantic import AnyHttpUrl, BeforeValidator, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated

def parse_cors(v: Any) -> List[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore"
    )

    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI Career Coach Backend"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: Annotated[
        List[str], BeforeValidator(parse_cors)
    ] = ["http://localhost:5173", "http://localhost:3000"]

    # Database Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "ai_career_coach"

    # JWT Configuration
    SECRET_KEY: str = "SUPER_SECRET_SECURITY_KEY_FOR_JWT_PORTFOLIO_TOKEN_GENERATION_32_BYTES"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Gemini API Configuration
    GEMINI_API_KEY: str = ""

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
