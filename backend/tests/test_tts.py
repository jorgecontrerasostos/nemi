from unittest.mock import AsyncMock, patch
import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from services.tts import synthesize_speech


@pytest.mark.asyncio
async def test_tts_endpoint_returns_audio_mpeg():
    fake_audio = b"fake-audio-bytes"
    with patch("routers.tts.synthesize_speech", AsyncMock(return_value=fake_audio)):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post("/api/tts", json={"text": "Hola mundo"})
    assert response.status_code == 200
    assert "audio/mpeg" in response.headers["content-type"]
    assert response.content == fake_audio


@pytest.mark.asyncio
async def test_tts_endpoint_requires_text_field():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/tts", json={})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_synthesize_speech_calls_openai_with_correct_params():
    fake_audio = b"audio-data"
    mock_response = AsyncMock()
    mock_response.aread = AsyncMock(return_value=fake_audio)

    mock_client = AsyncMock()
    mock_client.audio.speech.create = AsyncMock(return_value=mock_response)

    with patch("services.tts._client", mock_client):
        result = await synthesize_speech("Hello")

    assert result == fake_audio
    mock_client.audio.speech.create.assert_called_once_with(
        model="tts-1",
        voice="nova",
        input="Hello",
    )
