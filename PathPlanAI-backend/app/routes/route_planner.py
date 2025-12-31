from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.route_planner_agent import plan_route

router = APIRouter(prefix="/route", tags=["Route Planner"])

# ✅ Define a schema for the incoming JSON data
# This ensures capability and opportunities are correctly parsed from the request body
class RouteRequest(BaseModel):
    capability: dict
    opportunities: dict

@router.post("/")
def get_route(req: RouteRequest):
    # Pass the validated data from the request model to the helper function
    return plan_route(req.capability, req.opportunities)