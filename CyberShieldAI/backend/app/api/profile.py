from fastapi import APIRouter, Depends
from app.utils.auth_guard import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/")
async def get_profile(
    current_user: str = Depends(get_current_user)
):
    return {
        "status": "success",
        "message": "Welcome to CyberShield AI",
        "email": current_user
    }