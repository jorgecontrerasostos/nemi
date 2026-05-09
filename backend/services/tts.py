import os

from openai import AsyncOpenAI

# Migration note: replace AsyncOpenAI call here with Kokoro/Piper client when self-hosting TTS.
_client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY", "not-set"))


async def synthesize_speech(text: str) -> bytes:
    response = await _client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=text,
    )
    return await response.aread()
