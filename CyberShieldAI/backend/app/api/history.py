from fastapi import APIRouter, Depends
from app.database.database import db
from app.utils.auth_guard import get_current_user

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/")
async def get_scan_history(
    current_user: str = Depends(get_current_user)
):
    """
    Get scan history for the currently authenticated user.
    """

    scans = await db.scan_history.find(
        {"email": current_user}
    ).sort(
        "created_at",
        -1
    ).to_list(length=100)

    total_scans = len(scans)

    safe_urls = sum(
        1 for scan in scans
        if scan.get("prediction") == "Safe"
    )

    phishing_urls = sum(
        1 for scan in scans
        if scan.get("prediction") == "Phishing"
    )

    history = []

    for scan in scans:
        history.append({
            "url": scan.get("url"),
            "prediction": scan.get("prediction"),
            "confidence": scan.get("confidence"),
            "created_at": scan.get("created_at")
        })

    return {
        "status": "success",
        "total_scans": total_scans,
        "safe_urls": safe_urls,
        "phishing_urls": phishing_urls,
        "history": history
    }