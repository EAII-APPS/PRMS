# Source - https://stackoverflow.com/a
# Posted by Sebastian Hildebrandt, modified by community. See post 'Timeline' for change history
# Retrieved 2026-01-12, License - CC BY-SA 4.0

#!/bin/bash
date=$(date '+%Y-%m-%d')
PGPASSWORD="**_PASSWORD_**" pg_dump --host 127.0.0.1 --port 5432 -U **_USERNAME_** --format custom --blobs --verbose --file "DB_backup_$date.bck" **_DBNAME_**
echo "Backup completed: DB_backup_$date.bck"