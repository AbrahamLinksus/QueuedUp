# Feature Ideas

---

## 1. Web Push Notifications

**Status:** Built, not yet deployed.

### How it works
- Service worker already registered in the app
- VAPID keys generated, stored as env vars
- `PushSubscription` model stores per-device endpoint + keys
- `/api/push/subscribe` — saves/removes a device subscription
- `/api/cron/push-reviews` — Vercel cron runs daily at 8AM UTC, finds users with due reviews, sends push
- `PushSubscribeButton` component on the Review page — user taps once to allow

### User flow
1. Go to /review
2. Tap "Enable notifications"
3. Browser asks permission → allow
4. Every day at 8AM UTC, get a push: "You have N reviews due today"
5. Tap notification → opens /review directly

### Works on
- Android (home screen install)
- Desktop Chrome / Firefox
- iOS 16.4+ Safari (must add to home screen)

---

## 2. Problem Recommendation Engine

**Status:** Theorized, not built.

### Core idea
Problems across 13 DSA topics aren't equally connected — they form a prerequisite DAG. The engine uses this graph to recommend what to study next so progression feels natural, not random.

### Prerequisite DAG
```
Arrays
├── Hashing
├── String
├── Sorting
├── Linked List
│   ├── Stack
│   └── Queue
│       └── Trees
│           ├── Traversal (DFS/BFS)
│           │   └── Graph
│           └── Backtracking
│               └── Dynamic Programming
└── Recursion
    ├── Trees
    ├── Backtracking
    └── Dynamic Programming
```

Arrays → Stack is 2 hops. Arrays → DP is 4-5 hops. The engine will never recommend DP while you're still in Arrays.

### Readiness score (per topic)
```
score = (avg prerequisite coverage %) × 0.6
      + (1 - your current coverage %) × 0.4
```
Topics with all prerequisites covered AND a big coverage gap rank highest.

### Two modes
- **Deepen** — below coverage threshold in current topic (< ~10 problems) → keep recommending same topic
- **Broaden** — threshold hit + good mastery rate → unlock next tier in graph, recommend from there

### Coverage threshold
~10 problems per topic with mastery rate factored in to unlock the next tier.

### Output page: /recommend
- Visual map of all 13 topics with coverage bars
- 3–5 specific problems surfaced from the sheet based on current position in the graph
- Shows which topics are locked, unlocked, and complete

---

## 3. Leaderboard

**Status:** Idea stage.

### Core idea
A public-facing page visible to everyone (no login required) showing all users ranked by their activity and progress. Creates accountability and motivation.

### Ideas for ranking / columns
- Problems mastered
- Current streak
- Total problems logged
- Reviews completed
- Mastery % (mastered / total)

### Notes
- Should be opt-in or always visible? TBD
- Anonymous mode? Show username vs initials? TBD
- Could rank by different metrics with tabs (Most Mastered / Longest Streak / Most Active)
