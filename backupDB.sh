#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

############################
# CONFIG
############################
DB_CONTAINER="postgres-db"
DJANGO_CONTAINER="django-backend"

DB_NAME="${DB_NAME:-prms_db}"
DB_USER="${DB_USER:-prms_user}"
DB_PASSWORD="${DB_PASSWORD:-strong_password_here}"

BACKUP_DIR="/mnt/data-disk/PRMS_2_backups"
MEDIA_PATH="/app/media"

RETENTION_DAYS=7

DATE="$(date +"%Y-%m-%d_%H-%M-%S")"
FINAL_BACKUP="$BACKUP_DIR/backup_$DATE.tar.gz"
WORKDIR="/tmp/prms_backup_$DATE"

LOCK_FILE="/tmp/backup.lock"

############################
# SAFETY LOCK
############################
exec 200>"$LOCK_FILE"
flock -n 200 || {
  echo "Backup already running. Exiting."
  exit 1
}

############################
# INIT
############################
mkdir -p "$BACKUP_DIR"
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"

LOG_FILE="$WORKDIR/backup.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=================================================="
echo "Backup started at: $(date)"
echo "=================================================="

cleanup() {
  echo "[ERROR] Backup failed. Cleaning up..."
  rm -rf "$WORKDIR"
}
trap cleanup ERR

############################
# 1. POSTGRES BACKUP
############################
echo "[1/3] Dumping PostgreSQL database..."

export PGPASSWORD="$DB_PASSWORD"

docker exec "$DB_CONTAINER" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" \
  --format=custom \
  --blobs \
  > "$WORKDIR/db.dump"

gzip "$WORKDIR/db.dump"


############################
# 2. MEDIA BACKUP
############################
echo "[2/3] Archiving media..."

docker exec "$DJANGO_CONTAINER" \
  tar -czf /tmp/media.tar.gz -C "$MEDIA_PATH" .

docker cp "$DJANGO_CONTAINER":/tmp/media.tar.gz "$WORKDIR/media.tar.gz"

docker exec "$DJANGO_CONTAINER" rm -f /tmp/media.tar.gz


############################
# 3. ENV SNAPSHOT (IMPORTANT)
############################
echo "[3/3] Saving environment snapshot..."

cp /home/sysadmin/PRMS_2/.env "$WORKDIR/env.snapshot" || true


############################
# 4. FINAL SINGLE ARCHIVE
############################
echo "Creating final backup archive..."

tar -czf "$FINAL_BACKUP" -C "$WORKDIR" .

rm -rf "$WORKDIR"

echo "Backup created: $FINAL_BACKUP"


############################
# 5. VERIFICATION
############################
echo "Verifying archive..."

tar -tzf "$FINAL_BACKUP" > /dev/null


############################
# 6. RETENTION POLICY
############################
echo "Cleaning backups older than $RETENTION_DAYS days..."

find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +"$RETENTION_DAYS" -delete


############################
# DONE
############################
echo "=================================================="
echo "Backup finished successfully at: $(date)"
echo "=================================================="
