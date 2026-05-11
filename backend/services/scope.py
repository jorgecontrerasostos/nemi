import json
import os

import anthropic

_client = anthropic.AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

_SYSTEM_PROMPT = """You are a study assistant using the Feynman Technique.

Given a topic name, text notes, or an image of notes, identify the main topic and generate exactly 4 focused subtopics the student could practice explaining.

Respond with valid JSON only — no explanation, no markdown code fences:

{
  "topic": "Concise topic name (1-5 words)",
  "subtopics": [
    {
      "title": "Subtopic name (3-8 words)",
      "description": "One sentence, max 10 words",
      "icon": "material_symbol_name"
    }
  ]
}

Use only these Material Symbols icon names: wb_sunny, cycle, biotech, speed, science, memory, psychology, calculate, language, history, bolt, water_drop, eco, hub, analytics, explore, microscope, functions, timeline, auto_awesome"""


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