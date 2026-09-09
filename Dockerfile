# =====================================================================
# AnalytixAI FastAPI Backend — Production Dockerfile
# =====================================================================
# Stage 1: Build dependencies with uv
FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv (fast Python package manager)
RUN pip install --no-cache-dir uv

# Copy dependency files first (layer cache optimization)
COPY pyproject.toml .
COPY uv.lock* ./

# Install all Python deps into /app/.venv
RUN uv venv && uv sync --no-dev

# =====================================================================
# Stage 2: Production runtime image
# =====================================================================
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY data/ ./data/

# Ensure .venv python is used
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose FastAPI port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Start FastAPI with uvicorn
CMD ["python", "-m", "uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
