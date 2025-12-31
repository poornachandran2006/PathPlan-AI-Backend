import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form
from app.agents.resume_parser_agent import extract_text_from_resume
from app.agents.orchestrator_agent import run_career_orchestrator

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...),
    # ✅ Changed to Form(...) without a default value to ensure input is captured
    target_role: str = Form(...), 
    timeframe_months: int = Form(3)
):
    file_path = os.path.join(UPLOAD_DIR, resume.filename)

    try:
        # 1️⃣ Save uploaded resume temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        # 2️⃣ Extract text from PDF
        resume_text = extract_text_from_resume(file_path)

        # 3️⃣ Run full agent pipeline
        # This now returns a dict structured as {"result": {...}}
        orchestrator_output = run_career_orchestrator(
            resume_text=resume_text,
            target_role=target_role,
            timeframe_months=timeframe_months
        )

        # 4️⃣ Return flattened result
        # We extract 'result' from orchestrator_output to avoid double-nesting
        return {
            "resume_filename": resume.filename,
            "result": orchestrator_output.get("result")
        }

    finally:
        # 5️⃣ ALWAYS delete file after processing
        if os.path.exists(file_path):
            os.remove(file_path)