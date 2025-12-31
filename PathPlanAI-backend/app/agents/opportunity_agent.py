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


def identify_opportunities(
    capabilities: dict,
    market_analysis: dict,
    target_role: str
) -> dict:
    """
    Identify suitable job/internship opportunities
    based on skills and market alignment.
    """

    # ✅ Enhanced prompt to force dynamic role generation based on input
    prompt = f"""
You are an AI Opportunity Intelligence Agent. 

STRICT RULE: Do NOT default to "Backend Developer" unless it is explicitly relevant to the user's resume and target role.

Target role input by user:
{target_role}

User's Analyzed Capabilities:
{json.dumps(capabilities, indent=2)}

Market analysis data:
{json.dumps(market_analysis, indent=2)}

Your task:
1. Analyze the user's specific skills against their "Target role".
2. Generate specific role titles for these categories:
   - Safe: Roles they are qualified for TODAY based on current skills.
   - Stretch: Roles requiring 1-2 new skills.
   - Aspirational: High-level roles aligned with their "Target role" for 1-2 years out.
3. Provide unique, tailored application advice for these specific roles.

Return ONLY valid JSON:
{{
  "safe_opportunities": [],
  "stretch_opportunities": [],
  "aspirational_opportunities": [],
  "application_advice": ""
}}
"""

    response = llm.generate(
        system_prompt="You are a precise career matching agent. You generate opportunities strictly based on provided resume context and target roles, avoiding generic fallbacks.",
        user_prompt=prompt
    )

    structured = extract_json(response)

    return {
        "opportunities": structured
    }