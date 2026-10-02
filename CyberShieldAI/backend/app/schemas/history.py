from pydantic import BaseModel
from datetime import datetime


class HistoryResponse(BaseModel):
    id: str
    url: str
    prediction: str
    confidence: float
    created_at: datetime