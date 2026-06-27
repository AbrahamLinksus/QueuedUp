# QueuedUp

A personal DSA practice journal with spaced-repetition reviews, a 500-problem curated sheet, activity tracking, and web push notifications. Built to make algorithmic interview prep feel systematic rather than random.

> **Live app:** [queuedup.vercel.app](https://queuedup.vercel.app) — multi-user, invite-only registration

---

## Screenshots

| Dashboard | Review queue |
|-----------|-------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Review](docs/screenshots/review.png) |

| Problem log | DSA Sheet |
|-------------|-----------|
| ![Log](docs/screenshots/log.png) | ![Sheet](docs/screenshots/sheet.png) |

> _Replace placeholders above with actual screenshots from `/`, `/review`, `/problems`, and `/sheets`._

---

## Features

### Spaced-repetition review system
When you log a problem, four reviews are automatically scheduled at **+2, +5, +9, and +16 days** from the solve date. Each review is a lightweight prompt — re-solve the problem, then mark it done or skip. After completing all four reviews the problem is promoted to **MASTERED**.

```
Day 0  ──── solve ────► Day 2 ──► Day 5 ──► Day 9 ──► Day 16 ──► MASTERED
```

### Flashcard mode
Mastered problems resurface every **14 days** as flashcards — a quick recall check without re-solving. Keeps knowledge from decaying without the overhead of a full review.

### Problem log (`/problems`)
- Add problems from LeetCode (auto-fetches title + difficulty via the LeetCode GraphQL API) or any other source
- Per-problem notes, code snippets with syntax highlighting, time/space complexity, time taken, and attempt count
- Filter by difficulty, status, platform, or tag
- Topic coverage sidebar showing your distribution across DSA categories

### DSA Sheet (`/sheets`)
A curated bank of **~500 LeetCode problems** organised by topic in prerequisite order (Arrays → Hashing → Strings → Sorting → Linked List → Stack → Queue → Trees → Traversal → Backtracking → Graph → Recursion → Dynamic Programming). Problems you've already logged are automatically greyed out and ticked. Click **+ Log** on any unlogged problem to jump straight to the new-problem form with fields pre-filled.

### Dashboard (`/`)
- **Activity heatmap** — 15 weeks of daily solve history
- **Stat cards** — problems logged, current streak, longest streak, mastered count
- **Difficulty breakdown** — visual bar showing Easy / Medium / Hard split
- **Animated stickman** with rotating motivational quotes when a streak is active

### Review calendar
Monthly calendar on the review page showing which days have scheduled reviews. Click any highlighted day to see which problems are due. Looks ahead 6 months so you can plan your study load.

### Web push notifications
Daily push at **8 AM UTC** if you have reviews due. Works on Android, desktop Chrome/Firefox, and iOS 16.4+ Safari (requires Add to Home Screen). Toggle from the Review page with one tap.

### PWA — installable & offline-capable
The app ships as a Progressive Web App:
- **Cache-first** for all static assets (JS, CSS, images — content-hashed by Next.js)
- **Network-first with cache fallback** for navigation — pages work offline if you've visited them before
- **Offline fallback page** shown when both network and cache fail
- Service worker updates automatically on next visit

### Admin page (`/admin`)
Owner-only dashboard showing per-user statistics: problems logged, mastered count, current streak, skip rate, overdue reviews, difficulty split, top topics, and review activity. Includes two-step user deletion.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router, React 19, Server Components |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | [Motion](https://motion.dev) (Framer Motion v12) |
| ORM | [Prisma 7](https://prisma.io) with `@prisma/adapter-pg` |
| Database | PostgreSQL (Neon serverless) |
| Charts | [Recharts](https://recharts.org) |
| Push | [web-push](https://github.com/web-push-libs/web-push) (VAPID) |
| Hosting | [Vercel](https://vercel.com) (Fluid Compute) |
| Build | Turbopack |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, nav, SW registration
│   ├── page.tsx            # Dashboard (stats, heatmap, stickman)
│   ├── problems/           # Problem CRUD + filter UI
│   │   ├── actions.ts      # Server Actions: create / update / delete
│   │   └── [id]/           # Individual problem page
│   ├── review/             # Spaced-repetition queue + flashcards + calendar
│   ├── sheets/             # 500-problem curated sheet
│   ├── admin/              # Owner-only stats dashboard
│   ├── leaderboard/        # Ranking page (currently hidden from nav)
│   ├── login/              # Session-based auth
│   ├── register/           # User registration (passcode-gated)
│   ├── manifest.ts         # PWA manifest (served at /manifest.webmanifest)
│   └── api/
│       ├── push/subscribe  # Save/remove push subscription
│       └── cron/push-reviews # Daily cron → send push to users with due reviews
├── components/
│   ├── nav.tsx             # Fixed bottom nav bar
│   ├── heatmap.tsx         # GitHub-style activity heatmap
│   ├── stat-card.tsx       # Animated stat card
│   └── push-subscribe.tsx  # "Enable notifications" button
├── lib/
│   ├── auth.ts             # bcrypt password hashing
│   ├── session.ts          # Iron-session cookie auth
│   ├── reviews.ts          # Schedule spaced-repetition reviews on solve
│   ├── flashcards.ts       # Surface mastered problems due for flashcard review
│   ├── stats.ts            # Dashboard stats + streak computation (cached)
│   └── topics.ts           # DSA topic taxonomy + tag → topic mapping
├── generated/prisma/       # Generated Prisma client
└── public/
    ├── sw.js               # Service worker (caching + push handling)
    ├── offline.html        # Offline fallback page
    └── icon-*.png          # PWA icons
prisma/
├── schema.prisma           # Data model
├── seed.ts                 # 500 sheet problems + preset tags
└── migrations/             # SQL migration history
```

### Data model (simplified)

```
User ──< Problem ──< Entry          (solve notes, code, complexity)
                 ──< Review         (scheduled spaced-repetition checkpoints)
                 ──< FlashcardReview (periodic recall checks for mastered problems)
     ──< PushSubscription           (per-device Web Push endpoint)

SheetProblem                        (standalone — 500 curated LeetCode problems)
Tag ──< Problem                     (many-to-many)
```

### Spaced-repetition scheduling

```ts
// lib/reviews.ts
export const REVIEW_DAY_OFFSETS = [2, 5, 9, 16] as const;
// On solve, four Review rows are created with scheduledFor = solvedAt + offset
```

Reviews are fetched on the `/review` page by querying `status: PENDING, scheduledFor <= today`. Completing a review sets `status: DONE, completedAt: now()`. After all four reviews are done, the problem's `status` is set to `MASTERED` and flashcard reviews begin.

### Caching strategy

Server Components use Next.js `"use cache"` + `cacheTag` for user-specific data invalidated on mutation via `revalidateTag`. The static sheet data (500 problems) is cached with a long TTL. The review queue bypasses cache entirely (`connection()` call) since it must always reflect real-time state.

---

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | At least 32-char random string for session cookies |
| `OWNER_USERNAME` | Username that gets access to `/admin` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for web push |
| `VAPID_PRIVATE_KEY` | VAPID private key for web push |
| `VAPID_SUBJECT` | `mailto:` address for VAPID contact |
| `CRON_SECRET` | Bearer token checked by the daily cron endpoint |

Generate VAPID keys: `npx web-push generate-vapid-keys`

---

## Deploying

The app is designed for **Vercel + Neon** (or any serverless Postgres). The `build` script runs migrations and seeds on every deploy so the database is always up to date.

```bash
# One-time: link to Vercel and provision a Postgres database
vercel link
vercel env pull

# Deploy
vercel --prod
```

The Vercel cron (defined in `vercel.json`) fires `/api/cron/push-reviews` daily at 8 AM UTC. Protect it with a `CRON_SECRET` env var — the endpoint checks `Authorization: Bearer <CRON_SECRET>`.
