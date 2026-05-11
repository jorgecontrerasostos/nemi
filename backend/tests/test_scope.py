import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.mark.asyncio
async def test_generate_scope_from_topic():
    mock_text = json.dumps({
        "topic": "Photosynthesis",
        "subtopics": [
            {"title": "Light Reactions", "description": "ATP and NADPH production", "icon": "wb_sunny"},
            {"title": "Calvin Cycle", "description": "CO2 fixation into sugars", "icon": "cycle"},
            {"title": "Chloroplast Anatomy", "description": "Stroma and thylakoid structure", "icon": "biotech"},
            {"title": "Efficiency Factors", "description": "Light, temp, CO2 effects", "icon": "speed"},
        ],
    })
    mock_response = MagicMock()
    mock_response.content = [MagicMock(text=mock_text)]

    with patch("services.scope._client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        from services.scope import generate_scope
        result = await generate_scope(topic="Photosynthesis")

    assert result["topic"] == "Photosynthesis"
    assert len(result["subtopics"]) == 4
    assert result["subtopics"][0]["icon"] == "wb_sunny"


@pytest.mark.asyncio
async def test_generate_scope_from_text():
    mock_text = json.dumps({
        "topic": "Calculus",
        "subtopics": [
            {"title": "Derivatives", "description": "Rate of change", "icon": "analytics"},
            {"title": "Integrals", "description": "Area under curve", "icon": "functions"},
            {"title": "Limits", "description": "Approaching values", "icon": "timeline"},
            {"title": "Chain Rule", "description": "Composite function derivative", "icon": "hub"},
        ],
    })
    mock_response = MagicMock()
    mock_response.content = [MagicMock(text=mock_text)]

    with patch("services.scope._client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        from services.scope import generate_scope
        result = await generate_scope(text="The derivative measures the rate of change of a function...")

    assert result["topic"] == "Calculus"
    assert len(result["subtopics"]) == 4


@pytest.mark.asyncio
async def test_generate_scope_raises_on_invalid_json():
    mock_response = MagicMock()
    mock_response.content = [MagicMock(text="not valid json")]

    with patch("services.scope._client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        from services.scope import generate_scope
        with pytest.raises(ValueError, match="Invalid scope response"):
            await generate_scope(topic="Test")