import json
import re
from app.core.llm_client import LLMClient

llm = LLMClient()

def extract_json(text: str) -> dict:
    """
    Extract JSON object from LLM response safely.
    """
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {"raw_output": text}

    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {"raw_output": text}


def build_capability_map(resume_text: str) -> dict:
    # ✅ Updated prompt to include soft_skills, summary, and readiness score
    prompt = f"""
You are an AI career capability analysis agent.

Extract the following from the resume:
1. technical_skills (List of strings)
2. soft_skills (List of strings)
3. summary (A brief 2-3 sentence overview of the candidate)
4. career_readiness_score (An integer from 0-100)

Resume:
{resume_text}

Return ONLY valid JSON in this exact format:
{{
  "technical_skills": [],
  "soft_skills": [],
  "summary": "",
  "career_readiness_score": 0
}}
"""

    response = llm.generate(
        system_prompt="You extract structured career capabilities.",
        user_prompt=prompt
    )

    structured = extract_json(response)

    # ✅ Wrap the structured data in the 'capabilities' key expected by the orchestrator
    return {
        "capabilities": structured
    }