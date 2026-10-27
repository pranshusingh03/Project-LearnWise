"use client"

import Link from "next/link"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { dashboardStats } from "@/lib/analytics"
import { getIcon } from "@/lib/icon-map"
import { getCourse } from "@/lib/courses"
import { topRecommendation } from "@/lib/learning-path"
import {
  completedCourseCount,
  courseProgress,
  currentStreak,
  enrolledIds,
  last7Days,
  overallScore,
  useStore,
  weekHours,
  weakestSkills,
} from "@/lib/store"
import { todayWeekday } from "@/lib/date"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonLink } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress"
import { tintClasses, tintOf } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { state, toggleTask } = useStore()
  const today = todayWeekday()
  const tasks = state.plan[today] ?? []
  const doneCount = tasks.filter((t) => t.done).length

  const values: Record<string, { value: string; unit: string }> = {
    "Learning Streak": { value: String(currentStreak(state.activity)), unit: "Days" },
    "Learning Time": { value: String(weekHours(state.activity)), unit: "Hrs / week" },
    "Courses Completed": { value: String(completedCourseCount(state)), unit: "" },
    "Skill Score": { value: String(overallScore(state)), unit: "/100" },
  }

  const inProgress = enrolledIds(state)
    .map((id) => ({ id, course: getCourse(id), progress: courseProgress(state, id) }))
    .filter((x) => x.course && x.progress < 100)
    .sort((a, b) => b.progress - a.progress)

  const weak = weakestSkills(state, 2).map((s) => s.name)
  const topCourse = getCourse(topRecommendation.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${state.profile.name}`}
        description={`Goal: ${state.profile.goal}. Here’s where you stand today.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((s) => {
          const Icon = getIcon(s.icon)
          const v = values[s.label]
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4">
                <span className={cn("flex size-11 items-center justify-center rounded-xl", tintClasses[tintOf(s.tint)])}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display text-2xl font-bold">
                    {v.value} <span className="text-sm font-medium text-muted-foreground">{v.unit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Continue learning</CardTitle>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
              Browse all
            </Link>
          </CardHeader>
          <CardContent className="space-y-5">
            {inProgress.length === 0 && (
              <p className="text-sm text-muted-foreground">You have no courses in progress. Pick one from Explore Courses.</p>
            )}
            {inProgress.map(({ id, course, progress }) => (
              <div key={id} className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="truncate font-medium">{course!.title}</span>
                    <span className="text-muted-foreground">{progress}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
                <ButtonLink href={`/courses/${id}`} variant="soft" size="sm">
                  Resume
                </ButtonLink>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today’s tasks</CardTitle>
            <span className="text-xs text-muted-foreground">
              {doneCount}/{tasks.length} done
            </span>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.length === 0 && <p className="text-sm text-muted-foreground">Nothing planned for {today}.</p>}
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(today, t.id)}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border",
                    t.done ? "border-success bg-success text-success-foreground" : "border-muted-foreground/40",
                  )}
                >
                  {t.done && <Check className="size-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-sm font-medium", t.done && "text-muted-foreground line-through")}>
                    {t.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.duration}</span>
                </span>
              </button>
            ))}
            <ButtonLink href="/study-plan" variant="ghost" size="sm" className="w-full">
              Open study plan <ArrowRight className="size-3.5" />
            </ButtonLink>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly activity (hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days(state.activity)}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Bar dataKey="hours" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-linear-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> AI recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display font-semibold">{topCourse?.title ?? topRecommendation.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {weak.length > 0
                ? `Your weakest areas right now are ${weak.join(" and ")}. ${topRecommendation.reason}`
                : topRecommendation.reason}
            </p>
            <ButtonLink href={`/courses/${topRecommendation.id}`} className="mt-4 w-full">
              View course
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
