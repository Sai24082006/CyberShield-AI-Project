from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_scans: int
    safe_urls: int
    phishing_urls: int