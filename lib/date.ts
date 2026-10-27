export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function daysAgo(n: number): Date {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d
}

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function todayWeekday(): string {
  // JS: 0 = Sunday
  const idx = (new Date().getDay() + 6) % 7
  return WEEKDAYS[idx]
}

export function parseMinutes(duration: string): number {
  const n = parseInt(duration, 10)
  if (Number.isNaN(n)) return 20
  return /h/i.test(duration) ? n * 60 : n
}
