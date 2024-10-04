# routers/user_router
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.database import get_db
from database.db_models import User
from database.schemas import UserCreate, UserLogin
from services.auth_services import create_access_token
from passlib.context import CryptContext
import logging
logging.getLogger('passlib').setLevel(logging.ERROR)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


@router.post("/signup/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.execute(select(User).where(
        User.username == user.username)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists.")

    hashed_password = get_password_hash(user.password)

    new_user = User(
        username=user.username,
        password=hashed_password,
        cs_background=user.cs_background,
        study_level=user.study_level,
        experience=user.experience
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.username})
    return {"id": new_user.id, "username": new_user.username, "access_token": access_token, "token_type": "bearer"}


@router.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.execute(select(User).where(
        User.username == user.username)).scalar_one_or_none()

    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    access_token = create_access_token(data={"sub": existing_user.username})
    return {"access_token": access_token, "token_type": "bearer", "username": existing_user.username}
