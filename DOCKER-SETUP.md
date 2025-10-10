# Log-Nine Docker Setup & Test-Anleitung

Diese Anleitung zeigt, wie du die optimierte Log-Nine Anwendung mit Docker testen kannst.

## 📋 Voraussetzungen

- Docker Desktop installiert ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (normalerweise in Docker Desktop enthalten)

## 🚀 Schnellstart

### 1. Alle Container bauen und starten

```bash
docker compose up --build
```

**Was passiert dabei?**
- Backend wird auf Port `8082` bereitgestellt
- Frontend wird auf Port `8081` bereitgestellt
- SQLite-Datenbank wird in einem Docker Volume gespeichert

### 2. Anwendung öffnen

Öffne deinen Browser und navigiere zu:

```
http://localhost:8081
```

### 3. Container stoppen

```bash
# Mit Ctrl+C beenden (wenn im Vordergrund)
# Oder:
docker compose down
```

## 🔧 Erweiterte Befehle

### Container im Hintergrund starten

```bash
docker compose up -d --build
```

### Logs anzeigen

```bash
# Alle Container
docker compose logs -f

# Nur Backend
docker compose logs -f server

# Nur Frontend
docker compose logs -f frontend
```

### Container neu starten

```bash
docker compose restart
```

### Container und Volumes komplett entfernen

```bash
docker compose down -v
```

**⚠️ Warnung:** Dies löscht auch die Datenbank!

### Nur neu bauen (ohne zu starten)

```bash
docker compose build
```

## 🐛 Troubleshooting

### Problem: Port bereits belegt

**Fehler:** `Bind for 0.0.0.0:8081 failed: port is already allocated`

**Lösung:** Ändere die Ports in `compose.yaml`:

```yaml
services:
  frontend:
    ports:
      - "8083:4173"  # Ändere 8081 zu 8083
```

### Problem: Backend nicht erreichbar

**Prüfe:**
1. Ist der Server-Container gestartet?
   ```bash
   docker compose ps
   ```

2. Zeige Backend-Logs:
   ```bash
   docker compose logs server
   ```

3. Teste Backend direkt:
   ```bash
   curl http://localhost:8082/swagger
   ```

### Problem: Frontend zeigt Fehler

**Lösung:** Stelle sicher, dass die Backend-URL korrekt ist:

1. Prüfe `compose.yaml` - `VITE_APP_BACKEND_URL` sollte `http://localhost:8082` sein
2. Baue neu:
   ```bash
   docker compose up --build
   ```

### Problem: Änderungen werden nicht übernommen

**Lösung:** Vollständiger Neuaufbau:

```bash
# Alles stoppen und entfernen
docker compose down

# Images entfernen
docker compose rm -f

# Neu bauen ohne Cache
docker compose build --no-cache

# Starten
docker compose up
```

## 📊 Nützliche Docker-Befehle

### Speicherplatz freigeben

```bash
# Ungenutzte Images entfernen
docker image prune -a

# Ungenutzte Volumes entfernen
docker volume prune

# Alles aufräumen (VORSICHT!)
docker system prune -a --volumes
```

### Container-Shell öffnen

```bash
# Backend-Container
docker compose exec server /bin/bash

# Frontend-Container
docker compose exec frontend /bin/sh
```

### Datenbank exportieren

```bash
# SQLite DB aus dem Container kopieren
docker compose cp server:/app/data/log-nine.db ./backup.db
```

## 🔒 Produktions-Deployment

Für Production-Deployment:

1. **Aktualisiere `appsettings.json`** mit Production-CORS-Origins
2. **Setze sichere Environment-Variablen**
3. **Verwende einen Reverse Proxy** (nginx/Traefik)
4. **Aktiviere HTTPS**
5. **Verwende eine robustere Datenbank** (PostgreSQL/MySQL statt SQLite)

## 📝 Optimierungen in dieser Version

✅ **Backend:**
- CORS korrekt konfiguriert
- Request-Size-Limit anpassbar (1MB Standard)
- Input-Validation für alle Entities
- Besseres Error-Handling

✅ **Frontend:**
- Toast-Notifications (notistack)
- Error Boundary für App-weite Fehlerbehandlung
- SignalR Reconnection-Logic
- Optimierte React Query Konfiguration

✅ **Docker:**
- Multi-Stage Build für kleinere Images
- .dockerignore für schnellere Builds
- Shared Network zwischen Services
- Volume-Persistenz für Datenbank

## 🧪 Tests durchführen

### Manuelle Tests

1. **Board erstellen:** `http://localhost:8081`
2. **Team hinzufügen:** "View Teams" → "Create Team"
3. **Person hinzufügen:** "Add Person"
4. **Task erstellen:** "Create Task" oder "5-Liner"
5. **Task zuweisen:** Klicke auf Task → Person zuweisen
6. **Status ändern:** Pfeile im Task-Card

### API-Tests (Swagger)

```
http://localhost:8082/swagger
```

Teste alle Endpoints direkt in Swagger UI.

### Echtzeit-Synchronisation testen

1. Öffne zwei Browser-Tabs mit `http://localhost:8081`
2. Erstelle einen Task in Tab 1
3. Der Task sollte automatisch in Tab 2 erscheinen (SignalR)

## 📞 Support

Bei Problemen:
1. Prüfe die Container-Logs
2. Stelle sicher, Docker Desktop läuft
3. Überprüfe Firewall-Einstellungen
4. Starte Docker Desktop neu

