import json
import re
from app.core.llm_client import LLMClient

llm = LLMClient()


def extract_json(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {"raw_output": text}
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {"raw_output": text}


def analyze_professional_presence(profile: dict) -> dict:
    prompt = f"""
You are a brutally honest career mentor reviewing a candidate's professional presence.

Target Role:
{profile.get("target_role")}

GitHub Profile:
{json.dumps(profile.get("github", {}), indent=2)}

LinkedIn Profile:
{json.dumps(profile.get("linkedin", {}), indent=2)}

Rules:
- Be honest, not polite
- Think like a hiring manager
- Give concrete action items
- Return ONLY valid JSON

Follow this schema exactly:
{{
  "overall_signal": "strong | moderate | weak",
  "github_review": {{
    "strengths": [],
    "weaknesses": [],
    "action_items": []
  }},
  "linkedin_review": {{
    "issues": [],
    "suggested_headline": "",
    "about_rewrite": ""
  }},
  "hiring_risk_flags": [],
  "priority_fixes": []
}}
"""

    response = llm.generate(
        system_prompt="You are an experienced hiring manager.",
        user_prompt=prompt
    )

    structured = extract_json(response)

    return {
        "professional_presence": structured
    }
