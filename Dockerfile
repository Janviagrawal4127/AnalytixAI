# =====================================================================
# AnalytixAI FastAPI Backend — Production Dockerfile
# =====================================================================
# Stage 1: Build dependencies with uv
FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy dependency files first (layer cache optimization)
COPY pyproject.toml .
COPY uv.lock* ./

# Install all Python deps into /app/.venv
RUN uv venv /app/.venv && \
    /app/.venv/bin/pip install --no-cache-dir uv && \
    uv sync --no-dev

# =====================================================================
# Stage 2: Production runtime image
# =====================================================================
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY data/ ./data/

# Use venv python explicitly — avoids any PATH confusion on Render
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose port (Render uses $PORT env var — default 8000 locally)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/api/health || exit 1

# Use ABSOLUTE path to uvicorn — never relies on PATH resolution
# Render injects $PORT automatically; fallback to 8000 locally
CMD ["/bin/sh", "-c", "/app/.venv/bin/uvicorn backend.server:app --host 0.0.0.0 --port ${PORT:-8000}"]
