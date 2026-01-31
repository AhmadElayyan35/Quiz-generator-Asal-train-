# Stage 1: install Python dependencies only
FROM python:3.13-slim AS builder

WORKDIR /app

# Copy only the requirements.txt from backend, so Docker can cache this layer
COPY requirements.txt .

# Upgrade pip and install Python packages (including pyodbc)
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt


# Stage 2: install system libraries + copy app code
FROM python:3.13-slim

WORKDIR /app

# 1) Install basic utilities (curl, gnupg2, lsb-release, apt-transport-https)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       curl \
       gnupg2 \
       lsb-release \
       apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

# 2) Add Microsoft’s GPG key and repository for Debian 12 (Bookworm)
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && echo "deb [arch=amd64] https://packages.microsoft.com/debian/12/prod bookworm main" \
       > /etc/apt/sources.list.d/mssql-release.list

# 3) Update and install msodbcsql18 (accept EULA automatically)
RUN apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
       msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

# 4) Copy installed Python packages from builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 5) Copy your FastAPI code so that /app/app is the root package
COPY app ./app

# 6) Expose port 8000 for FastAPI
EXPOSE 8000

# 7) Launch Uvicorn pointing at app/main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
