from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.roadmap_animation_agent import build_roadmap_animation

router = APIRouter()


class AnimationRequest(BaseModel):
    roadmap: dict


@router.post("/roadmap-animation")
def roadmap_animation(req: AnimationRequest):
    return build_roadmap_animation(req.roadmap)
