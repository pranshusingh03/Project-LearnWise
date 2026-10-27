import { curriculum } from "@/lib/courses"
import { getCourse } from "@/lib/courses"

export interface ModuleDef {
  title: string
  lessons: number
  duration: string
}

function parseMinutes(d: string): number {
  const h = /(\d+)h/.exec(d)
  const m = /(\d+)m/.exec(d)
  return (h ? parseInt(h[1], 10) * 60 : 0) + (m ? parseInt(m[1], 10) : 0)
}

function fmt(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`
}

export function getModules(courseId: string): ModuleDef[] {
  if (courseId === "dsa-java") {
    return curriculum.map((c) => ({ title: c.title, lessons: c.lessons, duration: c.duration }))
  }
  const course = getCourse(courseId)
  if (!course) return []
  const titles = [
    "Getting Started",
    ...course.tags.slice(0, 3).map((t) => `Working with ${t}`),
    "Capstone Project",
  ]
  const n = titles.length
  const base = Math.floor(course.lessons / n)
  const extra = course.lessons - base * n
  const totalMins = parseMinutes(course.duration)
  return titles.map((title, i) => {
    const lessons = base + (i < extra ? 1 : 0)
    return { title, lessons, duration: fmt(Math.round((totalMins * lessons) / course.lessons)) }
  })
}

export function totalLessons(courseId: string): number {
  return getModules(courseId).reduce((s, m) => s + m.lessons, 0)
}

export function allLessonKeys(courseId: string): string[] {
  const keys: string[] = []
  getModules(courseId).forEach((m, mi) => {
    for (let li = 0; li < m.lessons; li++) keys.push(`${mi}-${li}`)
  })
  return keys
}

export function seedLessons(courseId: string, progress: number): string[] {
  const keys = allLessonKeys(courseId)
  return keys.slice(0, Math.round((progress / 100) * keys.length))
}
