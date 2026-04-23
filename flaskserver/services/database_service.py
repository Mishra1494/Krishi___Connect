"""
database_service.py — PostgreSQL service layer (Neon DB).

All MongoDB collection operations have been replaced with raw SQL via psycopg2.
JSONB columns are used for nested / array data so the REST API response shape
stays identical to the old MongoDB implementation.
"""
import uuid
import json
from datetime import datetime

import psycopg2.extras

from config.database import get_conn, release_conn, serialize_row
from models.schemas import (
    FieldMapSchema,
    CropLifecycleSchema,
    YieldPredictionSchema,
    UserSessionSchema,
)


# ── Helpers ────────────────────────────────────────────────────

def _exec(sql, params=None, fetch="none"):
    """
    Run a SQL statement and optionally return rows.
    fetch: "one" | "all" | "none"
    Always uses RealDictCursor so rows come back as dicts.
    """
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params)
            conn.commit()
            if fetch == "one":
                return cur.fetchone()
            if fetch == "all":
                return cur.fetchall()
    finally:
        release_conn(conn)


def _insert(table, data):
    """Build and run an INSERT … RETURNING * from a dict."""
    cols = list(data.keys())
    placeholders = ["%s"] * len(cols)
    values = [data[c] for c in cols]
    sql = (
        f"INSERT INTO {table} ({', '.join(cols)}) "
        f"VALUES ({', '.join(placeholders)}) RETURNING *"
    )
    return _exec(sql, values, fetch="one")


# ── FieldMap ───────────────────────────────────────────────────

class FieldMapService:

    def create_field_map(self, user_id, field_data):
        try:
            row = FieldMapSchema.to_insert(
                user_id=user_id,
                field_name=field_data.get("field_name"),
                coordinates=field_data.get("coordinates"),
                area=field_data.get("area"),
                soil_type=field_data.get("soil_type"),
                location=field_data.get("location"),
                current_crop=field_data.get("current_crop"),
                elevation=field_data.get("elevation"),
                slope=field_data.get("slope"),
                drainage=field_data.get("drainage"),
                nitrogen=field_data.get("nitrogen"),
                phosphorus=field_data.get("phosphorus"),
                potassium=field_data.get("potassium"),
                ph=field_data.get("ph"),
                organic_matter=field_data.get("organic_matter"),
                moisture=field_data.get("moisture"),
                avg_temperature=field_data.get("avg_temperature"),
                annual_rainfall=field_data.get("annual_rainfall"),
                humidity=field_data.get("humidity"),
            )
            result = _insert("field_maps", row)
            return serialize_row(result)
        except Exception as e:
            raise Exception(f"Error creating field map: {e}")

    def get_field_maps_by_user(self, user_id, limit=50):
        try:
            rows = _exec(
                "SELECT * FROM field_maps WHERE user_id = %s AND status = 'active' "
                "ORDER BY created_at DESC LIMIT %s",
                (user_id, limit),
                fetch="all",
            )
            return serialize_row(list(rows or []))
        except Exception as e:
            raise Exception(f"Error fetching field maps: {e}")

    def get_field_map_by_id(self, field_id):
        try:
            row = _exec(
                "SELECT * FROM field_maps WHERE id = %s",
                (field_id,),
                fetch="one",
            )
            return serialize_row(row)
        except Exception as e:
            raise Exception(f"Error fetching field map: {e}")

    def update_field_map(self, field_id, update_data):
        try:
            updates = FieldMapSchema.to_update(**update_data)

            # Pull out JSONB patch helpers before building SET clause
            soil_patch = updates.pop("_soil_params_patch", None)
            weather_patch = updates.pop("_weather_patch", None)

            set_clauses = []
            values = []

            for col, val in updates.items():
                set_clauses.append(f"{col} = %s")
                values.append(val)

            # Merge JSONB patches using PostgreSQL ||
            if soil_patch:
                set_clauses.append("soil_parameters = soil_parameters || %s::jsonb")
                values.append(json.dumps(soil_patch))
            if weather_patch:
                set_clauses.append("weather_data = weather_data || %s::jsonb")
                values.append(json.dumps(weather_patch))

            set_clauses.append("updated_at = NOW()")
            values.append(field_id)

            sql = (
                f"UPDATE field_maps SET {', '.join(set_clauses)} "
                f"WHERE id = %s RETURNING *"
            )
            row = _exec(sql, values, fetch="one")
            return serialize_row(row)
        except Exception as e:
            raise Exception(f"Error updating field map: {e}")

    def delete_field_map(self, field_id):
        """Soft delete."""
        try:
            row = _exec(
                "UPDATE field_maps SET status = 'deleted', updated_at = NOW() "
                "WHERE id = %s RETURNING id",
                (field_id,),
                fetch="one",
            )
            return row is not None
        except Exception as e:
            raise Exception(f"Error deleting field map: {e}")


# ── CropLifecycle ──────────────────────────────────────────────

class CropLifecycleService:

    def create_crop_lifecycle(self, user_id, lifecycle_data):
        try:
            row = CropLifecycleSchema.to_insert(
                user_id=user_id,
                field_id=lifecycle_data.get("field_id"),
                crop_name=lifecycle_data.get("crop_name"),
                sowing_date=lifecycle_data.get("sowing_date"),
                crop_variety=lifecycle_data.get("crop_variety"),
                expected_harvest_date=lifecycle_data.get("expected_harvest_date"),
                nitrogen=lifecycle_data.get("nitrogen"),
                phosphorus=lifecycle_data.get("phosphorus"),
                potassium=lifecycle_data.get("potassium"),
                ph=lifecycle_data.get("ph"),
                temperature=lifecycle_data.get("temperature"),
                humidity=lifecycle_data.get("humidity"),
                rainfall=lifecycle_data.get("rainfall"),
                soil_moisture=lifecycle_data.get("soil_moisture"),
                growth_stages=lifecycle_data.get("growth_stages", []),
                irrigation_schedule=lifecycle_data.get("irrigation_schedule", []),
                fertilizer_schedule=lifecycle_data.get("fertilizer_schedule", []),
                total_irrigation=lifecycle_data.get("total_irrigation", 0),
                irrigation_method=lifecycle_data.get("irrigation_method", "manual"),
            )
            result = _insert("crop_lifecycles", row)
            return serialize_row(result)
        except Exception as e:
            raise Exception(f"Error creating crop lifecycle: {e}")

    def get_crop_lifecycles_by_user(self, user_id, limit=50):
        try:
            rows = _exec(
                "SELECT * FROM crop_lifecycles WHERE user_id = %s "
                "ORDER BY created_at DESC LIMIT %s",
                (user_id, limit),
                fetch="all",
            )
            return serialize_row(list(rows or []))
        except Exception as e:
            raise Exception(f"Error fetching crop lifecycles: {e}")

    def get_crop_lifecycle_by_id(self, lifecycle_id):
        try:
            row = _exec(
                "SELECT * FROM crop_lifecycles WHERE id = %s",
                (lifecycle_id,),
                fetch="one",
            )
            return serialize_row(row)
        except Exception as e:
            raise Exception(f"Error fetching crop lifecycle: {e}")

    def get_crop_lifecycles_by_field(self, field_id):
        try:
            rows = _exec(
                "SELECT * FROM crop_lifecycles WHERE field_id = %s "
                "ORDER BY sowing_date DESC",
                (field_id,),
                fetch="all",
            )
            return serialize_row(list(rows or []))
        except Exception as e:
            raise Exception(f"Error fetching field crop lifecycles: {e}")

    def update_crop_stage(self, lifecycle_id, stage_name, **stage_data):
        try:
            new_stage = CropLifecycleSchema.make_growth_stage(
                stage_name=stage_name,
                start_date=stage_data.get("start_date", datetime.utcnow()),
                end_date=stage_data.get("end_date"),
                duration_days=stage_data.get("duration_days"),
                kc_value=stage_data.get("kc_value"),
                notes=stage_data.get("notes"),
            )
            row = _exec(
                "UPDATE crop_lifecycles "
                "SET growth_stages = growth_stages || %s::jsonb, "
                "    current_stage = %s, "
                "    updated_at = NOW() "
                "WHERE id = %s RETURNING id",
                (json.dumps([new_stage]), stage_name, lifecycle_id),
                fetch="one",
            )
            return row is not None
        except Exception as e:
            raise Exception(f"Error updating crop stage: {e}")

    def add_irrigation_record(self, lifecycle_id, irrigation_data):
        try:
            record = CropLifecycleSchema.make_irrigation_record(
                date=irrigation_data.get("date"),
                amount=irrigation_data.get("amount"),
                method=irrigation_data.get("method", "manual"),
                notes=irrigation_data.get("notes"),
            )
            amount = float(irrigation_data.get("amount", 0))
            row = _exec(
                "UPDATE crop_lifecycles "
                "SET irrigation = jsonb_set("
                "      jsonb_set(irrigation, '{schedule}', "
                "        (irrigation->'schedule') || %s::jsonb), "
                "      '{total_water_used}', "
                "      to_jsonb((COALESCE((irrigation->>'total_water_used')::float, 0) + %s))), "
                "    updated_at = NOW() "
                "WHERE id = %s RETURNING id",
                (json.dumps([record]), amount, lifecycle_id),
                fetch="one",
            )
            return row is not None
        except Exception as e:
            raise Exception(f"Error adding irrigation record: {e}")

    def add_fertilizer_record(self, lifecycle_id, fertilizer_data):
        try:
            record = CropLifecycleSchema.make_fertilizer_record(
                date=fertilizer_data.get("date"),
                nutrient_type=fertilizer_data.get("nutrient_type"),
                amount=fertilizer_data.get("amount"),
                application_method=fertilizer_data.get("application_method"),
                fertilizer_name=fertilizer_data.get("fertilizer_name"),
                notes=fertilizer_data.get("notes"),
            )
            nutrient = fertilizer_data.get("nutrient_type", "").upper()
            amount = float(fertilizer_data.get("amount", 0))
            nutrient_field = {
                "N": "total_nitrogen",
                "P": "total_phosphorus",
                "K": "total_potassium",
            }.get(nutrient)

            if nutrient_field:
                sql = (
                    "UPDATE crop_lifecycles "
                    "SET fertilizer = jsonb_set("
                    "      jsonb_set(fertilizer, '{schedule}', "
                    "        (fertilizer->'schedule') || %s::jsonb), "
                    f"     '{{{nutrient_field}}}', "
                    f"     to_jsonb((COALESCE((fertilizer->>'{nutrient_field}')::float, 0) + %s))), "
                    "    updated_at = NOW() "
                    "WHERE id = %s RETURNING id"
                )
                row = _exec(sql, (json.dumps([record]), amount, lifecycle_id), fetch="one")
            else:
                row = _exec(
                    "UPDATE crop_lifecycles "
                    "SET fertilizer = jsonb_set(fertilizer, '{schedule}', "
                    "      (fertilizer->'schedule') || %s::jsonb), "
                    "    updated_at = NOW() "
                    "WHERE id = %s RETURNING id",
                    (json.dumps([record]), lifecycle_id),
                    fetch="one",
                )
            return row is not None
        except Exception as e:
            raise Exception(f"Error adding fertilizer record: {e}")


# ── YieldPrediction ────────────────────────────────────────────

class YieldPredictionService:

    def create_yield_prediction(self, user_id, prediction_data):
        try:
            row = YieldPredictionSchema.to_insert(
                user_id=user_id,
                field_id=prediction_data.get("field_id"),
                crop_lifecycle_id=prediction_data.get("crop_lifecycle_id"),
                crop_name=prediction_data.get("crop_name"),
                field_area=prediction_data.get("field_area"),
                sowing_date=prediction_data.get("sowing_date"),
                current_stage=prediction_data.get("current_stage"),
                days_after_sowing=prediction_data.get("days_after_sowing"),
                nitrogen=prediction_data.get("nitrogen"),
                phosphorus=prediction_data.get("phosphorus"),
                potassium=prediction_data.get("potassium"),
                ph=prediction_data.get("ph"),
                soil_moisture=prediction_data.get("soil_moisture"),
                temperature=prediction_data.get("temperature"),
                humidity=prediction_data.get("humidity"),
                rainfall=prediction_data.get("rainfall"),
                irrigation_total=prediction_data.get("irrigation_total"),
                fertilizer_applied=prediction_data.get("fertilizer_applied"),
                pest_disease_pressure=prediction_data.get("pest_disease_pressure", "low"),
                expected_yield=prediction_data.get("expected_yield"),
                total_yield=prediction_data.get("total_yield"),
                quality_grade=prediction_data.get("quality_grade"),
                predicted_harvest_date=prediction_data.get("predicted_harvest_date"),
                confidence_score=prediction_data.get("confidence_score"),
                risk_factors=prediction_data.get("risk_factors", []),
                recommendations=prediction_data.get("recommendations", []),
                model_version=prediction_data.get("model_version", "1.0"),
                prediction_method=prediction_data.get("prediction_method", "ml_model"),
                features_used=prediction_data.get("features_used", []),
            )
            result = _insert("yield_predictions", row)
            return serialize_row(result)
        except Exception as e:
            raise Exception(f"Error creating yield prediction: {e}")

    def get_yield_predictions_by_user(self, user_id, limit=50):
        try:
            rows = _exec(
                "SELECT * FROM yield_predictions WHERE user_id = %s "
                "ORDER BY prediction_date DESC LIMIT %s",
                (user_id, limit),
                fetch="all",
            )
            return serialize_row(list(rows or []))
        except Exception as e:
            raise Exception(f"Error fetching yield predictions: {e}")

    def get_yield_prediction_by_id(self, prediction_id):
        try:
            row = _exec(
                "SELECT * FROM yield_predictions WHERE id = %s",
                (prediction_id,),
                fetch="one",
            )
            return serialize_row(row)
        except Exception as e:
            raise Exception(f"Error fetching yield prediction: {e}")

    def update_actual_results(self, prediction_id, actual_yield, actual_harvest_date, quality_achieved):
        try:
            actual = {
                "actual_yield":         actual_yield,
                "actual_harvest_date":  str(actual_harvest_date)[:10] if actual_harvest_date else None,
                "quality_achieved":     quality_achieved,
            }
            row = _exec(
                "UPDATE yield_predictions "
                "SET actual_results = actual_results || %s::jsonb, "
                "    status = 'completed', updated_at = NOW() "
                "WHERE id = %s RETURNING id",
                (json.dumps(actual), prediction_id),
                fetch="one",
            )
            return row is not None
        except Exception as e:
            raise Exception(f"Error updating actual results: {e}")


# ── UserSession ────────────────────────────────────────────────

class UserSessionService:

    def create_or_get_session(self, ip_address, user_agent=None):
        try:
            # Try existing session for this IP
            row = _exec(
                "SELECT * FROM user_sessions WHERE ip_address = %s LIMIT 1",
                (ip_address,),
                fetch="one",
            )
            if row:
                _exec(
                    "UPDATE user_sessions SET last_active = NOW() WHERE id = %s",
                    (row["id"],),
                )
                return serialize_row(row)

            # Create new session
            session_id = str(uuid.uuid4())
            data = UserSessionSchema.to_insert(
                session_id=session_id,
                ip_address=ip_address,
                user_agent=user_agent,
            )
            result = _insert("user_sessions", data)
            return serialize_row(result)
        except Exception as e:
            raise Exception(f"Error managing user session: {e}")

    def update_session_stats(self, session_id, stat_type):
        try:
            col = f"{stat_type}_count"
            allowed = {"fields_count", "crops_count", "predictions_count"}
            if col not in allowed:
                return False
            row = _exec(
                f"UPDATE user_sessions SET {col} = {col} + 1, last_active = NOW() "
                f"WHERE session_id = %s RETURNING id",
                (session_id,),
                fetch="one",
            )
            return row is not None
        except Exception as e:
            raise Exception(f"Error updating session stats: {e}")


# ── Utility ────────────────────────────────────────────────────

def get_user_session_id(request):
    """Get or create user session ID from request."""
    try:
        ip_address = (
            request.environ.get("HTTP_X_FORWARDED_FOR")
            or request.remote_addr
            or "unknown"
        )
        user_agent = request.headers.get("User-Agent")
        session_service = UserSessionService()
        session = session_service.create_or_get_session(ip_address, user_agent)
        return session.get("session_id")
    except Exception:
        return request.remote_addr or "anonymous"