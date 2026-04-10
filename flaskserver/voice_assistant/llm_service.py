"""
LLM Service — Multilingual Slot-Filling Dialogue Manager
Uses Groq (llama-3.3-70b) via LangChain for intent classification and conversational slot-filling.

Supported Intents:
  - insurance_inquiry   → slots: crop_type, acreage, location
  - crop_price          → slots: crop_name, location
  - weather             → slots: location
  - disease_help        → slots: crop_name, symptoms
  - irrigation_advice   → slots: crop_name, soil_type
  - general             → no slots required
"""

import os
import json
import logging
from typing import Optional
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

logger = logging.getLogger(__name__)

# ============================================================
# MULTILINGUAL SYSTEM PROMPTS
# ============================================================

SYSTEM_PROMPTS = {
    "mr": """तुम्ही KrishiConnect चे AI सहाय्यक 'कृषी मित्र' आहात. तुम्ही भारतीय शेतकऱ्यांना मराठीत मदत करता.

तुमची कार्ये:
1. शेतकऱ्याची इच्छा समजून घ्या (intent classification)
2. आवश्यक माहिती विचारा (slot filling)
3. उपयुक्त, सरळ, आदरपूर्वक उत्तर द्या

तुम्ही खालील विषयांवर मदत करता:
- पीक विमा (crop insurance) — आवश्यक: पीकाचे नाव, क्षेत्रफळ (एकर), जिल्हा/तालुका
- बाजारभाव (market prices) — आवश्यक: पीकाचे नाव, बाजार/गाव
- हवामान (weather) — आवश्यक: गाव/जिल्हा
- रोग निदान (disease help) — आवश्यक: पीकाचे नाव, लक्षणे
- सिंचन सल्ला (irrigation advice) — आवश्यक: पीकाचे नाव, जमिनीचा प्रकार
- सामान्य शेती सल्ला

JSON FORMAT मध्ये उत्तर द्या:
{{
  "intent": "<intent_code>",
  "response_text": "<मराठीत उत्तर>",
  "missing_slots": ["slot1", "slot2"],
  "collected_slots": {{"slot_name": "value"}},
  "is_complete": true/false,
  "action": null or "fetch_insurance|fetch_price|fetch_weather"
}}

महत्त्वाचे: response_text नेहमी मराठीत लिहा. शेतकऱ्यांना सोपी भाषा वापरा.""",

    "hi": """आप KrishiConnect के AI सहायक 'कृषि मित्र' हैं। आप भारतीय किसानों की हिंदी में मदद करते हैं।

आपके कार्य:
1. किसान की जरूरत समझें (intent classification)
2. जरूरी जानकारी पूछें (slot filling)
3. सरल, उपयोगी, आदरपूर्ण जवाब दें

आप इन विषयों पर मदद करते हैं:
- फसल बीमा (crop insurance) — जरूरी: फसल का नाम, क्षेत्रफल (एकड़), जिला
- बाजार भाव (market prices) — जरूरी: फसल का नाम, बाजार/गांव
- मौसम (weather) — जरूरी: गांव/जिला
- रोग पहचान (disease help) — जरूरी: फसल का नाम, लक्षण
- सिंचाई सलाह (irrigation advice) — जरूरी: फसल, मिट्टी का प्रकार
- सामान्य खेती सलाह

JSON FORMAT में जवाब दें:
{{
  "intent": "<intent_code>",
  "response_text": "<हिंदी में जवाब>",
  "missing_slots": ["slot1", "slot2"],
  "collected_slots": {{"slot_name": "value"}},
  "is_complete": true/false,
  "action": null or "fetch_insurance|fetch_price|fetch_weather"
}}

महत्वपूर्ण: response_text हमेशा हिंदी में लिखें। किसानों के लिए सरल भाषा इस्तेमाल करें।""",

    "en": """You are 'Krishi Mitra', the AI assistant for KrishiConnect, helping Indian farmers in English.

Your tasks:
1. Understand the farmer's intent (intent classification)
2. Ask for required information step-by-step (slot filling)
3. Give practical, concise, respectful responses

You help with:
- Crop insurance — required slots: crop_type, acreage, location
- Market prices — required slots: crop_name, location
- Weather — required slots: location
- Disease identification — required slots: crop_name, symptoms
- Irrigation advice — required slots: crop_name, soil_type
- General farming advice

Respond in JSON FORMAT:
{{
  "intent": "<intent_code>",
  "response_text": "<English response>",
  "missing_slots": ["slot1", "slot2"],
  "collected_slots": {{"slot_name": "value"}},
  "is_complete": true/false,
  "action": null or "fetch_insurance|fetch_price|fetch_weather"
}}

Keep responses concise and farmer-friendly. Avoid technical jargon.""",
}

# ============================================================
# SLOT DEFINITIONS PER INTENT
# ============================================================

INTENT_SLOTS = {
    "insurance_inquiry": ["crop_type", "acreage", "location"],
    "crop_price":        ["crop_name", "location"],
    "weather":           ["location"],
    "disease_help":      ["crop_name", "symptoms"],
    "irrigation_advice": ["crop_name", "soil_type"],
    "general":           [],
}

# ============================================================
# SIMULATED SERVICE CALLS (replace with real DB queries)
# ============================================================

def fetch_insurance_plans(crop_type: str, acreage: str, location: str, language: str = "hi") -> str:
    """Fetch insurance plans from KrishiConnect database."""
    # In production: call Node.js API or query PostgreSQL directly
    plans = {
        "mr": f"""**{crop_type}** पिकासाठी {location} मध्ये उपलब्ध विमा योजना:
🌾 **PMFBY (प्रधानमंत्री फसल बीमा योजना)**
   - प्रीमियम: खरीप पिकांसाठी 2%, रब्बी पिकांसाठी 1.5%
   - संरक्षण: ₹{int(acreage or 1) * 25000:,} पर्यंत
   - नोंदणी: नजीकचे बँक किंवा CSC केंद्र

🌿 **RWBCIS (पुनर्रचित हवामान आधारित पीक विमा)**
   - हवामानावर आधारित विमा
   - प्रीमियम: ₹{int(acreage or 1) * 800:,} प्रति एकर

📞 हेल्पलाइन: 1800-180-1551""",

        "hi": f"""**{crop_type}** के लिए {location} में उपलब्ध बीमा योजनाएं:
🌾 **PMFBY (प्रधानमंत्री फसल बीमा योजना)**
   - प्रीमियम: खरीफ 2%, रबी 1.5%
   - कवरेज: ₹{int(acreage or 1) * 25000:,} तक
   - पंजीकरण: नजदीकी बैंक या CSC केंद्र

🌿 **RWBCIS (मौसम आधारित फसल बीमा)**
   - मौसम परिवर्तन से सुरक्षा
   - प्रीमियम: ₹{int(acreage or 1) * 800:,} प्रति एकड़

📞 हेल्पलाइन: 1800-180-1551""",

        "en": f"""**{crop_type}** insurance plans available in **{location}**:
🌾 **PMFBY (Pradhan Mantri Fasal Bima Yojana)**
   - Premium: 2% for Kharif, 1.5% for Rabi crops
   - Coverage: up to ₹{int(acreage or 1) * 25000:,}
   - Register at nearest bank or CSC center

🌿 **RWBCIS (Weather-Based Crop Insurance)**
   - Protection against weather fluctuations
   - Premium: ₹{int(acreage or 1) * 800:,} per acre

📞 Helpline: 1800-180-1551""",
    }
    return plans.get(language, plans["en"])


def fetch_crop_prices(crop_name: str, location: str, language: str = "hi") -> str:
    """Fetch MSP and market prices."""
    prices = {
        "mr": f"""**{crop_name}** चे बाजारभाव — {location}:
📊 **आजचा MSP (किमान आधार मूल्य)**: ₹2,183/क्विंटल
📈 **आजचा बाजारभाव**: ₹2,050–₹2,350/क्विंटल
📍 **जवळचे बाजार**: पुणे APMC, नाशिक APMC
💡 स्रोत: agmarknet.gov.in""",
        "hi": f"""**{crop_name}** के बाजार भाव — {location}:
📊 **आज का MSP (न्यूनतम समर्थन मूल्य)**: ₹2,183/क्विंटल
📈 **आज का बाजार भाव**: ₹2,050–₹2,350/क्विंटल
📍 **नजदीकी मंडी**: agmarknet.gov.in देखें
💡 स्रोत: agmarknet.gov.in""",
        "en": f"""**{crop_name}** market prices — {location}:
📊 **Today's MSP**: ₹2,183/quintal
📈 **Market Rate**: ₹2,050–₹2,350/quintal
📍 **Nearest Mandi**: Check agmarknet.gov.in
💡 Source: agmarknet.gov.in""",
    }
    return prices.get(language, prices["en"])


def fetch_weather(location: str, language: str = "hi") -> str:
    """Fetch weather information."""
    weather = {
        "mr": f"""**{location}** हवामान अंदाज:
🌤️ आज: अंशतः ढगाळ, तापमान 28–34°C
🌧️ उद्या: हलका पाऊस शक्य, वारा 15 km/h
💧 आर्द्रता: 68%
⚠️ सूचना: पुढील 3 दिवस फवारणी टाळा
📡 स्रोत: IMD (India Meteorological Department)""",
        "hi": f"""{location} का मौसम पूर्वानुमान:
🌤️ आज: आंशिक बादल, तापमान 28–34°C
🌧️ कल: हल्की बारिश संभव, हवा 15 km/h
💧 नमी: 68%
⚠️ सलाह: अगले 3 दिन छिड़काव न करें
📡 स्रोत: IMD""",
        "en": f"""Weather forecast for **{location}**:
🌤️ Today: Partly cloudy, temp 28–34°C
🌧️ Tomorrow: Light rain expected, wind 15 km/h
💧 Humidity: 68%
⚠️ Advisory: Avoid spraying for next 3 days
📡 Source: IMD (India Meteorological Department)""",
    }
    return weather.get(language, weather["en"])


# ============================================================
# MAIN LLM SERVICE
# ============================================================

class VoiceAssistantLLM:
    def __init__(self):
        api_key_env = os.environ.get("GROQ_API_KEY")
        api_key = api_key_env.strip() if api_key_env else None
        if not api_key:
            raise ValueError("GROQ_API_KEY not set")
        self.llm = ChatGroq(
            api_key=api_key,
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=512,
        )
        # In-memory session store (use Redis in production)
        self._sessions: dict = {}

    def _get_session(self, session_id: str) -> dict:
        if session_id not in self._sessions:
            self._sessions[session_id] = {
                "history": [],
                "collected_slots": {},
                "current_intent": None,
                "language": "hi",
            }
        return self._sessions[session_id]

    def _build_messages(self, session: dict, user_text: str, language: str):
        system_prompt = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS["hi"])
        
        # Include collected slots context in system message
        slot_context = ""
        if session["collected_slots"]:
            slot_context = f"\n\nALREADY COLLECTED INFO: {json.dumps(session['collected_slots'], ensure_ascii=False)}"
        if session["current_intent"]:
            slot_context += f"\nCURRENT INTENT: {session['current_intent']}"
            remaining = [s for s in INTENT_SLOTS.get(session["current_intent"], [])
                         if s not in session["collected_slots"]]
            slot_context += f"\nSTILL NEED: {remaining}"

        messages = [SystemMessage(content=system_prompt + slot_context)]
        
        # Add conversation history (last 6 turns = 12 messages)
        for turn in session["history"][-6:]:
            messages.append(HumanMessage(content=turn["user"]))
            messages.append(AIMessage(content=turn["assistant"]))
        
        messages.append(HumanMessage(content=user_text))
        return messages

    def _parse_llm_response(self, raw: str) -> dict:
        """Extract JSON from LLM response text."""
        try:
            # Find JSON block
            start = raw.find("{")
            end = raw.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(raw[start:end])
        except json.JSONDecodeError:
            pass
        
        # Fallback if JSON parsing fails
        return {
            "intent": "general",
            "response_text": raw,
            "missing_slots": [],
            "collected_slots": {},
            "is_complete": True,
            "action": None,
        }

    def process_turn(self, session_id: str, user_text: str, language: str) -> dict:
        """
        Process one conversation turn.
        Returns full response dict including text, audio cues, state.
        """
        session = self._get_session(session_id)
        session["language"] = language

        messages = self._build_messages(session, user_text, language)
        
        try:
            response = self.llm.invoke(messages)
            parsed = self._parse_llm_response(response.content)
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            fallback_msgs = {
                "mr": "माफ करा, तात्पुरती अडचण आली. कृपया पुन्हा प्रयत्न करा.",
                "hi": "माफ करें, अस्थायी समस्या आई। कृपया दोबारा प्रयास करें।",
                "en": "Sorry, a temporary error occurred. Please try again.",
            }
            return {
                "intent": "error",
                "response_text": fallback_msgs.get(language, fallback_msgs["en"]),
                "missing_slots": [],
                "collected_slots": {},
                "is_complete": False,
                "action": None,
                "avatar_state": "idle",
            }

        # Update session with new slots
        new_slots = parsed.get("collected_slots", {})
        session["collected_slots"].update(new_slots)
        
        intent = parsed.get("intent", "general")
        session["current_intent"] = intent

        # Execute service action if all slots collected
        service_response = None
        if parsed.get("is_complete") and parsed.get("action"):
            action = parsed["action"]
            slots = session["collected_slots"]
            
            if action == "fetch_insurance":
                service_response = fetch_insurance_plans(
                    slots.get("crop_type", ""),
                    slots.get("acreage", "1"),
                    slots.get("location", ""),
                    language
                )
            elif action == "fetch_price":
                service_response = fetch_crop_prices(
                    slots.get("crop_name", ""),
                    slots.get("location", ""),
                    language
                )
            elif action == "fetch_weather":
                service_response = fetch_weather(
                    slots.get("location", ""),
                    language
                )

        final_text = service_response or parsed.get("response_text", "")

        # Save to history
        session["history"].append({
            "user": user_text,
            "assistant": json.dumps(parsed, ensure_ascii=False),
        })

        # Clear session slots if conversation completed
        if parsed.get("is_complete") and parsed.get("action"):
            session["collected_slots"] = {}
            session["current_intent"] = None

        return {
            "intent": intent,
            "response_text": final_text,
            "missing_slots": parsed.get("missing_slots", []),
            "collected_slots": session["collected_slots"],
            "is_complete": parsed.get("is_complete", False),
            "avatar_state": "speaking",
        }


# Singleton instance
_llm_service: Optional[VoiceAssistantLLM] = None

def get_llm_service() -> VoiceAssistantLLM:
    global _llm_service
    if _llm_service is None:
        _llm_service = VoiceAssistantLLM()
    return _llm_service
