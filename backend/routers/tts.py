from fastapi import APIRouter
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

from services.tts import synthesize_speech

router = APIRouter()


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4096)


@router.post("/tts")
async def text_to_speech(request: TTSRequest) -> Response:
    try:
        audio = await synthesize_speech(request.text)
        return Response(content=audio, media_type="audio/mpeg")
    except Exception:
        return JSONResponse(status_code=502, content={"error": "TTS unavailable"})
