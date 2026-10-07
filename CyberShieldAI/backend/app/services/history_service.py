from app.database.database import db


async def get_scan_history(email: str = ""):
    history = []

    cursor = db.scan_history.find(
        {}
    ).sort("_id", -1)

    async for scan in cursor:
        history.append(
            {
                "id": str(scan["_id"]),
                "url": scan.get("url", ""),
                "prediction": scan.get("prediction", ""),
                "confidence": scan.get("confidence", 0)
            }
        )

    return history