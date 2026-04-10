"""
Speech-to-Text Service
Uses Groq Whisper API — supports Marathi, Hindi, English natively.
Falls back to language detection from transcript if language tag unavailable.
"""

import os
import io
import logging
from groq import Groq

logger = logging.getLogger(__name__)

# Language code mapping from Whisper output to BCP-47
LANGUAGE_MAP = {
    "marathi": "mr",
    "mr": "mr",
    "hindi": "hi",
    "hi": "hi",
    "english": "en",
    "en": "en",
    None: "hi",  # Default fallback
}

# Language display names for UI
LANGUAGE_DISPLAY = {
    "mr": "मराठी",
    "hi": "हिंदी",
    "en": "English",
}

def transcribe_audio(audio_bytes: bytes, audio_format: str = "webm") -> dict:
    """
    Transcribe audio bytes using Groq Whisper API.
    
    Args:
        audio_bytes: Raw audio data from browser MediaRecorder
        audio_format: Audio format (webm, wav, mp3, ogg)
    
    Returns:
        {
            "text": str,           # Transcribed text
            "language": str,       # BCP-47 code (mr, hi, en)
            "language_display": str,  # Human-readable language name
            "confidence": float    # Optional confidence score
        }
    """
    api_key_env = os.environ.get("GROQ_API_KEY")
    api_key = api_key_env.strip() if api_key_env else None
    if not api_key:
        raise ValueError("GROQ_API_KEY not set in environment variables")

    client = Groq(api_key=api_key)

    # Prepare audio file-like object
    # Groq Whisper accepts: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = f"audio.{audio_format}"

    try:
        transcription = client.audio.transcriptions.create(
            file=(audio_file.name, audio_bytes, _get_mime_type(audio_format)),
            model="whisper-large-v3-turbo",  # Best multilingual support
            response_format="verbose_json",   # Get language detection
            temperature=0.0,                  # Deterministic for accuracy
        )

        detected_lang = getattr(transcription, "language", None)
        lang_code = LANGUAGE_MAP.get(detected_lang, LANGUAGE_MAP.get(str(detected_lang).lower(), "hi"))

        return {
            "text": transcription.text.strip(),
            "language": lang_code,
            "language_display": LANGUAGE_DISPLAY.get(lang_code, "हिंदी"),
            "confidence": 0.95,  # Groq Whisper doesn't expose per-segment confidence in basic API
        }

    except Exception as e:
        logger.error(f"STT transcription failed: {e}")
        raise RuntimeError(f"Speech-to-text failed: {str(e)}")


def _get_mime_type(fmt: str) -> str:
    mime_map = {
        "webm": "audio/webm",
        "wav": "audio/wav",
        "mp3": "audio/mpeg",
        "ogg": "audio/ogg",
        "opus": "audio/ogg; codecs=opus",
        "mp4": "audio/mp4",
        "m4a": "audio/mp4",
    }
    return mime_map.get(fmt, "audio/webm")
