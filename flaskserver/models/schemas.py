"""
schemas.py — PostgreSQL table definitions and row helpers.

All nested / array data (soil_parameters, growth_stages, irrigation, etc.)
is stored as JSONB so the REST API response shape stays identical to the
old MongoDB implementation.
"""
from datetime import datetime
import json


# ── Helpers ────────────────────────────────────────────────────

def _to_date(val):
    """Coerce a string or datetime to a date string (YYYY-MM-DD)."""
    if val is None:
        return None
    if isinstance(val, datetime):
        return val.date().isoformat()
    # Accept ISO strings like "2025-06-15" or "2025-06-15T00:00:00Z"
    return str(val)[:10]


def _to_jsonb(val):
    """Ensure a value is JSON-serialisable (pass-through if already dict/list)."""
    if val is None:
        return None
    return val


# ── FieldMap ───────────────────────────────────────────────────

class FieldMapSchema:

    @staticmethod
    def to_insert(user_id, field_name, coordinates, area, soil_type, **kwargs):
        """Return (columns, values) ready for an INSERT … RETURNING *."""
        soil_parameters = {
            "nitrogen":      kwargs.get("nitrogen"),
            "phosphorus":    kwargs.get("phosphorus"),
            "potassium":     kwargs.get("potassium"),
            "ph":            kwargs.get("ph"),
            "organic_matter":kwargs.get("organic_matter"),
            "moisture":      kwargs.get("moisture"),
        }
        weather_data = {
            "average_temperature": kwargs.get("avg_temperature"),
            "annual_rainfall":     kwargs.get("annual_rainfall"),
            "humidity":            kwargs.get("humidity"),
        }
        return {
            "user_id":          user_id,
            "field_name":       field_name,
            "coordinates":      json.dumps(coordinates) if coordinates else None,
            "area":             area,
            "location":         kwargs.get("location"),
            "current_crop":     kwargs.get("current_crop"),
            "soil_type":        soil_type,
            "elevation":        kwargs.get("elevation"),
            "slope":            kwargs.get("slope"),
            "drainage":         kwargs.get("drainage"),
            "soil_parameters":  json.dumps(soil_parameters),
            "weather_data":     json.dumps(weather_data),
            "status":           "active",
        }

    @staticmethod
    def to_update(**kwargs):
        """Build a partial update dict (only provided keys)."""
        updatable = [
            "field_name", "coordinates", "area", "location",
            "current_crop", "soil_type", "status",
        ]
        updates = {}
        for key in updatable:
            if key in kwargs:
                val = kwargs[key]
                updates[key] = json.dumps(val) if key == "coordinates" else val

        # Soil parameters — caller passes individual keys
        soil_params = {}
        for param in ["nitrogen", "phosphorus", "potassium", "ph", "organic_matter", "moisture"]:
            if param in kwargs:
                soil_params[param] = kwargs[param]
        if soil_params:
            updates["_soil_params_patch"] = soil_params  # handled in service

        # Weather data
        weather_params = {}
        mapping = {"avg_temperature": "average_temperature", "annual_rainfall": "annual_rainfall", "humidity": "humidity"}
        for src, dst in mapping.items():
            if src in kwargs:
                weather_params[dst] = kwargs[src]
        if weather_params:
            updates["_weather_patch"] = weather_params   # handled in service

        return updates


# ── CropLifecycle ──────────────────────────────────────────────

class CropLifecycleSchema:

    @staticmethod
    def to_insert(user_id, field_id, crop_name, sowing_date, **kwargs):
        sowing_parameters = {
            "nitrogen":     kwargs.get("nitrogen"),
            "phosphorus":   kwargs.get("phosphorus"),
            "potassium":    kwargs.get("potassium"),
            "ph":           kwargs.get("ph"),
            "temperature":  kwargs.get("temperature"),
            "humidity":     kwargs.get("humidity"),
            "rainfall":     kwargs.get("rainfall"),
            "soil_moisture":kwargs.get("soil_moisture"),
        }
        irrigation = {
            "schedule":          kwargs.get("irrigation_schedule", []),
            "total_water_used":  kwargs.get("total_irrigation", 0),
            "irrigation_method": kwargs.get("irrigation_method", "manual"),
        }
        fertilizer = {
            "schedule":         kwargs.get("fertilizer_schedule", []),
            "total_nitrogen":   kwargs.get("total_nitrogen", 0),
            "total_phosphorus": kwargs.get("total_phosphorus", 0),
            "total_potassium":  kwargs.get("total_potassium", 0),
        }
        return {
            "user_id":               user_id,
            "field_id":              field_id,
            "crop_name":             crop_name,
            "crop_variety":          kwargs.get("crop_variety"),
            "sowing_date":           _to_date(sowing_date),
            "expected_harvest_date": _to_date(kwargs.get("expected_harvest_date")),
            "actual_harvest_date":   _to_date(kwargs.get("actual_harvest_date")),
            "sowing_parameters":     json.dumps(sowing_parameters),
            "growth_stages":         json.dumps(kwargs.get("growth_stages", [])),
            "irrigation":            json.dumps(irrigation),
            "fertilizer":            json.dumps(fertilizer),
            "weather_history":       json.dumps(kwargs.get("weather_history", [])),
            "observations":          json.dumps(kwargs.get("observations", [])),
            "diseases":              json.dumps(kwargs.get("diseases", [])),
            "pests":                 json.dumps(kwargs.get("pests", [])),
            "current_stage":         kwargs.get("current_stage", "seeded"),
            "status":                kwargs.get("status", "active"),
        }

    @staticmethod
    def make_growth_stage(stage_name, start_date, end_date=None, **kwargs):
        return {
            "stage_name":   stage_name,
            "start_date":   _to_date(start_date) or datetime.utcnow().date().isoformat(),
            "end_date":     _to_date(end_date),
            "duration_days":kwargs.get("duration_days"),
            "kc_value":     kwargs.get("kc_value"),
            "notes":        kwargs.get("notes"),
        }

    @staticmethod
    def make_irrigation_record(date, amount, method="manual", **kwargs):
        return {
            "date":        _to_date(date),
            "amount_mm":   amount,
            "method":      method,
            "notes":       kwargs.get("notes"),
            "recorded_at": datetime.utcnow().isoformat(),
        }

    @staticmethod
    def make_fertilizer_record(date, nutrient_type, amount, application_method, **kwargs):
        return {
            "date":               _to_date(date),
            "nutrient_type":      nutrient_type,
            "amount_kg_per_ha":   amount,
            "application_method": application_method,
            "fertilizer_name":    kwargs.get("fertilizer_name"),
            "notes":              kwargs.get("notes"),
            "recorded_at":        datetime.utcnow().isoformat(),
        }


# ── YieldPrediction ────────────────────────────────────────────

class YieldPredictionSchema:

    @staticmethod
    def to_insert(user_id, field_id, crop_lifecycle_id, **kwargs):
        prediction_parameters = {
            "crop_name":            kwargs.get("crop_name"),
            "field_area":           kwargs.get("field_area"),
            "sowing_date":          _to_date(kwargs.get("sowing_date")),
            "current_stage":        kwargs.get("current_stage"),
            "days_after_sowing":    kwargs.get("days_after_sowing"),
            "soil_nitrogen":        kwargs.get("nitrogen"),
            "soil_phosphorus":      kwargs.get("phosphorus"),
            "soil_potassium":       kwargs.get("potassium"),
            "soil_ph":              kwargs.get("ph"),
            "soil_moisture":        kwargs.get("soil_moisture"),
            "temperature":          kwargs.get("temperature"),
            "humidity":             kwargs.get("humidity"),
            "rainfall":             kwargs.get("rainfall"),
            "irrigation_total":     kwargs.get("irrigation_total"),
            "fertilizer_applied":   kwargs.get("fertilizer_applied"),
            "pest_disease_pressure":kwargs.get("pest_disease_pressure", "low"),
        }
        predictions = {
            "expected_yield_per_hectare": kwargs.get("expected_yield"),
            "total_expected_yield":       kwargs.get("total_yield"),
            "yield_quality_grade":        kwargs.get("quality_grade"),
            "harvest_date_prediction":    _to_date(kwargs.get("predicted_harvest_date")),
            "confidence_score":           kwargs.get("confidence_score"),
            "risk_factors":               kwargs.get("risk_factors", []),
            "recommendations":            kwargs.get("recommendations", []),
        }
        model_info = {
            "model_version":       kwargs.get("model_version", "1.0"),
            "prediction_method":   kwargs.get("prediction_method", "ml_model"),
            "input_features_used": kwargs.get("features_used", []),
        }
        return {
            "user_id":               user_id,
            "field_id":              field_id,
            "crop_lifecycle_id":     str(crop_lifecycle_id) if crop_lifecycle_id else None,
            "prediction_parameters": json.dumps(prediction_parameters),
            "predictions":           json.dumps(predictions),
            "model_info":            json.dumps(model_info),
            "actual_results":        json.dumps({}),
            "status":                kwargs.get("status", "pending"),
        }


# ── UserSession ────────────────────────────────────────────────

class UserSessionSchema:

    @staticmethod
    def to_insert(session_id, ip_address, **kwargs):
        return {
            "session_id": session_id,
            "ip_address": ip_address,
            "user_agent": kwargs.get("user_agent"),
            "location":   kwargs.get("location"),
            "preferences":json.dumps(kwargs.get("preferences", {})),
        }