# 🚀 Log-Nine auf lognine.grp9.de deployen

## Setup für bestehenden Nginx auf Port 443

Du hast bereits Nginx mit `requiem-guild.com` - wir fügen `lognine.grp9.de` hinzu.

---

## 📋 Schritt 1: Cloudflare DNS

1. Gehe zu **Cloudflare Dashboard** für `grp9.de`
2. **DNS > Records**
3. **A-Record hinzufügen**:
   ```
   Type:    A
   Name:    lognine
   IPv4:    Deine Server-IP
   Proxy:   🟠 Proxied (Orange Cloud AN)
   TTL:     Auto
   ```

---

## 📦 Schritt 2: Log-Nine Container vorbereiten

### docker-compose.grp9.yaml erstellen

```yaml
version: "3.8"

services:
  # Log-Nine Backend
  lognine-server:
    build:
      context: ./Server
      dockerfile: ./log-nine-backend/Dockerfile
    container_name: lognine-server
    restart: unless-stopped
    expose:
      - "8080"
    volumes:
      - ./data:/app/data
    environment:
      - ASPNETCORE_URLS=http://+:8080
    networks:
      - requiem_manager_default  # Netzwerk deines bestehenden Nginx

  # Log-Nine Frontend
  lognine-frontend:
    build:
      context: ./Webpage
      args:
        - VITE_APP_BACKEND_URL=https://lognine.grp9.de/api
    container_name: lognine-frontend
    restart: unless-stopped
    expose:
      - "4173"
    depends_on:
      - lognine-server
    networks:
      - requiem_manager_default  # Netzwerk deines bestehenden Nginx

networks:
  requiem_manager_default:
    external: true  # Nutzt das bestehende Nginx-Netzwerk
```

---

## 🔧 Schritt 3: Nginx-Konfiguration für lognine.grp9.de

### Neue Datei erstellen: `/path/to/Requiem_Manager/nginx/conf.d/lognine.conf`

```nginx
# Log-Nine Subdomain Configuration
server {
    listen 443 ssl;
    http2 on;
    server_name lognine.grp9.de;

    # SSL Configuration (gleiche Zertifikate wie requiem-guild.com oder separate)
    ssl_certificate /etc/nginx/ssl/grp9.de/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/grp9.de/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    include /etc/nginx/conf.d/security.conf;

    # Client max body size
    client_max_body_size 10M;

    # Backend API
    location /api/ {
        proxy_pass http://lognine-server:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # SignalR WebSocket
    location /lognine-hub {
        proxy_pass http://lognine-server:8080/lognine-hub;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    # Frontend
    location / {
        proxy_pass http://lognine-frontend:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://lognine-frontend:4173;
        proxy_set_header Host $host;
        
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status "STATIC";
    }
}
```

---

## 🔐 Schritt 4: SSL-Zertifikat für lognine.grp9.de

### Option A: Wildcard-Zertifikat (empfohlen, falls bereits vorhanden)

Falls du bereits ein Wildcard-Zertifikat für `*.grp9.de` hast, kannst du es nutzen:

```nginx
ssl_certificate /etc/nginx/ssl/grp9.de/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/grp9.de/privkey.pem;
```

### Option B: Neues Zertifikat für lognine.grp9.de

```bash
# Auf dem Server
docker exec -it <dein-nginx-container> sh

# Certbot ausführen
certbot certonly --webroot \
  -w /usr/share/nginx/html \
  -d lognine.grp9.de \
  --email deine@email.com \
  --agree-tos \
  --non-interactive

# Nginx neu laden
docker exec <dein-nginx-container> nginx -s reload
```

---

## 🚀 Schritt 5: Alles starten

### 1. Log-Nine Container starten

```bash
cd /path/to/log-nine
docker-compose -f docker-compose.grp9.yaml up --build -d
```

### 2. Nginx neu laden

```bash
# Nginx-Container-Name herausfinden
docker ps | grep nginx

# Nginx-Konfiguration testen
docker exec <nginx-container-name> nginx -t

# Nginx neu laden
docker exec <nginx-container-name> nginx -s reload

# ODER: Nginx-Container neustarten
docker restart <nginx-container-name>
```

---

## ✅ Schritt 6: Testen

```bash
# DNS-Auflösung prüfen
nslookup lognine.grp9.de

# HTTPS testen
curl -I https://lognine.grp9.de

# Im Browser öffnen
https://lognine.grp9.de
```

---

## 🔧 Admin-Passwort ändern

**WICHTIG**: Ändere das Admin-Passwort!

```bash
nano Server/log-nine-backend/appsettings.json
```

Ändere:
```json
"AdminPassword": "dein-sicheres-passwort"
```

Dann Container neustarten:
```bash
docker restart lognine-server
```

---

## 🛠️ Wartung

### Logs anschauen
```bash
docker logs -f lognine-server
docker logs -f lognine-frontend
```

### Updates deployen
```bash
cd /path/to/log-nine
git pull
docker-compose -f docker-compose.grp9.yaml up --build -d
```

### Container neustarten
```bash
docker restart lognine-server lognine-frontend
```

### Datenbank sichern
```bash
docker exec lognine-server \
  cp /app/data/data.db /app/data/backup-$(date +%Y%m%d).db
```

---

## 🆘 Troubleshooting

### Problem: "502 Bad Gateway"

```bash
# Prüfe, ob Container laufen
docker ps | grep lognine

# Prüfe Container-Logs
docker logs lognine-server
docker logs lognine-frontend

# Prüfe Netzwerk
docker network inspect requiem_manager_default
```

### Problem: "Container not found"

```bash
# Netzwerk-Name herausfinden
docker network ls | grep requiem

# In docker-compose.grp9.yaml korrigieren
networks:
  <richtiger-netzwerk-name>:
    external: true
```

### Problem: SSL-Zertifikat-Fehler

```bash
# Zertifikat-Pfad prüfen
docker exec <nginx-container> ls -la /etc/nginx/ssl/

# Falls Zertifikat fehlt, neu erstellen (siehe Schritt 4)
```

---

## 📊 Netzwerk-Architektur

```
Internet
    ↓
Cloudflare (DNS + Proxy)
    ↓
Port 443
    ↓
Nginx Container (requiem_manager)
    ├── requiem-guild.com → api:8000, frontend:3000
    └── lognine.grp9.de → lognine-server:8080, lognine-frontend:4173
```

---

## 🎯 Checkliste

- ✅ Cloudflare DNS: A-Record für `lognine` → Server-IP
- ✅ docker-compose.grp9.yaml erstellt
- ✅ Nginx-Config `/nginx/conf.d/lognine.conf` erstellt
- ✅ SSL-Zertifikat für lognine.grp9.de
- ✅ Admin-Passwort geändert
- ✅ Log-Nine Container gestartet
- ✅ Nginx neu geladen
- ✅ https://lognine.grp9.de funktioniert

---

**Fertig!** Log-Nine läuft jetzt auf **https://lognine.grp9.de** 🚀

