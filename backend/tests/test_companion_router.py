from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def app():
    from main import app as fastapi_app
    return fastapi_app


async def test_chat_returns_200(app):
    with patch("routers.companion.get_companion_response", new=AsyncMock(return_value="Hello!")):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post(
                "/api/chat",
                json={"messages": [{"role": "user", "content": "Hi"}], "language": "en"},
            )

    assert response.status_code == 200
    assert response.json()["message"] == "Hello!"


async def test_chat_missing_messages_returns_422(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/chat", json={})

    assert response.status_code == 422


async def test_health_returns_ok(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
