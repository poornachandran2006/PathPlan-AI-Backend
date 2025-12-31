from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.planner_agent import build_career_roadmap

# ✅ Prefix matches the frontend fetch call in lib/api.ts
router = APIRouter(prefix="/planner", tags=["Planner"])

class PlannerRequest(BaseModel):
    capabilities: dict
    goal: str
    timeframe_months: int = 3

@router.post("/")
def get_roadmap(req: PlannerRequest):
    """
    Endpoint to generate a domain-specific roadmap for a chosen career goal.
    """
    # 1️⃣ Calls the updated domain-enforced agent
    result = build_career_roadmap(
        capabilities=req.capabilities,
        goal=req.goal,
        timeframe_months=req.timeframe_months
    )
    
    # 2️⃣ Return the 'roadmap' object directly to match the frontend state expectations
    # This ensures the frontend receives { roadmap_title, sections: [...] }
    return result.get("roadmap", result)