#!/bin/bash

DATE=$(date '+%Y-%m-%d')
BACKUP_DIR="$HOME/PRMS_2/db_backups"
LOG_FILE="$BACKUP_DIR/backup.log"

POSTGRES_CONTAINER="postgres-db"
DB_NAME="prms_db"
DB_USER="prms_user"
DB_PASSWORD="strong_password_here"

mkdir -p "$BACKUP_DIR"

{
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting PostgreSQL backup (SQL format)..."

    docker exec \
        -e PGPASSWORD="$DB_PASSWORD" \
        "$POSTGRES_CONTAINER" \
        pg_dump -U "$DB_USER" \
        --blobs \
        --verbose \
        "$DB_NAME" \
        > "$BACKUP_DIR/DB_backup_$DATE.sql"

    if [ $? -eq 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup completed successfully"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup FAILED"
    fi

    echo "--------------------------------------------------"
} >> "$LOG_FILE" 2>&1
