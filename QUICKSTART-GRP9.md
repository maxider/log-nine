# ⚡ Log-Nine auf lognine.grp9.de - Quick Start

## 🎯 5 Minuten Setup

### 1️⃣ Cloudflare DNS
```
Cloudflare Dashboard → grp9.de → DNS
A-Record: lognine → Deine Server-IP (🟠 Orange Cloud AN)
```

### 2️⃣ Auf dem Server

```bash
cd /opt/log-nine

# 1. Netzwerk-Name prüfen (sollte "requiem_manager_default" sein)
docker network ls | grep requiem

# 2. Falls anders, in docker-compose.grp9.yaml anpassen

# 3. Admin-Passwort ändern
nano Server/log-nine-backend/appsettings.json
# Ändere "AdminPassword": "dein-sicheres-passwort"

# 4. Log-Nine starten
docker-compose -f docker-compose.grp9.yaml up --build -d
```

### 3️⃣ Nginx-Config hinzufügen

```bash
# 1. Config kopieren
cp nginx-lognine.conf /path/to/Requiem_Manager/nginx/conf.d/lognine.conf

# 2. SSL-Pfad anpassen (falls nötig)
nano /path/to/Requiem_Manager/nginx/conf.d/lognine.conf
# Prüfe ssl_certificate Pfade

# 3. Nginx neu laden
docker exec <nginx-container-name> nginx -t
docker exec <nginx-container-name> nginx -s reload
```

### 4️⃣ SSL-Zertifikat (falls noch nicht vorhanden)

```bash
# Falls kein Wildcard-Zertifikat für *.grp9.de vorhanden
docker exec <nginx-container-name> sh

certbot certonly --webroot \
  -w /usr/share/nginx/html \
  -d lognine.grp9.de \
  --email deine@email.com \
  --agree-tos

exit
docker exec <nginx-container-name> nginx -s reload
```

### 5️⃣ Testen!

```bash
curl -I https://lognine.grp9.de
```

Öffne: **https://lognine.grp9.de** 🎉

---

## 🔧 Nützliche Befehle

```bash
# Logs
docker logs -f lognine-server
docker logs -f lognine-frontend

# Status
docker ps | grep lognine

# Neustart
docker restart lognine-server lognine-frontend

# Updates
cd /opt/log-nine
git pull
docker-compose -f docker-compose.grp9.yaml up --build -d
```

---

## 🆘 Probleme?

**"502 Bad Gateway"**
```bash
docker ps | grep lognine              # Container laufen?
docker logs lognine-server            # Fehler im Log?
docker network ls | grep requiem      # Netzwerk korrekt?
```

**"Connection refused"**
```bash
nslookup lognine.grp9.de              # DNS korrekt?
docker exec <nginx> nginx -t          # Nginx-Config OK?
```

Ausführliche Anleitung: **DEPLOYMENT-SUBDOMAIN.md**

