from pydantic import BaseModel, HttpUrl


class ScanRequest(BaseModel):
    url: HttpUrl


class ScanResponse(BaseModel):
    status: str
    url: str
    prediction: str
    confidence: float