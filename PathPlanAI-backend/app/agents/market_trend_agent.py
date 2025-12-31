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


def analyze_market_trends(capabilities: dict, role: str) -> dict:
    """
    Analyze current market trends for a given role
    and compare with user's skills.
    """

    prompt = f"""
You are an AI Market Intelligence Agent.

Target role:
{role}

User capabilities:
{json.dumps(capabilities, indent=2)}

Based on current (2024–2025) tech job market trends:
1. List top in-demand skills for this role
2. Identify which skills the user already has
3. Identify missing but critical skills
4. Estimate a trend alignment score (0–100)
5. Give clear learning recommendations

Return ONLY valid JSON in this format:
{{
  "market_trends": [],
  "matched_skills": [],
  "missing_skills": [],
  "trend_alignment_score": 0,
  "recommendations": []
}}
"""

    response = llm.generate(
        system_prompt="You analyze real-world job market trends.",
        user_prompt=prompt
    )

    structured = extract_json(response)

    return {
        "market_analysis": structured
    }
