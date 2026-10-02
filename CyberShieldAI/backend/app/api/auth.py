from fastapi import APIRouter
from app.schemas.user import UserCreate, UserLogin
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.database.database import db

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(user: UserCreate):

    existing_user = await db.users.find_one({"email": user.email})

    if existing_user:
        return {
            "status": "error",
            "message": "Email already registered"
        }

    hashed_password = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    await db.users.insert_one(new_user)

    return {
        "status": "success",
        "message": "User registered successfully"
    }


@router.post("/login")
async def login(user: UserLogin):

    db_user = await db.users.find_one({"email": user.email})

    if not db_user:
        return {
            "status": "error",
            "message": "Invalid Email"
        }

    if not verify_password(user.password, db_user["password"]):
        return {
            "status": "error",
            "message": "Invalid Password"
        }

    token = create_access_token({
        "email": db_user["email"]
    })

    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer"
    }