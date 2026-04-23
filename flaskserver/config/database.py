import psycopg2
import psycopg2.pool
import psycopg2.extras
import os
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "")

# ── SQL to create all tables on startup ────────────────────────
INIT_SQL = """
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS field_maps (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT NOT NULL,
    field_name  TEXT NOT NULL,
    coordinates JSONB,
    area        FLOAT,
    location    TEXT,
    current_crop TEXT,
    soil_type   TEXT,
    elevation   FLOAT,
    slope       FLOAT,
    drainage    TEXT,
    soil_parameters JSONB DEFAULT '{}'::jsonb,
    weather_data    JSONB DEFAULT '{}'::jsonb,
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_lifecycles (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              TEXT NOT NULL,
    field_id             UUID REFERENCES field_maps(id) ON DELETE SET NULL,
    crop_name            TEXT NOT NULL,
    crop_variety         TEXT,
    sowing_date          DATE,
    expected_harvest_date DATE,
    actual_harvest_date  DATE,
    sowing_parameters    JSONB DEFAULT '{}'::jsonb,
    growth_stages        JSONB DEFAULT '[]'::jsonb,
    irrigation           JSONB DEFAULT '{}'::jsonb,
    fertilizer           JSONB DEFAULT '{}'::jsonb,
    weather_history      JSONB DEFAULT '[]'::jsonb,
    observations         JSONB DEFAULT '[]'::jsonb,
    diseases             JSONB DEFAULT '[]'::jsonb,
    pests                JSONB DEFAULT '[]'::jsonb,
    current_stage        TEXT DEFAULT 'seeded',
    status               TEXT DEFAULT 'active',
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS yield_predictions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               TEXT NOT NULL,
    field_id              UUID REFERENCES field_maps(id) ON DELETE SET NULL,
    crop_lifecycle_id     TEXT,
    prediction_parameters JSONB DEFAULT '{}'::jsonb,
    predictions           JSONB DEFAULT '{}'::jsonb,
    model_info            JSONB DEFAULT '{}'::jsonb,
    actual_results        JSONB DEFAULT '{}'::jsonb,
    prediction_date       TIMESTAMPTZ DEFAULT NOW(),
    status                TEXT DEFAULT 'pending',
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id       TEXT UNIQUE NOT NULL,
    ip_address       TEXT NOT NULL,
    user_agent       TEXT,
    location         TEXT,
    preferences      JSONB DEFAULT '{}'::jsonb,
    fields_count     INT DEFAULT 0,
    crops_count      INT DEFAULT 0,
    predictions_count INT DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    last_active      TIMESTAMPTZ DEFAULT NOW()
);
"""

# ── Connection pool ────────────────────────────────────────────
_pool = None


def _create_pool():
    global _pool
    _pool = psycopg2.pool.SimpleConnectionPool(
        minconn=1,
        maxconn=10,
        dsn=DATABASE_URL,
    )


def get_conn():
    """Borrow a connection from the pool."""
    if _pool is None:
        raise RuntimeError("Database pool not initialised")
    return _pool.getconn()


def release_conn(conn):
    """Return a connection to the pool."""
    if _pool and conn:
        _pool.putconn(conn)


def init_database():
    """Connect to Neon PostgreSQL and create tables if they don't exist."""
    global _pool
    if not DATABASE_URL or "YOUR_HOST" in DATABASE_URL:
        print("⚠️  DATABASE_URL not configured. Set it in .env to enable DB features.")
        return False
    try:
        _create_pool()
        conn = get_conn()
        try:
            with conn.cursor() as cur:
                cur.execute(INIT_SQL)
            conn.commit()
            print("✅ Connected to PostgreSQL (Neon)")
            print("✅ Tables initialised")
            return True
        finally:
            release_conn(conn)
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL: {str(e)[:200]}")
        print("   Server will continue without database features")
        _pool = None
        return False


# ── Serialisation helper ───────────────────────────────────────
def serialize_row(row):
    """Convert a psycopg2 RealDictRow / dict to a JSON-safe dict."""
    if row is None:
        return None
    if isinstance(row, list):
        return [serialize_row(r) for r in row]
    out = {}
    for k, v in dict(row).items():
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out