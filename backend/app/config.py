import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings."""
    GITHUB_API_TOKEN: str = os.getenv("GITHUB_API_TOKEN", "")
    GITHUB_API_URL: str = os.getenv("GITHUB_API_URL", "https://api.github.com")
    
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    CACHE_EXPIRY: int = int(os.getenv("CACHE_EXPIRY", "3600"))
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    WORKERS: int = int(os.getenv("WORKERS", "4"))
    
    class Config:
        env_file = ".env"

settings = Settings()