# 🎨 Logo & Favicon Anleitung

## 📍 Aktueller Stand

✅ **Header-Logo**: Zeigt jetzt `/WischNine.png`  
✅ **Favicon**: Nutzt `/wn-sm.png`

---

## 🖼️ Eigenes Logo einbinden

### Schritt 1: Logo-Datei vorbereiten

**Empfohlene Formate:**
- **PNG** mit transparentem Hintergrund (bevorzugt)
- **SVG** für beste Skalierung
- **Größe**: Min. 200px Höhe für gute Qualität

### Schritt 2: Logo hochladen

```bash
# Dein Logo in den public/ Ordner kopieren
Webpage/public/
├── dein-logo.png     ← Dein neues Logo hier
├── dein-logo.svg     ← Oder als SVG
└── ...
```

### Schritt 3: Logo im Code anpassen

**Datei**: `Webpage/src/pages/Home.tsx` (Zeile 391-400)

```tsx
<Box
  component="img"
  src="/dein-logo.png"        ← Dateiname ändern
  alt="Log-Nine Logo"
  sx={{
    height: 50,                 ← Höhe anpassen (in Pixeln)
    width: "auto",
    objectFit: "contain",
  }}
/>
```

**Verschiedene Größen:**
```tsx
height: 40,    // Klein
height: 50,    // Standard (aktuell)
height: 60,    // Groß
height: 80,    // Extra groß
```

---

## 🎯 Favicon ändern

### Schritt 1: Favicon-Dateien vorbereiten

**Benötigte Formate:**
- **favicon.ico** (16x16, 32x32, 48x48) - für Browser
- **PNG** (192x192, 512x512) - für Mobile/PWA
- **SVG** - für moderne Browser

**Empfohlene Tools:**
- https://realfavicongenerator.net/ (generiert alle Größen)
- https://favicon.io/ (einfach)

### Schritt 2: Favicon-Dateien hochladen

```bash
Webpage/public/
├── favicon.ico       ← Browser-Favicon
├── favicon.png       ← PNG-Version
└── ...
```

### Schritt 3: In index.html eintragen

**Datei**: `Webpage/index.html` (Zeile 5)

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

**Für mehrere Größen:**
```html
<head>
  <meta charset="UTF-8" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Log-Nine</title>
</head>
```

---

## 🎨 Weitere Logo-Positionen

### Board-Cards (Home-Seite)

**Aktuell**: `DashboardIcon` (Material UI)  
**Zeile**: 610

```tsx
// Aktuell
<DashboardIcon sx={{ color: "#64b5f6", fontSize: 36, flexShrink: 0 }} />

// Mit eigenem Logo
<Box
  component="img"
  src="/dein-logo-klein.png"
  alt="Logo"
  sx={{ height: 36, width: 36, objectFit: "contain" }}
/>
```

### "No Boards" Platzhalter

**Zeile**: 661

```tsx
// Aktuell
<DashboardIcon sx={{ fontSize: 80, color: "rgba(255,255,255,0.1)", marginBottom: 2 }} />

// Mit eigenem Logo
<Box
  component="img"
  src="/dein-logo.png"
  alt="Logo"
  sx={{ 
    height: 80, 
    opacity: 0.1, 
    marginBottom: 2,
    filter: "grayscale(100%)"
  }}
/>
```

---

## 🔄 Container neu bauen

Nach Logo-Änderungen:

```bash
# Lokal testen
docker compose down
docker compose up --build

# Auf Server (Production)
docker-compose -f docker-compose.grp9.yaml down
docker-compose -f docker-compose.grp9.yaml up --build -d
```

---

## 📦 Beispiel: Komplett eigenes Logo

### 1. Dateien vorbereiten

```
dein-logo.png          (Haupt-Logo, min. 200px hoch)
dein-logo-klein.png    (Icon-Version, 64x64)
favicon.ico            (Browser-Favicon)
favicon.png            (512x512 für PWA)
```

### 2. Hochladen

```bash
cp dein-logo.png Webpage/public/
cp dein-logo-klein.png Webpage/public/
cp favicon.ico Webpage/public/
cp favicon.png Webpage/public/
```

### 3. Code anpassen

**Home.tsx (Zeile 393)**:
```tsx
src="/dein-logo.png"
```

**index.html (Zeile 5)**:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

### 4. Neu bauen

```bash
docker compose up --build -d
```

---

## 🎯 Schnell-Checkliste

- [ ] Logo vorbereitet (PNG/SVG, min. 200px)
- [ ] Logo nach `Webpage/public/` kopiert
- [ ] `src="/dein-logo.png"` in Home.tsx geändert
- [ ] Favicon vorbereitet (16x16, 32x32, etc.)
- [ ] Favicon nach `Webpage/public/` kopiert
- [ ] `href="/favicon.png"` in index.html geändert
- [ ] Container neu gebaut
- [ ] Im Browser getestet (Shift + F5 für Cache-Clear)

---

## 🆘 Troubleshooting

**Problem**: Logo wird nicht angezeigt

```bash
# Prüfe, ob Datei im Container ist
docker exec lognine-frontend ls /app/public/

# Cache im Browser löschen
Strg + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**Problem**: Logo zu groß/klein

```tsx
// Größe anpassen in Home.tsx
sx={{
  height: 50,     // ← Diese Zahl ändern
  width: "auto",
}}
```

**Problem**: Favicon wird nicht aktualisiert

```bash
# Browser-Cache komplett löschen
# Oder in Inkognito-Modus testen
```

---

## 💡 Design-Tipps

**Header-Logo:**
- Höhe: 40-60px ideal
- Transparenter Hintergrund (PNG)
- Hell oder farbig (Hintergrund ist dunkel)

**Board-Card Icon:**
- Quadratisch (1:1 Ratio)
- 32x32 bis 48x48 Pixel
- Einfaches Design (gut erkennbar)

**Favicon:**
- Einfach & erkennbar bei 16x16
- Kontrastreiche Farben
- Vermeidet zu viele Details

---

**Viel Erfolg beim Branding! 🎨**

