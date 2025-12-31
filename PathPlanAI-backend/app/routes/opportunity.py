from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.opportunity_agent import identify_opportunities

router = APIRouter()


class OpportunityRequest(BaseModel):
    capabilities: dict
    market_analysis: dict
    target_role: str


@router.post("/opportunities")
def opportunities(req: OpportunityRequest):
    return identify_opportunities(
        capabilities=req.capabilities,
        market_analysis=req.market_analysis,
        target_role=req.target_role
    )
