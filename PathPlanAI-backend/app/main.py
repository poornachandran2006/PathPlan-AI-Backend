from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.capability import router as capability_router
from app.routes.planner import router as planner_router
from app.routes.market_trend import router as market_trend_router
from app.routes.opportunity import router as opportunity_router
from app.routes.orchestrator import router as orchestrator_router
from app.routes.resume_upload import router as resume_router
from app.routes.roadmap_animation import router as roadmap_animation_router
from app.routes.professional_presence import router as professional_presence_router
from app.routes.route_planner import router as route_router

# ✅ Create app
app = FastAPI(title="PathPlanAI Backend")

# ✅ Improved CORS: Added common local development origins to prevent "Failed to fetch"
# Some browsers resolve 'localhost' differently than '127.0.0.1'
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Health Check (Verify backend is reachable)
# Use this to test connectivity: open http://127.0.0.1:8000/ in your browser
@app.get("/")
def health_check():
    return {"status": "PathPlanAI Backend is running"}

# ✅ Include routers
# Router order: Specific high-priority routes first
app.include_router(resume_router)  # Handles /upload-resume
app.include_router(planner_router) # Handles /planner/
app.include_router(capability_router)
app.include_router(market_trend_router)
app.include_router(opportunity_router)
app.include_router(orchestrator_router)
app.include_router(roadmap_animation_router)
app.include_router(professional_presence_router)
app.include_router(route_router)