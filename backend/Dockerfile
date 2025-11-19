# FROM python:3.10-slim
FROM public.ecr.aws/docker/library/python:3.10-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY backend/ .

EXPOSE 8000

CMD python manage.py collectstatic --noinput && gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
