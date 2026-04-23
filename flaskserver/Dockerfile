# ──────────────────────────────────────────────
# Krishi Connect – Flask Server
# Python 3.11-slim keeps the image lean while
# supporting all ML / voice-assistant deps.
# ──────────────────────────────────────────────
FROM python:3.11-slim

# Prevent .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    PORT=5002

WORKDIR /app

# Install OS-level build deps needed by scikit-learn / numpy
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# ── Install Python deps BEFORE copying code so Docker
#    can cache this layer when only code changes ──────
COPY requirement.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirement.txt

# ── Copy application source ─────────────────────────
COPY . .

# Create a non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose the Flask/Gunicorn port
EXPOSE 5002

# Gunicorn: 1 worker + 50 threads works well with
# flask-sock WebSockets (gevent is NOT needed here)
CMD ["gunicorn", \
     "--bind", "0.0.0.0:5002", \
     "--workers", "1", \
     "--threads", "50", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "app:app"]
