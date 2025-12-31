import json
import re
from app.core.llm_client import LLMClient

llm = LLMClient()


def extract_json(text: str) -> dict:
    """
    Extract JSON safely from LLM output.
    """
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {"raw_output": text}

    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {"raw_output": text}


def build_career_roadmap(
    capabilities: dict,
    goal: str,
    timeframe_months: int = 3
) -> dict:
    """
    Build a DOMAIN-SPECIFIC VISUAL ROADMAP with detailed skill nodes.
    """

    # ✅ Removed "frontend" mentions and added strict industry enforcement
    prompt = f"""
You are an AI Career Roadmap Architect specializing in diverse professional industries.

Your task is to create a structured learning roadmap for a user transitioning into the following role:
TARGET ROLE: {goal}

STRICT RULE: Do NOT include any web development, HTML, CSS, or programming concepts unless the TARGET ROLE specifically requires them. If the role is in Healthcare, Nutrition, Finance, etc., use ONLY skills relevant to that specific domain.

User's Current Capabilities:
{json.dumps(capabilities, indent=2)}

Timeframe for completion:
{timeframe_months} months

Roadmap Requirements:
- Break learning into logical SECTIONS (e.g., Fundamentals, Industry Standards, Advanced Strategy).
- Each section must include: id, title, level, color, and nodes.
- Each NODE inside 'nodes' must represent a specific skill or knowledge area and include:
    - skill: Name of the professional skill.
    - level: Beginner, Intermediate, or Advanced.
    - description: 1-2 sentences on what the user needs to master.
    - resources: 2-3 specific professional resources, textbooks, certifications, or organizations (e.g., if Nutrition: "Academy of Nutrition and Dietetics", "WHO Guidelines").

Return ONLY valid JSON.

Schema:
{{
  "roadmap_title": "",
  "target_role": "",
  "timeline_months": {timeframe_months},
  "sections": [
    {{
      "id": "lowercase_id",
      "title": "",
      "level": "foundation | core | application | advanced",
      "color": "hex_code",
      "prerequisites": [],
      "nodes": [
        {{
          "skill": "",
          "level": "",
          "description": "",
          "resources": []
        }}
      ]
    }}
  ]
}}
"""

    response = llm.generate(
        system_prompt=f"You are an expert career consultant for the {goal} industry. You design accurate, industry-specific learning paths.",
        user_prompt=prompt
    )

    structured = extract_json(response)

    # ---------- NORMALIZATION ----------
    allowed_levels = {"foundation", "core", "application", "advanced"}
    default_colors = {
        "foundation": "#4A90E2",
        "core": "#7ED321",
        "application": "#50E3C2",
        "advanced": "#D0021B"
    }

    sections = structured.get("sections", [])
    normalized_sections = []

    for idx, sec in enumerate(sections):
        level = sec.get("level", "foundation")
        if level not in allowed_levels:
            level = "foundation"

        section_id = sec.get("id", "").strip().lower().replace(" ", "_")

        normalized_sections.append({
            "id": section_id if section_id else f"section_{idx+1}",
            "title": sec.get("title", "Untitled Section"),
            "level": level,
            "color": sec.get("color", default_colors.get(level, "#4A90E2")),
            "prerequisites": sec.get("prerequisites", []),
            "nodes": sec.get("nodes", [])
        })

    return {
        "roadmap": {
            "roadmap_title": structured.get("roadmap_title", f"Roadmap to {goal}"),
            "target_role": structured.get("target_role", goal),
            "timeline_months": structured.get("timeline_months", timeframe_months),
            "sections": normalized_sections
        }
    }