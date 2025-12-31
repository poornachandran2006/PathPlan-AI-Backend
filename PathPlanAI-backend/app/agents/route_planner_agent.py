from app.core.llm_client import LLMClient
import json

class RoutePlannerAgent:
    def __init__(self):
        self.llm = LLMClient()

    def plan(self, capability: dict, opportunities: dict) -> dict:
        system_prompt = """
You are a career strategy planning agent.
Choose the best strategy and explain why.
Respond strictly in JSON.
"""

        user_prompt = f"""
Capability Analysis:
{capability}

Opportunities:
{opportunities}

Output format:
{{
  "route": "Skill First | Balanced | Apply First",
  "reasoning": "...",
  "next_actions": [...]
}}
"""

        response = self.llm.generate(system_prompt, user_prompt)
        return json.loads(response)

# Added this helper function to resolve the ImportError in route_planner.py
def plan_route(capability: dict, opportunities: dict):
    agent = RoutePlannerAgent()
    return agent.plan(capability, opportunities)