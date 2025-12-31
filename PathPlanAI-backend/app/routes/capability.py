from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.capability_agent import build_capability_map

router = APIRouter()

class CapabilityRequest(BaseModel):
    resume_text: str

@router.post("/capability")
def capability(req: CapabilityRequest):
    return build_capability_map(req.resume_text)
