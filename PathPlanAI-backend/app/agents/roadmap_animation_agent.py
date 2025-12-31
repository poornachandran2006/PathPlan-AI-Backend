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


def build_roadmap_animation(roadmap: dict) -> dict:
    """
    Convert roadmap into animation instructions
    for frontend rendering (train / color traversal).
    """

    prompt = f"""
You are an AI Roadmap Animation Designer.

Input roadmap:
{json.dumps(roadmap, indent=2)}

Your task:
- Decide best animation type (train / color_wave / progress_line)
- Define traversal order of sections
- Define which nodes get highlighted
- Assign highlight colors
- Output animation timing info

Return ONLY valid JSON in this format:
{{
  "animation_type": "",
  "loop": true,
  "speed_ms": 800,
  "path": [
    {{
      "section_id": "",
      "label": "",
      "nodes": [],
      "highlight_color": ""
    }}
  ],
  "ui_hints": {{
    "show_train": true,
    "show_progress_percent": true,
    "pulse_active_node": true
  }}
}}
"""

    response = llm.generate(
        system_prompt="You design visual learning animations.",
        user_prompt=prompt
    )

    structured = extract_json(response)

    return {
        "animation_plan": structured
    }
