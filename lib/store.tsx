"use client"

import * as React from "react"
import type { User, StudyTask } from "@/lib/types"
import { currentUser } from "@/lib/user"
import { continueLearning } from "@/lib/courses"
import { initialStudyPlan, streakCalendar, weeklyActivity } from "@/lib/analytics"
import { radarData, skillGroups } from "@/lib/skills"
import { initialMessages } from "@/lib/assistant"
import { learningPath } from "@/lib/learning-path"
import { allLessonKeys, seedLessons } from "@/lib/curriculum"
import { dateKey, daysAgo, parseMinutes } from "@/lib/date"

export type Theme = "light" | "dark" | "system"

export interface ChatMsg {
  id: string
  role: "user" | "assistant"
  content: string
  planSuggestion?: Record<string, StudyTask[]>
}

export interface QuizAttempt {
  id: string
  date: string
  score: number
  total: number
  topics: Record<string, { correct: number; total: number }>
}

export interface Prefs {
  emailReminders: boolean
  weeklyReport: boolean
  streakAlerts: boolean
  productUpdates: boolean
}

export interface AppState {
  profile: User
  onboarded: boolean
  theme: Theme
  lessons: Record<string, string[]>
  bookmarks: string[]
  pathProgress: Record<number, number>
  skills: Record<string, number>
  quizzes: QuizAttempt[]
  plan: Record<string, StudyTask[]>
  activity: Record<string, number>
  chat: ChatMsg[]
  prefs: Prefs
  notifsRead: string[]
}

const STORAGE_KEY = "learnwise-state-v1"
const THEME_KEY = "learnwise-theme"

export const BASE_COMPLETED_COURSES = 6

function seedSkills(): Record<string, number> {
  const s: Record<string, number> = {}
  skillGroups.forEach((g) => g.skills.forEach((k) => (s[k.name] = k.value)))
  return s
}

function seedActivity(): Record<string, number> {
  const out: Record<string, number> = {}
  const flat = streakCalendar.flat()
  flat.forEach((v, i) => {
    const d = daysAgo(flat.length - 1 - i)
    out[dateKey(d)] = v * 25
  })
  weeklyActivity.forEach((w, i) => {
    out[dateKey(daysAgo(6 - i))] = Math.round(w.hours * 60)
  })
  // 12-day streak exactly
  for (let i = 0; i < 12; i++) {
    const k = dateKey(daysAgo(i))
    if (!out[k]) out[k] = 30
  }
  out[dateKey(daysAgo(12))] = 0
  return out
}

function seedQuizzes(): QuizAttempt[] {
  const scores = [6, 7, 8, 8, 9]
  return scores.map((score, i) => ({
    id: `seed-${i}`,
    date: daysAgo(35 - i * 7).toISOString(),
    score,
    total: 10,
    topics: {
      Arrays: { correct: 1, total: 1 },
      "Linked Lists": { correct: 1, total: 1 },
      Trees: { correct: i > 2 ? 1 : 0, total: 2 },
      Graphs: { correct: i > 3 ? 1 : 0, total: 2 },
    },
  }))
}

function initialState(): AppState {
  const lessons: Record<string, string[]> = {}
  continueLearning.forEach((c) => (lessons[c.id] = seedLessons(c.id, c.progress)))
  const pathProgress: Record<number, number> = {}
  learningPath.forEach((m) => (pathProgress[m.id] = m.progress))
  return {
    profile: currentUser,
    onboarded: false,
    theme: "light",
    lessons,
    bookmarks: [],
    pathProgress,
    skills: seedSkills(),
    quizzes: seedQuizzes(),
    plan: JSON.parse(JSON.stringify(initialStudyPlan)),
    activity: seedActivity(),
    chat: initialMessages.map((m, i) => ({ id: `init-${i}`, ...m })),
    prefs: { emailReminders: true, weeklyReport: true, streakAlerts: true, productUpdates: false },
    notifsRead: [],
  }
}

/* ---------- derived helpers ---------- */

export function currentStreak(activity: Record<string, number>): number {
  let streak = 0
  let i = activity[dateKey(daysAgo(0))] > 0 ? 0 : 1
  while (activity[dateKey(daysAgo(i))] > 0) {
    streak++
    i++
  }
  return streak
}

export function last7Days(activity: Record<string, number>) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = daysAgo(6 - i)
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      hours: Math.round(((activity[dateKey(d)] ?? 0) / 60) * 10) / 10,
    }
  })
}

export function weekHours(activity: Record<string, number>): number {
  return Math.round(last7Days(activity).reduce((s, d) => s + d.hours, 0) * 10) / 10
}

export function courseProgress(state: AppState, courseId: string): number {
  const done = state.lessons[courseId]
  if (!done) return 0
  const total = allLessonKeys(courseId).length
  return total === 0 ? 0 : Math.round((done.length / total) * 100)
}

export function enrolledIds(state: AppState): string[] {
  return Object.keys(state.lessons)
}

export function completedCourseCount(state: AppState): number {
  return BASE_COMPLETED_COURSES + enrolledIds(state).filter((id) => courseProgress(state, id) >= 100).length
}

const SEED_RADAR_AVG = radarData.reduce((s, r) => s + r.score, 0) / radarData.length

export function radarScores(state: AppState) {
  const avg = (names: string[]) => Math.round(names.reduce((s, n) => s + (state.skills[n] ?? 0), 0) / names.length)
  return radarData.map((r) => {
    if (r.category === "Data Structures") return { ...r, score: avg(["Arrays", "Linked Lists", "Trees", "Graphs"]) }
    if (r.category === "Web Dev") return { ...r, score: avg(["HTML/CSS", "React", "Backend"]) }
    return r
  })
}

export function overallScore(state: AppState): number {
  const rs = radarScores(state)
  const avg = rs.reduce((s, r) => s + r.score, 0) / rs.length
  return Math.max(0, Math.min(100, Math.round(78 + (avg - SEED_RADAR_AVG))))
}

export function weakestSkills(state: AppState, n = 3): { name: string; value: number }[] {
  return Object.entries(state.skills)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.value - b.value)
    .slice(0, n)
}

export function strongestSkills(state: AppState, n = 3): { name: string; value: number }[] {
  return Object.entries(state.skills)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n)
}

export function pathStatuses(state: AppState) {
  const firstIncomplete = learningPath.findIndex((m) => (state.pathProgress[m.id] ?? 0) < 100)
  return learningPath.map((m, idx) => {
    const progress = state.pathProgress[m.id] ?? 0
    let status = m.status
    if (progress >= 100) status = "Completed"
    else if (progress > 0) status = "In Progress"
    else if (idx === firstIncomplete) status = "Recommended Next"
    else if (m.status === "Upcoming" || m.status === "Final Goal") status = m.status
    else status = "Locked"
    const available = firstIncomplete === -1 || idx <= firstIncomplete + 1
    return { ...m, progress, status, available }
  })
}

/* ---------- context ---------- */

interface Ctx {
  state: AppState
  ready: boolean
  update: (fn: (s: AppState) => AppState) => void
  addActivity: (minutes: number) => void
  enroll: (courseId: string) => void
  unenroll: (courseId: string) => void
  toggleLesson: (courseId: string, key: string) => void
  completeNextLesson: (courseId: string) => void
  toggleBookmark: (courseId: string) => void
  logPathProgress: (moduleId: number, delta: number) => void
  setProfile: (p: Partial<User>) => void
  completeOnboarding: (p: Partial<User>, skillBoost?: number) => void
  toggleTask: (day: string, id: string) => void
  addTask: (day: string, title: string, duration: string) => void
  deleteTask: (day: string, id: string) => void
  setPlan: (plan: Record<string, StudyTask[]>) => void
  saveQuiz: (attempt: QuizAttempt) => void
  setChat: (fn: (c: ChatMsg[]) => ChatMsg[]) => void
  setTheme: (t: Theme) => void
  setPref: (k: keyof Prefs, v: boolean) => void
  markNotifsRead: (ids: string[]) => void
  resetAll: () => void
}

const StoreContext = React.createContext<Ctx | null>(null)

export function useStore(): Ctx {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>")
  return ctx
}

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(() => initialState())
  const [ready, setReady] = React.useState(false)

  // hydrate from localStorage once on the client
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<AppState>
        setState((s) => ({ ...s, ...saved, prefs: { ...s.prefs, ...(saved.prefs ?? {}) } }))
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true)
  }, [])

  // persist
  React.useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      localStorage.setItem(THEME_KEY, state.theme)
    } catch {
      /* storage full / unavailable */
    }
  }, [state, ready])

  // theme
  React.useEffect(() => {
    if (!ready) return
    applyTheme(state.theme)
    if (state.theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [state.theme, ready])

  const update = React.useCallback((fn: (s: AppState) => AppState) => setState(fn), [])

  const bump = (s: AppState, minutes: number): AppState => {
    const k = dateKey(new Date())
    return { ...s, activity: { ...s.activity, [k]: Math.max(0, (s.activity[k] ?? 0) + minutes) } }
  }

  const value = React.useMemo<Ctx>(
    () => ({
      state,
      ready,
      update,
      addActivity: (m) => setState((s) => bump(s, m)),
      enroll: (id) =>
        setState((s) => (s.lessons[id] ? s : { ...s, lessons: { ...s.lessons, [id]: [] } })),
      unenroll: (id) =>
        setState((s) => {
          const lessons = { ...s.lessons }
          delete lessons[id]
          return { ...s, lessons }
        }),
      toggleLesson: (id, key) =>
        setState((s) => {
          const cur = s.lessons[id] ?? []
          const has = cur.includes(key)
          const next = has ? cur.filter((k) => k !== key) : [...cur, key]
          return bump({ ...s, lessons: { ...s.lessons, [id]: next } }, has ? -15 : 15)
        }),
      completeNextLesson: (id) =>
        setState((s) => {
          const cur = s.lessons[id] ?? []
          const nextKey = allLessonKeys(id).find((k) => !cur.includes(k))
          if (!nextKey) return s
          return bump({ ...s, lessons: { ...s.lessons, [id]: [...cur, nextKey] } }, 15)
        }),
      toggleBookmark: (id) =>
        setState((s) => ({
          ...s,
          bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id],
        })),
      logPathProgress: (id, delta) =>
        setState((s) =>
          bump(
            {
              ...s,
              pathProgress: { ...s.pathProgress, [id]: Math.max(0, Math.min(100, (s.pathProgress[id] ?? 0) + delta)) },
            },
            delta > 0 ? 20 : 0,
          ),
        ),
      setProfile: (p) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
      completeOnboarding: (p, boost = 0) =>
        setState((s) => {
          const skills = { ...s.skills }
          if (boost) Object.keys(skills).forEach((k) => (skills[k] = Math.max(0, Math.min(100, skills[k] + boost))))
          return { ...s, profile: { ...s.profile, ...p }, onboarded: true, skills }
        }),
      toggleTask: (day, id) =>
        setState((s) => {
          const tasks = s.plan[day] ?? []
          const t = tasks.find((x) => x.id === id)
          if (!t) return s
          const next = { ...s, plan: { ...s.plan, [day]: tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) } }
          return bump(next, (t.done ? -1 : 1) * parseMinutes(t.duration))
        }),
      addTask: (day, title, duration) =>
        setState((s) => ({
          ...s,
          plan: {
            ...s.plan,
            [day]: [...(s.plan[day] ?? []), { id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, duration, done: false }],
          },
        })),
      deleteTask: (day, id) =>
        setState((s) => ({ ...s, plan: { ...s.plan, [day]: (s.plan[day] ?? []).filter((t) => t.id !== id) } })),
      setPlan: (plan) => setState((s) => ({ ...s, plan })),
      saveQuiz: (attempt) =>
        setState((s) => {
          const skills = { ...s.skills }
          Object.entries(attempt.topics).forEach(([topic, r]) => {
            if (topic in skills && r.total > 0) {
              const pct = (r.correct / r.total) * 100
              skills[topic] = Math.round(skills[topic] * 0.6 + pct * 0.4)
            }
          })
          return bump({ ...s, skills, quizzes: [...s.quizzes, attempt] }, 10)
        }),
      setChat: (fn) => setState((s) => ({ ...s, chat: fn(s.chat) })),
      setTheme: (theme) => setState((s) => ({ ...s, theme })),
      setPref: (k, v) => setState((s) => ({ ...s, prefs: { ...s.prefs, [k]: v } })),
      markNotifsRead: (ids) => setState((s) => ({ ...s, notifsRead: Array.from(new Set([...s.notifsRead, ...ids])) })),
      resetAll: () => setState(() => ({ ...initialState(), theme: "light" })),
    }),
    [state, ready, update],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
