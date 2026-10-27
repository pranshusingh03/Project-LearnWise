# LearnWise AI

Personalized learning app (Next.js App Router + Tailwind v4 + Recharts).
All progress is saved in your browser (localStorage) — no backend or API keys needed.

## Run

```bash
pnpm install      # or: npm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

## What works

| Page | Features |
|---|---|
| `/` Landing | Nav, sections, skill chips link to course search |
| `/onboarding` | 6-step setup (goal, interests, level, style, time, assessment) → saves profile + tunes skill scores |
| `/dashboard` | Live stats (streak, weekly hours, courses, skill score), continue learning, tick today's tasks, weekly chart |
| `/learning-path` | Module progress, unlock logic, links to courses, log study sessions |
| `/recommendations` | Ranked by your weak skills, interests and level; enroll, bookmark, dismiss |
| `/skill-analysis` | Radar + skill bars that update from quizzes |
| `/courses`, `/courses/[id]` | Search, category/difficulty filters, sort, bookmarks; enroll, per-lesson tracking, progress |
| `/quiz` | 10 questions, scoring, per-topic results, answer review, history; updates skills |
| `/study-plan` | Add/delete/tick tasks per day, "Generate with AI" from weak areas, reset |
| `/analytics` | Charts, streak calendar, insights, achievements (all computed from your data) |
| `/assistant` | Context-aware chat (explains topics, next steps, progress, builds a plan you can add to Study Plan) |
| `/profile`, `/settings` | Edit profile/skills/interests, theme (light/dark/system), notification toggles, export / reset data |

Header: global search, notifications, dark-mode toggle, account menu, mobile drawer.

## Notes

- Your original upload was a flattened export containing only the data files (`lib/*`), `layout.tsx` and `page.tsx`.
  The data files are kept as the source of truth; all pages/components were rebuilt around them.
- The AI assistant is rule-based (offline). To use a real LLM, replace `respond()` in `lib/assistant-engine.ts`
  with a call to your API route.
- Reset demo data any time from Settings → Reset all data.

## Lesson videos

Lessons play YouTube videos through `components/app/lesson-player.tsx`.
The video for each course is configured in `lib/videos.ts` — change the `id` to swap a video.
