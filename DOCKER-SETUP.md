# Log-Nine Docker Setup & Testing Guide

This guide shows how to test the optimized Log-Nine application with Docker.

## 📋 Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (usually included in Docker Desktop)

## 🚀 Quick Start

### 1. Build and Start All Containers

```bash
docker compose up --build
```

**What happens?**
- Backend is served on port `8082`
- Frontend is served on port `8081`
- SQLite database is stored in a Docker volume

### 2. Open Application

Open your browser and navigate to:

```
http://localhost:8081
```

### 3. Stop Containers

```bash
# Exit with Ctrl+C (if running in foreground)
# Or:
docker compose down
```

## 🔧 Advanced Commands

### Start Containers in Background

```bash
docker compose up -d --build
```

### View Logs

```bash
# All containers
docker compose logs -f

# Backend only
docker compose logs -f server

# Frontend only
docker compose logs -f frontend
```

### Restart Containers

```bash
docker compose restart
```

### Completely Remove Containers and Volumes

```bash
docker compose down -v
```

**⚠️ Warning:** This also deletes the database!

### Only Build (Without Starting)

```bash
docker compose build
```

## 🐛 Troubleshooting

### Problem: Port Already in Use

**Error:** `Bind for 0.0.0.0:8081 failed: port is already allocated`

**Solution:** Change the ports in `compose.yaml`:

```yaml
services:
  frontend:
    ports:
      - "8083:4173"  # Change 8081 to 8083
```

### Problem: Backend Not Reachable

**Check:**
1. Is the server container running?
   ```bash
   docker compose ps
   ```

2. Show backend logs:
   ```bash
   docker compose logs server
   ```

3. Test backend directly:
   ```bash
   curl http://localhost:8082/swagger
   ```

### Problem: Frontend Shows Errors

**Solution:** Make sure the backend URL is correct:

1. Check `compose.yaml` - `VITE_APP_BACKEND_URL` should be `http://localhost:8082`
2. Rebuild:
   ```bash
   docker compose up --build
   ```

### Problem: Changes Not Applied

**Solution:** Complete rebuild:

```bash
# Stop and remove everything
docker compose down

# Remove images
docker compose rm -f

# Rebuild without cache
docker compose build --no-cache

# Start
docker compose up
```

## 📊 Useful Docker Commands

### Free Up Disk Space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean up everything (CAUTION!)
docker system prune -a --volumes
```

### Open Container Shell

```bash
# Backend container
docker compose exec server /bin/bash

# Frontend container
docker compose exec frontend /bin/sh
```

### Export Database

```bash
# Copy SQLite DB from container
docker compose cp server:/app/data/log-nine.db ./backup.db
```

## 🔒 Production Deployment

For production deployment:

1. **Update `appsettings.json`** with production CORS origins
2. **Set secure environment variables**
3. **Use a reverse proxy** (nginx/Traefik)
4. **Enable HTTPS**
5. **Use a more robust database** (PostgreSQL/MySQL instead of SQLite)

## 📝 Optimizations in This Version

✅ **Backend:**
- CORS correctly configured
- Request size limit adjustable (1MB default)
- Input validation for all entities
- Better error handling

✅ **Frontend:**
- Toast notifications (notistack)
- Error boundary for app-wide error handling
- SignalR reconnection logic
- Optimized React Query configuration

✅ **Docker:**
- Multi-stage build for smaller images
- .dockerignore for faster builds
- Shared network between services
- Volume persistence for database

## 🧪 Running Tests

### Manual Tests

1. **Create Board:** `http://localhost:8081`
2. **Add Team:** "View Teams" → "Create Team"
3. **Add Person:** "Add Person"
4. **Create Task:** "Create Task" or "5-Liner"
5. **Assign Task:** Click on task → assign person
6. **Change Status:** Arrows in task card

### API Tests (Swagger)

```
http://localhost:8082/swagger
```

Test all endpoints directly in Swagger UI.

### Test Real-Time Synchronization

1. Open two browser tabs with `http://localhost:8081`
2. Create a task in tab 1
3. The task should automatically appear in tab 2 (SignalR)

## 📞 Support

If you encounter problems:
1. Check container logs
2. Make sure Docker Desktop is running
3. Check firewall settings
4. Restart Docker Desktop
