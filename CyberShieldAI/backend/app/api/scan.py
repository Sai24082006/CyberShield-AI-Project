from fastapi import APIRouter, Depends
from app.schemas.scan import ScanRequest, ScanResponse
from app.services.scan_service import scan_url
from app.utils.auth_guard import get_current_user

router = APIRouter(
    prefix="/scan",
    tags=["Scan"]
)


@router.post("/", response_model=ScanResponse)
async def scan(
    request: ScanRequest,
    current_user: str = Depends(get_current_user)
):
    """
    Scan a URL for phishing detection.
    Only authenticated users can access this endpoint.
    """

    result = await scan_url(
        str(request.url),
        current_user
    )

    return result