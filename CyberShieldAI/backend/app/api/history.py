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
    Get all URL scan history for the authenticated user.

    Stored information:
        - URL
        - Prediction
        - Confidence

    No date or time is used.
    """

    scans = await db.scan_history.find(
        {}
    ).sort(
        "_id",
        -1
    ).to_list(length=1000)

    total_scans = len(scans)

    safe_urls = sum(
        1
        for scan in scans
        if scan.get("prediction") == "Safe"
    )

    phishing_urls = sum(
        1
        for scan in scans
        if scan.get("prediction") == "Phishing"
    )

    history = []

    for scan in scans:
        history.append(
            {
                "id": str(scan.get("_id")),
                "url": scan.get("url", ""),
                "prediction": scan.get("prediction", ""),
                "confidence": scan.get("confidence", 0)
            }
        )

    return {
        "status": "success",
        "total_scans": total_scans,
        "safe_urls": safe_urls,
        "phishing_urls": phishing_urls,
        "history": history
    }