"""
Text-to-Speech Service
Uses gTTS (Google Text-to-Speech) — free, supports Marathi, Hindi, English.
Returns base64-encoded MP3 audio for browser playback.
"""

import io
import base64
import logging
from gtts import gTTS

logger = logging.getLogger(__name__)

# Language code mapping for gTTS
GTTS_LANG_MAP = {
    "mr": "mr",   # Marathi
    "hi": "hi",   # Hindi
    "en": "en",   # English
}

# Optimal TTS speed per language (Marathi/Hindi benefit from slightly slower)
TLD_MAP = {
    "mr": "co.in",   # Indian English server — better for Indian languages
    "hi": "co.in",
    "en": "com",
}


def synthesize_speech(text: str, language: str = "hi") -> dict:
    """
    Convert text to speech using gTTS.
    
    Args:
        text: Text to convert (Marathi, Hindi, or English)
        language: BCP-47 language code (mr, hi, en)
    
    Returns:
        {
            "audio_base64": str,    # Base64-encoded MP3
            "audio_format": "mp3",
            "duration_estimate": float  # Rough duration in seconds
        }
    """
    lang = GTTS_LANG_MAP.get(language, "hi")
    tld = TLD_MAP.get(language, "co.in")

    # Trim text to avoid very long audio (TTS should be conversational)
    # Split on sentences for natural pacing
    max_chars = 500
    if len(text) > max_chars:
        # Find last sentence boundary within limit
        truncated = text[:max_chars]
        for sep in ["।", ".", "?", "!"]:
            idx = truncated.rfind(sep)
            if idx > max_chars // 2:
                truncated = truncated[:idx + 1]
                break
        text = truncated

    try:
        tts = gTTS(text=text, lang=lang, tld=tld, slow=False)
        
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        audio_bytes = audio_buffer.read()
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        
        # Rough estimate: ~150 words/min, average 5 chars/word
        word_count = len(text.split())
        duration_estimate = max(1.5, (word_count / 150) * 60)
        
        return {
            "audio_base64": audio_b64,
            "audio_format": "mp3",
            "duration_estimate": round(duration_estimate, 1),
        }

    except Exception as e:
        logger.error(f"TTS synthesis failed for language '{language}': {e}")
        # Return empty audio rather than crashing the whole pipeline
        return {
            "audio_base64": "",
            "audio_format": "mp3",
            "duration_estimate": 0,
            "error": str(e),
        }


def get_greeting(language: str = "hi") -> dict:
    """Generate a welcome greeting in the specified language."""
    greetings = {
        "mr": "नमस्कार! मी कृषी मित्र आहे. आजचा दिवस शुभ असो. काय मदत हवी आहे?",
        "hi": "नमस्ते! मैं कृषि मित्र हूं। आज का दिन शुभ हो। क्या मदद चाहिए?",
        "en": "Hello! I'm Krishi Mitra, your farming assistant. How can I help you today?",
    }
    return synthesize_speech(greetings.get(language, greetings["hi"]), language)
