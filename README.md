# Major's Bets 2.0

Production-ready sportsbook experience for Major, powered by Next.js 14, Prisma, Tailwind, and a secure single-admin workflow.

## Stack

- **Next.js 14 + App Router** with React + TypeScript
- **Tailwind CSS** for the neon sportsbook theme
- **Prisma** ORM against PostgreSQL (`DATABASE_URL`)
- **Serverless API routes** for parlays, performance stats, odds proxy, and auth
- **Auth**: single email/password admin stored via hashed credentials and HTTP-only session cookie (JWT signed with `AUTH_SECRET`)

## Getting Started

1. Install deps and generate Prisma client:

```bash
npm install
npm run prisma:generate
```

2. Set up a Postgres database and copy `.env.example` to `.env` with:

```
DATABASE_URL=postgres://...
AUTH_SECRET=64-char-random-string
MAJOR_ADMIN_EMAIL=major@majorsbets.com
MAJOR_ADMIN_PASSWORD=super-secure-password
ODDS_API_BASE_URL=https://api.example.com/v1/odds
ODDS_API_KEY=...
MAJOR_TWITTER_HANDLE=majorsbets
```

3. Run migrations and seed the single admin user:

```bash
npm run prisma:migrate
npm run prisma:seed
```

4. Start dev server:

```bash
npm run dev
```

## Project Structure

```
app/                 # Next.js routes (public, login, admin, APIs)
components/          # UI + dashboard components
lib/                 # Prisma client, auth helpers, data fetching, odds fallback
prisma/schema.prisma # Data models + enums
public/              # Static assets
```

## Key Features

- **Public home (`/`)** pulls spotlight/daily/history/stats directly from the DB and renders live odds + ticker via `/api/odds` (falls back to mock data if env keys missing).
- **Login (`/login`)** single admin email/password flow. Successful logins redirect to `/admin` and set an HTTP-only session cookie.
- **Admin dashboard (`/admin`)** exposes creation form + quick management list for today and recent parlays. Mutations happen through protected API routes.
- **API routes**:
  - `POST /api/auth/login`, `POST /api/auth/logout`
  - `GET/POST /api/parlays`, `PUT/DELETE /api/parlays/:id`
  - `GET /api/performance`
  - `GET /api/odds` (proxy to external odds provider)

## Deployment

- Netlify-ready via `netlify.toml` and `@netlify/plugin-nextjs`.
- Provide env vars in Netlify dashboard (DB, auth secret, admin creds, odds API keys, Twitter handle).
- `npm run build` compiles the site and serverless functions.

## Future Enhancements

- Expand `PerformanceSnapshot` usage for precomputed metrics
- Add multi-user roles using the existing `role` enum
- Integrate true Twitter/X embeds or auto-generated teaser copy per parlay
