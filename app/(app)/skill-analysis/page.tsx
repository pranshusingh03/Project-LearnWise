"use client"

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { skillGroups } from "@/lib/skills"
import { overallScore, radarScores, strongestSkills, useStore, weakestSkills } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonLink } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { cn } from "@/lib/utils"

function level(v: number) {
  if (v >= 80) return { label: "Strong", cls: "text-success" }
  if (v >= 60) return { label: "Good", cls: "text-primary" }
  if (v >= 45) return { label: "Developing", cls: "text-orange-500" }
  return { label: "Needs work", cls: "text-destructive" }
}

export default function SkillAnalysisPage() {
  const { state } = useStore()
  const score = overallScore(state)
  const radar = radarScores(state)
  const strong = strongestSkills(state, 3)
  const weak = weakestSkills(state, 3)
  const circumference = 2 * Math.PI * 52

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill analysis"
        description="Your current skill levels versus your target. Scores update when you take quizzes."
        actions={<ButtonLink href="/quiz">Take a quiz</ButtonLink>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overall score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative size-36">
              <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - score / 100)}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold">{score}</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Goal: <span className="font-medium text-foreground">{state.profile.goal}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills vs. target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="75%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="category" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Target" dataKey="target" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.12} strokeDasharray="4 4" />
                  <Radar name="You" dataKey="score" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((g) => (
          <Card key={g.category}>
            <CardHeader>
              <CardTitle>{g.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {g.skills.map((s) => {
                const v = state.skills[s.name] ?? s.value
                const l = level(v)
                return (
                  <div key={s.name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className={cn("text-xs font-medium", l.cls)}>
                        {v}% · {l.label}
                      </span>
                    </div>
                    <ProgressBar value={v} />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strong.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg bg-success/10 px-4 py-3 text-sm">
                <span className="font-medium">Strong in {s.name}</span>
                <span className="text-success">{s.value}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Areas to improve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weak.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg bg-orange-500/10 px-4 py-3 text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-orange-600 dark:text-orange-300">{s.value}%</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <ButtonLink href="/recommendations" size="sm" variant="soft">
                See courses
              </ButtonLink>
              <ButtonLink href="/study-plan" size="sm" variant="outline">
                Plan practice
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
