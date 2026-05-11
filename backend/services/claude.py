import os
from pathlib import Path

import anthropic
from dotenv import load_dotenv

from models.chat import Message

load_dotenv()

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"
SYSTEM_PROMPT = (_PROMPTS_DIR / "companion.txt").read_text(encoding="utf-8")

client = anthropic.AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))


async def get_companion_response(
    messages: list[Message],
    language: str = "en",
    topic: str | None = None,
) -> str:
    """Send conversation history to Claude and return the assistant reply."""
    language_directive = "Please respond in Spanish. " if language == "es" else ""
    system = f"{language_directive}{SYSTEM_PROMPT}".strip()
    if topic:
        system += f"\n\nThe student is focusing on: {topic}. Keep your questions and feedback centered on this specific area."

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=[{"role": m.role, "content": m.content} for m in messages], # type: ignore
    )
    return response.content[0].text # pyright: ignore[reportAttributeAccessIssue]
