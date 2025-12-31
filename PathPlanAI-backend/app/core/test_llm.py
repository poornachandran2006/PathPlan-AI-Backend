from app.core.llm_client import LLMClient

llm = LLMClient()
response = llm.generate(
    system_prompt="You are a helpful assistant.",
    user_prompt="Say hello in one sentence."
)

print(response)
