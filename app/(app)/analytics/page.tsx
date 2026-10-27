"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { skillGrowthData } from "@/lib/skills"
import { achievements } from "@/lib/user"
import { getCourse } from "@/lib/courses"
import { dateKey, daysAgo } from "@/lib/date"
import { getIcon } from "@/lib/icon-map"
import { pathStatuses } from "@/lib/store"
import {
  completedCourseCount,
  courseProgress,
  currentStreak,
  enrolledIds,
  last7Days,
  overallScore,
  useStore,
  weekHours,
} from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { tintClasses } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const chartTooltip = { borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }
const heat = ["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/65", "bg-primary"]

export default function AnalyticsPage() {
  const { state } = useStore()
  const streak = currentStreak(state.activity)
  const score = overallScore(state)

  const growth = skillGrowthData.map((d, i, arr) => (i === arr.length - 1 ? { ...d, score } : d))
  const quizSeries = state.quizzes.slice(-8).map((q, i) => ({
    name: `#${state.quizzes.length - Math.min(8, state.quizzes.length) + i + 1}`,
    accuracy: Math.round((q.score / q.total) * 100),
  }))

  const courseRows = enrolledIds(state).map((id) => ({ id, name: getCourse(id)?.title ?? id, value: courseProgress(state, id) }))

  // heatmap: 17 weeks x 7 days ending today
  const weeks = Array.from({ length: 17 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = daysAgo(17 * 7 - 1 - (w * 7 + d))
      const mins = state.activity[dateKey(date)] ?? 0
      return { date, mins, level: mins === 0 ? 0 : Math.min(4, Math.ceil(mins / 30)) }
    }),
  )

  // insights
  const first = quizSeries[0]?.accuracy
  const lastQ = quizSeries[quizSeries.length - 1]?.accuracy
  const delta = first !== undefined && lastQ !== undefined ? lastQ - first : 0
  const dayTotals: Record<string, number> = {}
  for (let i = 0; i < 28; i++) {
    const d = daysAgo(i)
    const name = d.toLocaleDateString("en-US", { weekday: "long" })
    dayTotals[name] = (dayTotals[name] ?? 0) + (state.activity[dateKey(d)] ?? 0)
  }
  const bestDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0]
  const path = pathStatuses(state)
  const pathPct = Math.round(path.reduce((s, m) => s + m.progress, 0) / path.length)

  const insights = [
    { icon: "flame", tint: "orange", text: `Your learning streak is ${streak} day${streak === 1 ? "" : "s"}.` },
    { icon: "trending-up", tint: "green", text: delta >= 0 ? `Your quiz accuracy is up ${delta}% since your earlier attempts.` : `Your quiz accuracy is down ${Math.abs(delta)}% — revisit weak topics.` },
    { icon: "clock", tint: "cyan", text: bestDay ? `${bestDay} is your most active study day lately.` : "Start logging study time to see patterns." },
    { icon: "target", tint: "primary", text: `You are ${pathPct}% of the way through your learning path.` },
  ]

  const quizzes80 = state.quizzes.filter((q) => q.score / q.total >= 0.8).length
  const tagSet = new Set<string>(state.profile.skills)
  enrolledIds(state).forEach((id) => getCourse(id)?.tags.forEach((t) => tagSet.add(t)))
  const unlocked: Record<string, boolean> = {
    a1: completedCourseCount(state) >= 1,
    a2: streak >= 7,
    a3: quizzes80 >= 5,
    a4: tagSet.size >= 10,
    a5: streak >= 30,
    a6: path.every((m) => m.progress >= 100),
  }

  const stats = [
    { label: "Study time (7 days)", value: `${weekHours(state.activity)} h` },
    { label: "Current streak", value: `${streak} days` },
    { label: "Quizzes taken", value: String(state.quizzes.length) },
    { label: "Skill score", value: `${score}/100` },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Progress analytics" description="Track your study time, streaks, quiz accuracy and skill growth." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study hours — last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days(state.activity)}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                  <Tooltip contentStyle={chartTooltip} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="hours" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skill score growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growth}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} width={28} />
                  <Tooltip contentStyle={chartTooltip} />
                  <Line type="monotone" dataKey="score" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quiz accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizSeries}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} width={28} />
                  <Tooltip contentStyle={chartTooltip} formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="accuracy" stroke="var(--chart-4)" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseRows.length === 0 && <p className="text-sm text-muted-foreground">Enroll in a course to see progress here.</p>}
            {courseRows.map((c) => (
              <div key={c.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <ProgressBar value={c.value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study streak calendar</CardTitle>
          <span className="text-xs text-muted-foreground">Last 17 weeks</span>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    title={`${cell.date.toLocaleDateString()}: ${cell.mins} min`}
                    className={cn("size-4 rounded-sm", heat[cell.level])}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            Less {heat.map((h) => <span key={h} className={cn("size-3 rounded-sm", h)} />)} More
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((i) => {
              const Icon = getIcon(i.icon)
              return (
                <div key={i.text} className="flex items-center gap-3">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", tintClasses[i.tint as keyof typeof tintClasses])}>
                    <Icon className="size-4" />
                  </span>
                  <p className="text-sm">{i.text}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {achievements.map((a) => {
              const Icon = getIcon(a.icon)
              const on = unlocked[a.id]
              return (
                <div key={a.id} className={cn("flex items-center gap-3 rounded-xl border border-border p-3", !on && "opacity-50")}>
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", on ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
