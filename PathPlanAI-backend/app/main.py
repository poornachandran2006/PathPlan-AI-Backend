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

# =========================
# ✅ Create FastAPI app
# =========================
app = FastAPI(title="PathPlanAI Backend")

# =========================
# ✅ CORS (FINAL – PRODUCTION SAFE)
# Allows requests from Vercel + local dev
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔓 Allow all origins (safe for prototype)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ✅ Health Checks
# =========================
@app.get("/")
def root_health():
    return {"status": "PathPlanAI Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

# =========================
# ✅ Include Routers
# =========================
# Router order: specific → general
app.include_router(resume_router)               # /upload-resume
app.include_router(planner_router)              # /planner/
app.include_router(capability_router)           # /capability/
app.include_router(market_trend_router)
app.include_router(opportunity_router)
app.include_router(orchestrator_router)
app.include_router(roadmap_animation_router)
app.include_router(professional_presence_router)
app.include_router(route_router)
