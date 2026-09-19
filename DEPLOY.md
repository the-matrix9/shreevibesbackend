# ShreeVibe — Frontend (deploy to Vercel)

## Local dev
```bash
cp .env.example .env   # set VITE_API_BASE to your local or deployed backend
npm install
npm run dev
```

## Deploy to Vercel

1. Push this `frontend/` folder as its own repo (or set Vercel's **Root
   Directory** to `frontend` if it's part of a monorepo).
2. New Project → Import the repo. Vercel auto-detects Vite:
   - Build command: `npm run build` (default)
   - Output directory: `dist` (default)
   - The included `vercel.json` adds an SPA rewrite so client-side routes
     don't 404 on refresh.
3. In **Settings → Environment Variables**, add:
   - `VITE_API_BASE` — your deployed Railway backend URL, e.g.
     `https://shreevibe-backend-production.up.railway.app` (**no trailing
     slash**). Vite bakes this in at build time, so redeploy after changing it.
4. Deploy. Vercel gives you a URL like `https://shreevibe.vercel.app`.

## Wire the two together

The backend only accepts requests from the exact `FRONTEND_ORIGIN` it's
configured with (CORS lock), so:

1. Deploy the backend first, note its Railway URL.
2. Deploy the frontend with `VITE_API_BASE` set to that Railway URL.
3. Go back to the Railway backend → set `FRONTEND_ORIGIN` to the Vercel URL
   from step 2 → redeploy the backend.

Until both sides point at each other's real URLs, search/download calls will
fail CORS or 403 checks — that's expected, it's the security lock working.
