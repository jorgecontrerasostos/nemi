import json
import os
from pathlib import Path

import anthropic

_client = anthropic.AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"
_SYSTEM_PROMPT = (_PROMPTS_DIR / "scope.txt").read_text(encoding="utf-8")


async def generate_scope(
    topic: str | None = None,
    text: str | None = None,
    image_base64: str | None = None,
    image_media_type: str = "image/jpeg",
) -> dict:
    """Call Claude to extract a topic and generate 4 subtopics."""
    content: list[dict] = []

    if image_base64:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": image_media_type,
                "data": image_base64,
            },
        })

    if topic:
        user_text = f"Topic: {topic}"
    elif text:
        user_text = f"Notes:\n{text}"
    else:
        user_text = "Generate subtopics based on the image of notes above."

    content.append({"type": "text", "text": user_text})

    response = await _client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": content}],
    )

    raw = response.content[0].text  # pyright: ignore[reportAttributeAccessIssue]
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid scope response: {raw}") from exc