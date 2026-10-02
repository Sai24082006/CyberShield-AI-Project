from app.database.database import db


async def get_dashboard(email: str):
    total_scans = await db.scan_history.count_documents(
        {"email": email}
    )

    safe_urls = await db.scan_history.count_documents(
        {
            "email": email,
            "prediction": "Safe"
        }
    )

    phishing_urls = await db.scan_history.count_documents(
        {
            "email": email,
            "prediction": "Phishing"
        }
    )

    return {
        "total_scans": total_scans,
        "safe_urls": safe_urls,
        "phishing_urls": phishing_urls
    }