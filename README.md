# DSA Journal

A personal data structures & algorithms practice journal: log solved problems, get nudged to
re-solve them on a fixed spaced-repetition schedule (+2/+3/+4/+7 days), then keep lightweight
flashcard reminders once a problem is mastered. Single-user, gated by a passcode.

## Stack

Next.js (App Router) + Tailwind CSS + Prisma + PostgreSQL + Recharts.

## Local development

1. Start a local Postgres (or point `DATABASE_URL` at any Postgres instance):
   ```bash
   docker run -d --name dsa-journal-db \
     -e POSTGRES_USER=dsa -e POSTGRES_PASSWORD=dsa_dev_password -e POSTGRES_DB=dsa_journal \
     -p 5432:5432 -v dsa-journal-pgdata:/var/lib/postgresql/data postgres:16-alpine
   ```
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` / `APP_PASSCODE`.
3. Install deps, run migrations, seed preset tags:
   ```bash
   npm install
   npx prisma migrate deploy
   npm run db:seed
   ```
4. `npm run dev` and open http://localhost:3000 — log in with `APP_PASSCODE`.

## Deploying

This app needs a real Postgres database and the `DATABASE_URL` / `APP_PASSCODE` env vars set
wherever it's hosted (e.g. Vercel + Neon/Supabase Postgres). Run `npx prisma migrate deploy`
against the production database before first boot, then `npm run db:seed` once to populate
preset tags.
