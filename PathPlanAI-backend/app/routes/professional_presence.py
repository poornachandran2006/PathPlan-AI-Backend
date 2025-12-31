from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.professional_presence_agent import analyze_professional_presence

router = APIRouter()


class PresenceRequest(BaseModel):
    github: dict
    linkedin: dict
    target_role: str


@router.post("/professional-review")
def professional_review(req: PresenceRequest):
    return analyze_professional_presence(req.dict())
