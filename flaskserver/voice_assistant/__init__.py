"""
Voice Assistant Package for KrishiConnect
Multilingual voice AI for farmers — Marathi, Hindi, English
Pipeline: Audio → Groq Whisper STT → LangChain/Groq LLM → gTTS → Audio
"""

from .ws_handler import handle_voice_websocket, register_http_routes

__all__ = ["handle_voice_websocket", "register_http_routes"]
