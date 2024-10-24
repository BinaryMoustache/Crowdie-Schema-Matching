from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies import get_db
from schemas.user_schema import UserCreate, UserLogin
from services.auth_services import create_access_token, verify_password
from crud.user_crud import get_user, create_new_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/signup/")
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        existing_user = await get_user(db, username=user.username)

        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists.")

        new_user = await create_new_user(db, user)
        access_token = create_access_token(data={"sub": new_user.username})

        return {
            "id": new_user.id,
            "username": new_user.username,
            "access_token": access_token,
            "token_type": "bearer",
        }
    except HTTPException as http_exc:
        await db.rollback()
        raise http_exc

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"An internal error occurred.")


@router.post("/login/")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        existing_user = await get_user(db, username=user.username)

        if not existing_user or not verify_password(
            user.password, existing_user.password
        ):
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        access_token = create_access_token(data={"sub": existing_user.username})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": existing_user.username,
        }

    except HTTPException as http_exc:
        raise http_exc

    except Exception:
        raise HTTPException(status_code=500, detail=f"An internal error occurred.")
