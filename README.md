# AyurSathi

AyurSathi is a minimal, glassmorphic full-stack web application that provides practical Ayurvedic home remedies and yoga/pranayama guidance for everyday health concerns using the Google Gemini API.

> **Disclaimer:** AyurSathi gives general information only and is not medical advice. Always consult a qualified doctor.

---

## Features
- **Interactive 3D-Shaded Buddha Hero:** Meditating *Padmasana* Buddha centerpiece that blooms into a multi-armed healing form when clicked or when focusing/searching.
- **7-Chakras Loading Sanctuary:** Animated *Sushumna*, *Ida*, and *Pingala* chakra alignment sequence paired with glass skeleton shimmer cards.
- **Remedies & Yoga Cards with Bing Thumbnails:** Segmented `Remedies | Yoga` view with Bing Image thumbnails, expandable ingredients/benefits, numbered steps, duration, highlighted cautions, and YouTube tutorial search links.
- **Safety & Caching:** Emergency detection banner, `seeDoctorIf` guidance, 20 req/min IP rate limiting, in-flight request deduplication, server `Map` caching, and `localStorage` recent search chips.

---

## Project Structure

```text
AyurSathi/
  client/                 # React + Vite + Tailwind CSS frontend
    public/               # Buddha SVG favicon
    src/
      components/         # BuddhaHero, BuddhaLogo, ChakraLoader, GuidanceCard, etc.
      hooks/              # useSearch hook + localStorage recent history
      pages/              # HomePage and ResultsPage (/results?q=...)
      services/           # Backend API client
      utils/              # Bing thumbnail URL helper
    .env.example
    package.json
    vercel.json           # SPA rewrite rules for /results?q=...
  server/                 # Node.js + Express backend
    api/                  # Vercel serverless entrypoint (api/index.js)
    src/
      middleware/         # Rate limiter (20 req/min per IP)
      routes/             # /api/search route with in-flight deduplication
      services/           # Google Gemini (@google/generative-ai) service
      utils/              # In-memory Map cache & JSON validation
      app.js
      index.js
    .env.example
    package.json
    vercel.json           # Vercel serverless routing
  .gitignore              # Root gitignore (excludes .env, node_modules, dist)
  render.yaml             # Render Blueprint for one-click server deployment
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Backend Setup (`server/`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend Setup (`client/`)

Open a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Verify `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Deployment

### Option A: Frontend on Vercel + Backend on Render (Recommended)

#### 1. Deploy Backend on Render
- Connect your GitHub repository in Render.
- Either choose **New → Blueprint** (uses root `render.yaml` automatically) OR **New → Web Service**:
  - **Root Directory:** `server`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Health Check Path:** `/api/health`
- Set Environment Variables in Render:
  - `GEMINI_API_KEY` = your Gemini API key
  - `GEMINI_MODEL` = `gemini-2.5-flash`
  - `CLIENT_ORIGIN` = your Vercel frontend URL (e.g., `https://ayursathi.vercel.app`)
- Copy your Render URL (e.g., `https://ayursathi-server.onrender.com`).

#### 2. Deploy Frontend on Vercel
- Import the repository in Vercel:
  - **Root Directory:** `client`
  - **Framework Preset:** `Vite`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
- Set Environment Variable in Vercel:
  - `VITE_API_URL` = `https://ayursathi-server.onrender.com` (no trailing slash)
- `client/vercel.json` is already configured so refreshing `/results?q=...` works seamlessly.
- After Vercel gives you the live domain, make sure `CLIENT_ORIGIN` on Render matches that exact Vercel URL.

---

### Option B: Both Frontend & Backend on Vercel

1. **Backend Project on Vercel**:
   - Import the repo with **Root Directory** set to `server`.
   - Vercel automatically uses `server/api/index.js` and `server/vercel.json`.
   - Add `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`, and `CLIENT_ORIGIN=https://your-frontend.vercel.app`.
2. **Frontend Project on Vercel**:
   - Import the repo with **Root Directory** set to `client`.
   - Set `VITE_API_URL` to your deployed Vercel backend URL.
   - Note: Serverless functions reset their in-memory `Map` cache and per-instance rate limiter across cold starts.
