from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.orchestrator_agent import run_career_orchestrator
from app.agents.github_fetch_agent import fetch_github_profile
from app.agents.linkedin_ingest_agent import ingest_linkedin_text
from app.agents.professional_presence_agent import analyze_professional_presence

router = APIRouter()


class OrchestratorRequest(BaseModel):
    resume_text: str
    target_role: str
    timeframe_months: int = 3


@router.post("/career-agent")
def career_agent(req: OrchestratorRequest):
    return run_career_orchestrator(
        resume_text=req.resume_text,
        target_role=req.target_role,
        timeframe_months=req.timeframe_months
    )


def run_professional_review_pipeline(input_data: dict):
    github_url = input_data["github_url"]
    username = github_url.rstrip("/").split("/")[-1]

    github_data = fetch_github_profile(username)
    linkedin_data = ingest_linkedin_text(input_data["linkedin_text"])

    return analyze_professional_presence({
        "github": github_data,
        "linkedin": linkedin_data,
        "target_role": input_data["target_role"]
    })
