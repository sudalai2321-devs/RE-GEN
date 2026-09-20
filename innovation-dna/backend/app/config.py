from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Innovation DNA"
    DATABASE_URL: str = "sqlite:///./innovation_dna.db"
    SECRET_KEY: str = "innovation-dna-dev-secret-key-change-in-prod-32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: str | None = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4o"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    MOCK_AI_MODE: bool = True
    STORAGE_TYPE: str = "local"
    STORAGE_PATH: str = "./uploads"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = {"env_file": [".env", "../.env"], "extra": "ignore"}

settings = Settings()
