from app.agents.capability_agent import build_capability_map
from app.agents.market_trend_agent import analyze_market_trends
from app.agents.opportunity_agent import identify_opportunities
from app.agents.planner_agent import build_career_roadmap

def run_career_orchestrator(
    resume_text: str,
    target_role: str,
    timeframe_months: int = 3
) -> dict:
    """Master agent coordinating all specialized agents."""

    # ✅ Fallback to ensure target_role is never empty string
    role_to_process = target_role if target_role and target_role.strip() else "General Professional"

    # 1️⃣ Analysis: Extract skills from resume
    capability_result = build_capability_map(resume_text)
    capabilities = capability_result.get("capabilities", {})

    # 2️⃣ Market Trends: Look at demand for the specific role
    market_result = analyze_market_trends(capabilities=capabilities, role=role_to_process)
    market_analysis = market_result.get("market_analysis", {})

    # 3️⃣ Opportunities: Match resume skills + market trends to specific roles
    opportunity_result = identify_opportunities(
        capabilities=capabilities,
        market_analysis=market_analysis,
        target_role=role_to_process
    )
    opportunities = opportunity_result.get("opportunities", {})

    # 4️⃣ Roadmap: Build the step-by-step plan
    roadmap_result = build_career_roadmap(
        capabilities=capabilities,
        goal=role_to_process,
        timeframe_months=timeframe_months
    )
    roadmap = roadmap_result.get("roadmap", {})

    # ✅ Wrapped in a 'result' key to match what the frontend expects in handleAnalyze
    return {
        "result": {
            "capabilities": capabilities,
            "market_analysis": market_analysis,
            "opportunities": opportunities,
            "roadmap": roadmap
        }
    }