from fastapi import APIRouter, Depends

from app.utils.auth_guard import get_current_user
from app.services.dashboard_service import get_dashboard
from app.schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/", response_model=DashboardResponse)
async def dashboard(
    current_user: str = Depends(get_current_user)
):
    return await get_dashboard(current_user)