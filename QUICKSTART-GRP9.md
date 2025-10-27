# ⚡ Log-Nine on lognine.grp9.de - Quick Start

## 🎯 5-Minute Setup

### 1️⃣ Cloudflare DNS
```
Cloudflare Dashboard → grp9.de → DNS
A-Record: lognine → Your Server IP (🟠 Orange Cloud ON)
```

### 2️⃣ On the Server

```bash
cd /opt/log-nine

# 1. Check network name (should be "requiem_manager_default")
docker network ls | grep requiem

# 2. If different, adjust in docker-compose.grp9.yaml

# 3. Change admin password
nano Server/log-nine-backend/appsettings.json
# Change "AdminPassword": "your-secure-password"

# 4. Start Log-Nine
docker-compose -f docker-compose.grp9.yaml up --build -d
```

### 3️⃣ Add Nginx Config

```bash
# 1. Copy config
cp nginx-lognine.conf /path/to/Requiem_Manager/nginx/conf.d/lognine.conf

# 2. Adjust SSL path (if necessary)
nano /path/to/Requiem_Manager/nginx/conf.d/lognine.conf
# Check ssl_certificate paths

# 3. Reload Nginx
docker exec <nginx-container-name> nginx -t
docker exec <nginx-container-name> nginx -s reload
```

### 4️⃣ SSL Certificate (if not already available)

```bash
# If no wildcard certificate for *.grp9.de available
docker exec <nginx-container-name> sh

certbot certonly --webroot \
  -w /usr/share/nginx/html \
  -d lognine.grp9.de \
  --email your@email.com \
  --agree-tos

exit
docker exec <nginx-container-name> nginx -s reload
```

### 5️⃣ Test!

```bash
curl -I https://lognine.grp9.de
```

Open: **https://lognine.grp9.de** 🎉

---

## 🔧 Useful Commands

```bash
# Logs
docker logs -f lognine-server
docker logs -f lognine-frontend

# Status
docker ps | grep lognine

# Restart
docker restart lognine-server lognine-frontend

# Updates
cd /opt/log-nine
git pull
docker-compose -f docker-compose.grp9.yaml up --build -d
```

---

## 🆘 Problems?

**"502 Bad Gateway"**
```bash
docker ps | grep lognine              # Containers running?
docker logs lognine-server            # Error in log?
docker network ls | grep requiem      # Network correct?
```

**"Connection refused"**
```bash
nslookup lognine.grp9.de              # DNS correct?
docker exec <nginx> nginx -t          # Nginx config OK?
```

Detailed guide: **DEPLOYMENT-SUBDOMAIN.md**
