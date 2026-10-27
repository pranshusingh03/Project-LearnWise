import type { AppState } from "@/lib/store"
import { currentStreak, weakestSkills, courseProgress, enrolledIds } from "@/lib/store"
import { getCourse } from "@/lib/courses"
import { todayWeekday } from "@/lib/date"

export interface Notification {
  id: string
  title: string
  body: string
  href: string
}

export function buildNotifications(state: AppState): Notification[] {
  const out: Notification[] = []
  const today = todayWeekday()
  const pending = (state.plan[today] ?? []).filter((t) => !t.done)
  if (pending.length > 0) {
    out.push({
      id: `tasks-${today}-${pending.length}`,
      title: `${pending.length} task${pending.length > 1 ? "s" : ""} left today`,
      body: pending[0].title + (pending.length > 1 ? ` and ${pending.length - 1} more` : ""),
      href: "/study-plan",
    })
  }
  const streak = currentStreak(state.activity)
  if (streak >= 3) {
    out.push({ id: `streak-${streak}`, title: `${streak}-day streak`, body: "Keep it going — study a little today.", href: "/analytics" })
  }
  const weak = weakestSkills(state, 1)[0]
  if (weak) {
    out.push({
      id: `weak-${weak.name}-${weak.value}`,
      title: `Focus area: ${weak.name}`,
      body: `Your score is ${weak.value}%. Take a quiz or follow a recommended course.`,
      href: "/recommendations",
    })
  }
  const inProgress = enrolledIds(state).find((id) => {
    const p = courseProgress(state, id)
    return p > 0 && p < 100
  })
  if (inProgress) {
    const c = getCourse(inProgress)
    if (c) {
      out.push({
        id: `continue-${inProgress}-${courseProgress(state, inProgress)}`,
        title: "Pick up where you left off",
        body: `${c.title} is ${courseProgress(state, inProgress)}% complete.`,
        href: `/courses/${inProgress}`,
      })
    }
  }
  return out
}
