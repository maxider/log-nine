# 🎨 Logo & Favicon Guide

## 📍 Current State

✅ **Header Logo**: Now showing `/WischNine.png`  
✅ **Favicon**: Using `/wn-sm.png`

---

## 🖼️ Adding Your Own Logo

### Step 1: Prepare Logo File

**Recommended Formats:**
- **PNG** with transparent background (preferred)
- **SVG** for best scaling
- **Size**: Min. 200px height for good quality

### Step 2: Upload Logo

```bash
# Copy your logo to the public/ folder
Webpage/public/
├── your-logo.png     ← Your new logo here
├── your-logo.svg     ← Or as SVG
└── ...
```

### Step 3: Adjust Logo in Code

**File**: `Webpage/src/pages/Home.tsx` (Line 391-400)

```tsx
<Box
  component="img"
  src="/your-logo.png"        ← Change filename
  alt="Log-Nine Logo"
  sx={{
    height: 50,                 ← Adjust height (in pixels)
    width: "auto",
    objectFit: "contain",
  }}
/>
```

**Different Sizes:**
```tsx
height: 40,    // Small
height: 50,    // Standard (current)
height: 60,    // Large
height: 80,    // Extra large
```

---

## 🎯 Change Favicon

### Step 1: Prepare Favicon Files

**Required Formats:**
- **favicon.ico** (16x16, 32x32, 48x48) - for browsers
- **PNG** (192x192, 512x512) - for mobile/PWA
- **SVG** - for modern browsers

**Recommended Tools:**
- https://realfavicongenerator.net/ (generates all sizes)
- https://favicon.io/ (simple)

### Step 2: Upload Favicon Files

```bash
Webpage/public/
├── favicon.ico       ← Browser favicon
├── favicon.png       ← PNG version
└── ...
```

### Step 3: Add to index.html

**File**: `Webpage/index.html` (Line 5)

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

**For Multiple Sizes:**
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

## 🎨 Other Logo Positions

### Board Cards (Home Page)

**Current**: `DashboardIcon` (Material UI)  
**Line**: 610

```tsx
// Current
<DashboardIcon sx={{ color: "#64b5f6", fontSize: 36, flexShrink: 0 }} />

// With your own logo
<Box
  component="img"
  src="/your-logo-small.png"
  alt="Logo"
  sx={{ height: 36, width: 36, objectFit: "contain" }}
/>
```

### "No Boards" Placeholder

**Line**: 661

```tsx
// Current
<DashboardIcon sx={{ fontSize: 80, color: "rgba(255,255,255,0.1)", marginBottom: 2 }} />

// With your own logo
<Box
  component="img"
  src="/your-logo.png"
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

## 🔄 Rebuild Container

After logo changes:

```bash
# Test locally
docker compose down
docker compose up --build

# On server (production)
docker-compose -f docker-compose.grp9.yaml down
docker-compose -f docker-compose.grp9.yaml up --build -d
```

---

## 📦 Example: Complete Custom Logo

### 1. Prepare Files

```
your-logo.png          (Main logo, min. 200px high)
your-logo-small.png    (Icon version, 64x64)
favicon.ico            (Browser favicon)
favicon.png            (512x512 for PWA)
```

### 2. Upload

```bash
cp your-logo.png Webpage/public/
cp your-logo-small.png Webpage/public/
cp favicon.ico Webpage/public/
cp favicon.png Webpage/public/
```

### 3. Adjust Code

**Home.tsx (Line 393)**:
```tsx
src="/your-logo.png"
```

**index.html (Line 5)**:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

### 4. Rebuild

```bash
docker compose up --build -d
```

---

## 🎯 Quick Checklist

- [ ] Logo prepared (PNG/SVG, min. 200px)
- [ ] Logo copied to `Webpage/public/`
- [ ] `src="/your-logo.png"` changed in Home.tsx
- [ ] Favicon prepared (16x16, 32x32, etc.)
- [ ] Favicon copied to `Webpage/public/`
- [ ] `href="/favicon.png"` changed in index.html
- [ ] Container rebuilt
- [ ] Tested in browser (Shift + F5 to clear cache)

---

## 🆘 Troubleshooting

**Problem**: Logo Not Displayed

```bash
# Check if file is in container
docker exec lognine-frontend ls /app/public/

# Clear browser cache
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**Problem**: Logo Too Large/Small

```tsx
// Adjust size in Home.tsx
sx={{
  height: 50,     // ← Change this number
  width: "auto",
}}
```

**Problem**: Favicon Not Updated

```bash
# Clear browser cache completely
# Or test in incognito mode
```

---

## 💡 Design Tips

**Header Logo:**
- Height: 40-60px ideal
- Transparent background (PNG)
- Light or colorful (background is dark)

**Board Card Icon:**
- Square (1:1 ratio)
- 32x32 to 48x48 pixels
- Simple design (easily recognizable)

**Favicon:**
- Simple & recognizable at 16x16
- High-contrast colors
- Avoid too many details

---

**Good luck with your branding! 🎨**
