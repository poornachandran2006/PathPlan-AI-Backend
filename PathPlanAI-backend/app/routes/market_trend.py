from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.market_trend_agent import analyze_market_trends

router = APIRouter()


class MarketTrendRequest(BaseModel):
    capabilities: dict
    target_role: str


@router.post("/market-trends")
def market_trends(req: MarketTrendRequest):
    return analyze_market_trends(
        capabilities=req.capabilities,
        role=req.target_role
    )
