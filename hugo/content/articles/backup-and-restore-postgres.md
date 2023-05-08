---
title: "Backup and restore a Postgres database running inside a pod"
date: 2021-09-20T17:36:46+02:00
draft: false
---

# Backup and restore a Postgres database running inside a pod

## Backup postgres database

Option 1: Backup as plain sql dump

```bash
pg_dump -U <USERNAME> -d <DATABASE> --file <FILENAME>.sql
```

Option 2: Backup as plain sql dump but compressed with gzip

```bash
pg_dump -U <USERNAME> -d <DATABASE> | gzip > <FILENAME>.sql.gz
```

Optionally you can copy your backup out of the kubernetes pod by running

```bash
kubectl cp -n <NAMESPACE> <POD>:<REMOTE_PATH> <LOCAL_PATH>
```

### Backup postgres database within kubernetes pod to local machine

The following command executes a backup of the initially created database and stores the backup on the machine executing the command.

```bash
k exec -n <NAMESPACE> <POD> -- sh -c 'pg_dump -U $POSTGRES_USER -d $POSTGRES_DB' > ./dump.sql
```

If you additionally want to compress the backup using gzip use the following command:

```bash
k exec -n <NAMESPACE> <POD> -- sh -c 'pg_dump -U $POSTGRES_USER -d $POSTGRES_DB | gzip' > ./dump.sql.gz
```

## Restore postgres database

If your postgres database is running within a kubernetes pod you first have to copy the dump into the container.

```bash
kubectl cp -n <NAMESPACE> <LOCAL_PATH> <POD>:<REMOTE_PATH>
```

If the plain sql backup is available within the pod you just need to run the following command to restore the content of your database.

```bash
psql -U <USERNAME> -d <DATABASE> < <SQL_DUMP_FILE>
```
