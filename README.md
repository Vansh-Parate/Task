# Terms (SOW clone)

Responsive React (Vite) frontend + Fastify + Sequelize backend with Postgres.

## Dev

- Ensure Postgres is running and accessible via `DATABASE_URL` env (defaults to `postgres://postgres:postgres@localhost:5432/terms`).
- Install deps and run dev servers (client + api):

```
npm install
npm run dev
```

## API

- GET `/api/terms?lang=en|sv` returns `{ lang, sections: [{slug,title,content}] }`.

## Deploy

- Frontend: build via `npm run build` and deploy `dist/` to a static host (Netlify/Cloudflare Pages/etc.).
- Backend: deploy `server/` to a free Node host (Render/Railway/Fly). Set `DATABASE_URL` and expose the port.
