# Use an official Python runtime as a parent image
# Python 3.11 is slim enough and modern for your ML requirements
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

# Install system dependencies required for ML frameworks (scikit-learn, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirement.txt .

# Install Python dependencies
# Using --no-cache-dir keeps the image smaller
RUN pip install --no-cache-dir -r requirement.txt

# Create a non-root user for security (optional but recommended for production)
RUN useradd -m myuser
USER myuser

# Copy the rest of the application code
COPY --chown=myuser:myuser . .

# Expose port (Matches Gunicorn bound port)
EXPOSE 5000

# Run Gunicorn with threading since the Flask app utilizes Flask-Sock for WebSockets
# 1 worker with 50 threads handles WebSockets and HTTP routes perfectly for grob-whisper setups
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "50", "app:app"]
