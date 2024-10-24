FROM python:3.12-slim AS base

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cu118

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "app:app", "-k", "uvicorn.workers.UvicornWorker", "--workers", "4", "--bind", "0.0.0.0:8000"]
