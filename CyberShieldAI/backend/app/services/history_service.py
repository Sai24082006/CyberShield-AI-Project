from app.database.database import db


async def get_scan_history(email: str):
    history = []

    cursor = db.scan_history.find(
        {"email": email}
    ).sort("created_at", -1)

    async for scan in cursor:
        history.append(
            {
                "id": str(scan["_id"]),
                "url": scan["url"],
                "prediction": scan["prediction"],
                "confidence": scan["confidence"],
                "created_at": scan["created_at"]
            }
        )

    return history