from typing import Literal
from pydantic import BaseModel


class SubtopicItem(BaseModel):
    title: str
    description: str
    icon: str


class ScopeRequest(BaseModel):
    topic: str | None = None
    text: str | None = None
    image_base64: str | None = None
    image_media_type: Literal["image/jpeg", "image/png", "image/webp"] = "image/jpeg"


class ScopeResponse(BaseModel):
    topic: str
    subtopics: list[SubtopicItem]
