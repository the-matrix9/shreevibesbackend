# ShreeVibe — Backend (deploy to Railway)

## Local dev
```bash
cp .env.example .env   # fill in JWT_SECRET, UPSTREAM_BASE, UPSTREAM_KEY
npm install
npm run dev
```

## Deploy to Railway

1. Push this `backend/` folder as its own repo (or a subfolder — set Railway's
   **Root Directory** to `backend` if it's part of a monorepo).
2. New Project → Deploy from GitHub repo → select it. Railway auto-detects
   Node via Nixpacks and runs `npm install && npm start` (the included
   `railway.json` pins this explicitly).
3. In the Railway service → **Variables**, add:
   - `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`)
   - `UPSTREAM_BASE` — `https://ansh-apis.is-dev.org/api/printrest`
   - `UPSTREAM_KEY` — `ansh`
   - `SESSION_TTL_SECONDS` — `300`
   - `FRONTEND_ORIGIN` — your deployed Vercel URL, e.g.
     `https://shreevibe.vercel.app` (**no trailing slash**). Update this once
     you know the final Vercel URL, or CORS will reject the frontend.
   - `PORT` — Railway sets this automatically; you don't need to add it.
4. Deploy. Note the public URL Railway gives the service
   (e.g. `https://shreevibe-backend-production.up.railway.app`) — you'll need
   it as `VITE_API_BASE` on the frontend.
5. Sanity check: `GET https://<your-railway-url>/api/health` should return
   `{"ok":true}`.

## After the frontend is live

Come back and set `FRONTEND_ORIGIN` to the real Vercel domain (not
`localhost`), then redeploy the backend — CORS is locked to exactly that
origin.
