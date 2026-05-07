from unittest.mock import AsyncMock, MagicMock, patch

from models.chat import Message


async def test_get_companion_response_returns_string():
    from services.claude import get_companion_response

    messages = [Message(role="user", content="I want to study gradient descent")]
    mock_response = MagicMock()
    mock_response.content = [MagicMock(text="Great topic! What do you know about it?")]

    with patch("services.claude.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        result = await get_companion_response(messages, "en")

    assert isinstance(result, str)
    assert len(result) > 0


async def test_get_companion_response_uses_spanish_directive():
    from services.claude import get_companion_response

    messages = [Message(role="user", content="Hola")]
    mock_response = MagicMock()
    mock_response.content = [MagicMock(text="¡Hola! ¿Qué quieres estudiar hoy?")]

    with patch("services.claude.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        await get_companion_response(messages, "es")

        call_kwargs = mock_client.messages.create.call_args.kwargs
        assert "Spanish" in call_kwargs["system"]
