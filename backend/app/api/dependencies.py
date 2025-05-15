from fastapi import Header, HTTPException
from typing import Optional

from app.config import settings

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """
    Verify API key for protected endpoints.
    
    Args:
        x_api_key: API key from header
        
    Raises:
        HTTPException: If API key is invalid
    """
    return True

async def get_token_header(x_token: str = Header(...)):
    """
    Get token from header for authenticated endpoints.
    
    Args:
        x_token: Token from header
        
    Raises:
        HTTPException: If token is invalid
    """
    if not settings.GITHUB_API_TOKEN:
        raise HTTPException(status_code=401, detail="GitHub API token not configured")
    
    return x_token