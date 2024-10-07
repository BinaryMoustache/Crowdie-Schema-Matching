from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from database.db_models import User
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from database.database import get_db
from typing import Optional, Dict
import jwt

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: Dict[str, str], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with an optional expiration time.

    Args:
        data (dict): The data to encode into the JWT token.
        expires_delta (Optional[timedelta], optional): The expiration time for the token. 
            Defaults to None, in which case a default expiration is used.

    Returns:
        str: The encoded JWT token.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Retrieve the current user based on the JWT token provided.

    Args:
        token (str): The JWT token extracted from the request.
        db (Session): The database session.

    Raises:
        HTTPException: If the credentials are invalid or the user is not found.

    Returns:
        User: The user associated with the provided JWT token.
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        
        if username is None:
            raise credentials_exception
        
        # Fetch user from database
        result = await db.execute(select(User).where(User.username == username))  # Use await
        user = result.scalar_one_or_none()  
        
        if user is None:
            raise credentials_exception
    
    except jwt.PyJWTError:
        raise credentials_exception
    
    return user