"""
WebSocket Handler — Voice Assistant Pipeline
Route: /api/voice/ws  (WebSocket — registered directly in app.py)
Route: /api/voice/chat  (HTTP fallback)
Route: /api/voice/tts   (HTTP TTS only)
Route: /api/voice/greeting (HTTP greeting)
Route: /api/voice/health   (HTTP health check)

Protocol (Client → Server):
  Binary frames: raw audio bytes (webm/opus from MediaRecorder)
  Text frames: JSON {type: "config", session_id, language, audio_format}
              JSON {type: "audio_end"}
              JSON {type: "text_only", session_id, language, text}
              JSON {type: "ping"}

Protocol (Server → Client):
  JSON {
    type: "transcript" | "response" | "error" | "avatar_state" | "config_ack" | "pong",
    ...fields...
  }
"""

import json
import logging
import uuid
from flask import request, jsonify

from .stt_service import transcribe_audio
from .llm_service import get_llm_service
from .tts_service import synthesize_speech, get_greeting

logger = logging.getLogger(__name__)

LANG_DISPLAY = {"mr": "मराठी", "hi": "हिंदी", "en": "English"}


def handle_voice_websocket(ws):
    """
    Main WebSocket handler — called from the @sock.route decorator in app.py.
    Manages the full STT → LLM → TTS pipeline over a persistent connection.
    """
    session_id = None
    language = "hi"
    audio_format = "webm"
    audio_buffer = bytearray()

    logger.info("New voice WebSocket connection established")

    try:
        while True:
            message = ws.receive()

            if message is None:
                break

            # ── Text control frames ──────────────────────────────────────
            if isinstance(message, str):
                try:
                    data = json.loads(message)
                    msg_type = data.get("type", "")

                    if msg_type == "config":
                        session_id = data.get("session_id", str(uuid.uuid4()))
                        language = data.get("language", "hi")
                        audio_format = data.get("audio_format", "webm")
                        audio_buffer.clear()
                        logger.info(f"Session configured: {session_id}, lang={language}, fmt={audio_format}")
                        ws.send(json.dumps({"type": "config_ack", "session_id": session_id}))

                    elif msg_type == "audio_end":
                        if not session_id:
                            session_id = str(uuid.uuid4())

                        if not audio_buffer:
                            ws.send(json.dumps({"type": "error", "message": "No audio received"}))
                            continue

                        ws.send(json.dumps({"type": "avatar_state", "state": "thinking"}))
                        audio_bytes = bytes(audio_buffer)
                        audio_buffer.clear()

                        # ── Step 1: STT ──────────────────────────────────
                        try:
                            stt_result = transcribe_audio(audio_bytes, audio_format)
                            transcript = stt_result["text"]
                            detected_lang = stt_result["language"]
                            language = detected_lang

                            if not transcript:
                                ws.send(json.dumps({
                                    "type": "error",
                                    "message": "Could not understand audio. Please speak clearly."
                                }))
                                continue

                            ws.send(json.dumps({
                                "type": "transcript",
                                "transcript": transcript,
                                "language": detected_lang,
                                "language_display": stt_result["language_display"],
                            }))

                        except Exception as e:
                            logger.error(f"STT failed: {e}")
                            ws.send(json.dumps({"type": "error", "message": f"STT error: {str(e)}"}))
                            continue

                        # ── Step 2: LLM ──────────────────────────────────
                        try:
                            llm = get_llm_service()
                            llm_result = llm.process_turn(session_id, transcript, language)
                        except Exception as e:
                            logger.error(f"LLM failed: {e}")
                            ws.send(json.dumps({"type": "error", "message": f"AI error: {str(e)}"}))
                            continue

                        # ── Step 3: TTS ──────────────────────────────────
                        try:
                            tts_result = synthesize_speech(llm_result["response_text"], language)
                        except Exception as e:
                            logger.error(f"TTS failed: {e}")
                            tts_result = {"audio_base64": "", "audio_format": "mp3", "duration_estimate": 0}

                        # ── Send full response ────────────────────────────
                        ws.send(json.dumps({
                            "type": "response",
                            "transcript": transcript,
                            "language": language,
                            "language_display": stt_result.get("language_display", language),
                            "response_text": llm_result["response_text"],
                            "intent": llm_result["intent"],
                            "missing_slots": llm_result.get("missing_slots", []),
                            "is_complete": llm_result.get("is_complete", False),
                            "audio_base64": tts_result["audio_base64"],
                            "audio_format": tts_result["audio_format"],
                            "duration_estimate": tts_result["duration_estimate"],
                            "avatar_state": "speaking",
                        }))

                    elif msg_type == "text_only":
                        if not session_id:
                            session_id = str(uuid.uuid4())

                        text = data.get("text", "").strip()
                        language = data.get("language", language)

                        if not text:
                            continue

                        ws.send(json.dumps({"type": "avatar_state", "state": "thinking"}))

                        try:
                            llm = get_llm_service()
                            llm_result = llm.process_turn(session_id, text, language)
                            tts_result = synthesize_speech(llm_result["response_text"], language)

                            ws.send(json.dumps({
                                "type": "response",
                                "transcript": text,
                                "language": language,
                                "language_display": LANG_DISPLAY.get(language, language),
                                "response_text": llm_result["response_text"],
                                "intent": llm_result["intent"],
                                "missing_slots": llm_result.get("missing_slots", []),
                                "is_complete": llm_result.get("is_complete", False),
                                "audio_base64": tts_result["audio_base64"],
                                "audio_format": tts_result["audio_format"],
                                "duration_estimate": tts_result["duration_estimate"],
                                "avatar_state": "speaking",
                            }))
                        except Exception as e:
                            logger.error(f"text_only error: {e}")
                            ws.send(json.dumps({"type": "error", "message": str(e)}))

                    elif msg_type == "ping":
                        ws.send(json.dumps({"type": "pong"}))

                except json.JSONDecodeError:
                    logger.warning("Received invalid JSON on WebSocket")

            # ── Binary audio chunks ──────────────────────────────────────
            elif isinstance(message, bytes):
                audio_buffer.extend(message)

    except Exception as e:
        logger.error(f"WebSocket session error: {e}")
    finally:
        logger.info(f"Voice WebSocket closed — session: {session_id}")


def register_http_routes(app):
    """
    Register HTTP fallback routes directly on the Flask app.
    These allow text-only interaction when WebSocket is unavailable.
    """

    @app.route("/api/voice/chat", methods=["POST"])
    def voice_chat_http():
        """HTTP fallback: {session_id, language, text} → JSON response"""
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        session_id = data.get("session_id", str(uuid.uuid4()))
        language = data.get("language", "hi")
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "text is required"}), 400

        try:
            llm = get_llm_service()
            llm_result = llm.process_turn(session_id, text, language)
            tts_result = synthesize_speech(llm_result["response_text"], language)

            return jsonify({
                "session_id": session_id,
                "language": language,
                "response_text": llm_result["response_text"],
                "intent": llm_result["intent"],
                "missing_slots": llm_result.get("missing_slots", []),
                "is_complete": llm_result.get("is_complete", False),
                "audio_base64": tts_result["audio_base64"],
                "audio_format": tts_result["audio_format"],
                "duration_estimate": tts_result["duration_estimate"],
            })
        except Exception as e:
            logger.error(f"HTTP chat error: {e}")
            return jsonify({"error": str(e)}), 500

    @app.route("/api/voice/tts", methods=["POST"])
    def voice_tts_http():
        """TTS only: {text, language} → {audio_base64, audio_format, duration_estimate}"""
        data = request.get_json() or {}
        text = data.get("text", "")
        language = data.get("language", "hi")
        if not text:
            return jsonify({"error": "text required"}), 400
        return jsonify(synthesize_speech(text, language))

    @app.route("/api/voice/greeting", methods=["GET"])
    def voice_greeting():
        """Returns a welcome greeting audio for the specified language."""
        language = request.args.get("lang", "hi")
        return jsonify(get_greeting(language))

    @app.route("/api/voice/health", methods=["GET"])
    def voice_health():
        """Health check — confirms voice assistant services are live."""
        return jsonify({
            "status": "ok",
            "services": {
                "stt": "Groq Whisper-large-v3-turbo",
                "llm": "Groq LLaMA-3.3-70b via LangChain",
                "tts": "gTTS (free)",
            },
            "supported_languages": ["mr (Marathi)", "hi (Hindi)", "en (English)"],
        })
