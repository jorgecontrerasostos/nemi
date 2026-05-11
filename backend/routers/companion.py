from fastapi import APIRouter

from models.chat import ChatRequest, ChatResponse
from services.claude import get_companion_response

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    message = await get_companion_response(request.messages, request.language, request.topic)
    return ChatResponse(message=message)
