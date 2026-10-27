import type { StudyTask } from "@/lib/types"

export const dashboardStats = [
  { icon: "flame", label: "Learning Streak", value: "12", unit: "Days", tint: "orange" },
  { icon: "clock", label: "Learning Time", value: "8.5", unit: "Hours", tint: "cyan" },
  { icon: "book-check", label: "Courses Completed", value: "6", unit: "", tint: "green" },
  { icon: "brain", label: "Skill Score", value: "78", unit: "/100", tint: "primary" },
]

export const weeklyActivity = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.2 },
  { day: "Wed", hours: 0.8 },
  { day: "Thu", hours: 2.6 },
  { day: "Fri", hours: 1.9 },
  { day: "Sat", hours: 3.4 },
  { day: "Sun", hours: 2.1 },
]

export const todayTasks: StudyTask[] = [
  { id: "t1", title: "Complete Java Collections Module", duration: "45 min", done: false },
  { id: "t2", title: "Solve 3 Linked List Problems", duration: "30 min", done: false },
  { id: "t3", title: "Take Arrays Revision Quiz", duration: "20 min", done: false },
]

export const courseProgressAnalytics = [
  { name: "Java Collections", value: 70 },
  { name: "DSA", value: 45 },
  { name: "React", value: 25 },
]

export const analyticsInsights = [
  { icon: "flame", text: "Your learning streak is 12 days.", tint: "orange" },
  { icon: "trending-up", text: "Your quiz accuracy improved by 15%.", tint: "green" },
  { icon: "clock", text: "You learn most consistently during evening hours.", tint: "cyan" },
  { icon: "target", text: "You are 72% closer to your learning goal.", tint: "primary" },
]

// GitHub-style contribution calendar — 17 weeks x 7 days of intensity 0-4
export const streakCalendar: number[][] = Array.from({ length: 17 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const seed = (w * 7 + d) * 2654435761
    const v = (seed % 100) / 100
    if (w > 13) return v > 0.25 ? Math.min(4, Math.floor(v * 5) + 1) : 0
    return v > 0.55 ? Math.floor(v * 5) : 0
  }),
)

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export const initialStudyPlan: Record<string, StudyTask[]> = {
  Monday: [
    { id: "m1", title: "Java Collections", duration: "45 min", done: true },
    { id: "m2", title: "Solve 3 Linked List Problems", duration: "30 min", done: false },
  ],
  Tuesday: [
    { id: "tu1", title: "Learn Binary Trees", duration: "45 min", done: false },
    { id: "tu2", title: "Practice Tree Traversal", duration: "30 min", done: false },
  ],
  Wednesday: [
    { id: "w1", title: "Revision", duration: "40 min", done: false },
    { id: "w2", title: "Take Skill Quiz", duration: "20 min", done: false },
  ],
  Thursday: [{ id: "th1", title: "Graph Algorithms Intro", duration: "50 min", done: false }],
  Friday: [{ id: "f1", title: "Solve 5 Array Problems", duration: "45 min", done: false }],
  Saturday: [{ id: "sa1", title: "Spring Boot Basics", duration: "60 min", done: false }],
  Sunday: [{ id: "su1", title: "Weekly Review", duration: "30 min", done: false }],
}
