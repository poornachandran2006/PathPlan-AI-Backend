from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.orchestrator_agent import run_professional_review_pipeline

router = APIRouter()


class ProfessionalRequest(BaseModel):
    github_url: str
    linkedin_url: str
    linkedin_text: dict
    target_role: str


@router.post("/professional-insight")
def professional_insight(req: ProfessionalRequest):
    return run_professional_review_pipeline(req.dict())
