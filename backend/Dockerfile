# backend/Dockerfile
FROM python:3.10-slim

# Prevent Python from writing pyc files and buffering output
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Install system dependencies required for psycopg2 and LibreOffice
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libreoffice \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies and install Python packages
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the Django project
COPY . /app

# Expose port 8000
EXPOSE 8000

# Command to run the app
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
