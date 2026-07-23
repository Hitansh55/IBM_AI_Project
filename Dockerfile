# Build Backend & Serve Pre-built Frontend
FROM python:3.9-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy pre-built frontend directly (it will be included in the zip)
COPY frontend/dist/ ./dist/

# Expose port
EXPOSE 8000

# Start FastAPI
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips="*"
