from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    """
    Standard OAuth2 JWT access token token envelope structure.
    """
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    """
    Structure of internal payload sub claims after decoding signed keys safely.
    """
    sub: Optional[str] = None
