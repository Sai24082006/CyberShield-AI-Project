from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.email_service import analyze_email


router = APIRouter(
    prefix="/email",
    tags=["Email Phishing Detection"]
)


class EmailScanRequest(BaseModel):
    sender: str = ""
    subject: str = ""
    body: str = ""


@router.post("/scan")
async def scan_email(payload: EmailScanRequest):

    if not payload.subject.strip() and not payload.body.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide an email subject or body."
        )

    return analyze_email(
        payload.sender,
        payload.subject,
        payload.body
    )