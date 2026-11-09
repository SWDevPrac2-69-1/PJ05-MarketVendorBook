# Frontend starter

React + Vite starter for the Night Market Vendor Booking frontend. The current auth, spot, and booking pages are placeholders assigned in [FRONTEND_TASKS.md](../FRONTEND_TASKS.md).

## Run locally

```bash
cd client
npm ci
npm run dev
```

Run the backend separately from the repository root with `npm run dev`. Frontend uses `http://localhost:3000` and Vite proxies `/api` and `/health` to `http://localhost:5001`. This project's local backend port is 5001 because macOS Control Center uses 5000 on this machine. Copy `config/config.example.env` to `config/config.env` and set `MONGO_URI` there for data-backed endpoints; the local file is ignored by Git. Use `npm run build` here to check the production build.

For a separate API host, copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL`; the backend CORS origin must then allow the frontend host.

## Shared contracts

- `api(path, options)` in `src/shared/api/client.js` returns the response's `data` field and throws `ApiError` with `status` on failure.
- `useAuth()` in `src/shared/auth/AuthContext.jsx` exposes `user`, `loading`, `signIn(authData)`, and `signOut()`.
- Work is handed off in two stages: basic features first, then UX and edge-case improvements. See `FRONTEND_TASKS.md` for file ownership and acceptance criteria.
