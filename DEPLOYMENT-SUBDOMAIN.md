# 🚀 Deploy Log-Nine to lognine.grp9.de

## Setup for Existing Nginx on Port 443

You already have Nginx with `requiem-guild.com` - we'll add `lognine.grp9.de`.

---

## 📋 Step 1: Cloudflare DNS

1. Go to **Cloudflare Dashboard** for `grp9.de`
2. **DNS > Records**
3. **Add A-Record**:
   ```
   Type:    A
   Name:    lognine
   IPv4:    Your Server IP
   Proxy:   🟠 Proxied (Orange Cloud ON)
   TTL:     Auto
   ```

---

## 📦 Step 2: Prepare Log-Nine Containers

### Create docker-compose.grp9.yaml

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
      - requiem_manager_default  # Network of your existing Nginx

networks:
  requiem_manager_default:
    external: true  # Uses the existing Nginx network
```

---

## 🔧 Step 3: Nginx Configuration for lognine.grp9.de

### Create New File: `/path/to/Requiem_Manager/nginx/conf.d/lognine.conf`

```nginx
# Log-Nine Subdomain Configuration
server {
    listen 443 ssl;
    http2 on;
    server_name lognine.grp9.de;

    # SSL Configuration (same certificates as requiem-guild.com or separate)
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

## 🔐 Step 4: SSL Certificate for lognine.grp9.de

### Option A: Wildcard Certificate (recommended, if already available)

If you already have a wildcard certificate for `*.grp9.de`, you can use it:

```nginx
ssl_certificate /etc/nginx/ssl/grp9.de/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/grp9.de/privkey.pem;
```

### Option B: New Certificate for lognine.grp9.de

```bash
# On the server
docker exec -it <your-nginx-container> sh

# Run Certbot
certbot certonly --webroot \
  -w /usr/share/nginx/html \
  -d lognine.grp9.de \
  --email your@email.com \
  --agree-tos \
  --non-interactive

# Reload Nginx
docker exec <your-nginx-container> nginx -s reload
```

---

## 🚀 Step 5: Start Everything

### 1. Start Log-Nine Containers

```bash
cd /path/to/log-nine
docker-compose -f docker-compose.grp9.yaml up --build -d
```

### 2. Reload Nginx

```bash
# Find Nginx container name
docker ps | grep nginx

# Test Nginx configuration
docker exec <nginx-container-name> nginx -t

# Reload Nginx
docker exec <nginx-container-name> nginx -s reload

# OR: Restart Nginx container
docker restart <nginx-container-name>
```

---

## ✅ Step 6: Test

```bash
# Check DNS resolution
nslookup lognine.grp9.de

# Test HTTPS
curl -I https://lognine.grp9.de

# Open in browser
https://lognine.grp9.de
```

---

## 🔧 Change Admin Password

**IMPORTANT**: Change the admin password!

```bash
nano Server/log-nine-backend/appsettings.json
```

Change:
```json
"AdminPassword": "your-secure-password"
```

Then restart container:
```bash
docker restart lognine-server
```

---

## 🛠️ Maintenance

### View Logs
```bash
docker logs -f lognine-server
docker logs -f lognine-frontend
```

### Deploy Updates
```bash
cd /path/to/log-nine
git pull
docker-compose -f docker-compose.grp9.yaml up --build -d
```

### Restart Containers
```bash
docker restart lognine-server lognine-frontend
```

### Backup Database
```bash
docker exec lognine-server \
  cp /app/data/data.db /app/data/backup-$(date +%Y%m%d).db
```

---

## 🆘 Troubleshooting

### Problem: "502 Bad Gateway"

```bash
# Check if containers are running
docker ps | grep lognine

# Check container logs
docker logs lognine-server
docker logs lognine-frontend

# Check network
docker network inspect requiem_manager_default
```

### Problem: "Container not found"

```bash
# Find network name
docker network ls | grep requiem

# Correct in docker-compose.grp9.yaml
networks:
  <correct-network-name>:
    external: true
```

### Problem: SSL Certificate Error

```bash
# Check certificate path
docker exec <nginx-container> ls -la /etc/nginx/ssl/

# If certificate is missing, create new one (see Step 4)
```

---

## 📊 Network Architecture

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

## 🎯 Checklist

- ✅ Cloudflare DNS: A-Record for `lognine` → Server IP
- ✅ docker-compose.grp9.yaml created
- ✅ Nginx config `/nginx/conf.d/lognine.conf` created
- ✅ SSL certificate for lognine.grp9.de
- ✅ Admin password changed
- ✅ Log-Nine containers started
- ✅ Nginx reloaded
- ✅ https://lognine.grp9.de working

---

**Done!** Log-Nine is now running on **https://lognine.grp9.de** 🚀

