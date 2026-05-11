from fastapi import APIRouter
from fastapi.responses import JSONResponse

from models.scope import ScopeRequest, ScopeResponse
from services.scope import generate_scope

router = APIRouter()


@router.post("/scope", response_model=ScopeResponse)
async def scope_topic(request: ScopeRequest) -> ScopeResponse:
    try:
        result = await generate_scope(
            topic=request.topic,
            text=request.text,
            image_base64=request.image_base64,
            image_media_type=request.image_media_type,
        )
        return ScopeResponse(**result)
    except Exception:
        return JSONResponse(status_code=502, content={"error": "Scope generation unavailable"})