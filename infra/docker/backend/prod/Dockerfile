FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
RUN chmod +x /app/backend/entrypoint.prod.sh

EXPOSE 8000

CMD ["/app/backend/entrypoint.prod.sh"]
