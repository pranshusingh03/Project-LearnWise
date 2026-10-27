"use client"

import * as React from "react"
import Link from "next/link"
import { Bookmark, Sparkles, X } from "lucide-react"
import { courses } from "@/lib/courses"
import { recommendationFactors, recommendations as staticRecs, topRecommendation } from "@/lib/learning-path"
import { getIcon } from "@/lib/icon-map"
import { courseProgress, useStore, weakestSkills } from "@/lib/store"
import type { Course } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonLink } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress"
import { PageHeader, EmptyState } from "@/components/ui/page-header"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const SKILL_TO_COURSES: Record<string, string[]> = {
  Trees: ["dsa-java"],
  Graphs: ["dsa-java"],
  "Linked Lists": ["dsa-java"],
  Backend: ["spring-boot"],
  JavaScript: ["react-guide"],
  React: ["react-guide"],
  Python: ["python-master", "ml-intro"],
}

const INTEREST_TO_CATEGORY: Record<string, string[]> = {
  "Web Development": ["Web Development"],
  "Machine Learning": ["Artificial Intelligence"],
  "Artificial Intelligence": ["Artificial Intelligence"],
  "Data Science": ["Data Science"],
  "Backend Development": ["Web Development"],
  Cybersecurity: ["Cybersecurity"],
  "Cloud Computing": ["Cloud Computing"],
}

export default function RecommendationsPage() {
  const { state, enroll, toggleBookmark } = useStore()
  const { toast } = useToast()
  const [dismissed, setDismissed] = React.useState<string[]>([])

  const weak = weakestSkills(state, 4).map((s) => s.name)

  const ranked = courses
    .map((c) => {
      let score = c.match ?? 60
      const reasons: string[] = []
      const gapHit = weak.find((w) => SKILL_TO_COURSES[w]?.includes(c.id))
      if (gapHit) {
        score += 6
        reasons.push(`Targets your weak area: ${gapHit}.`)
      }
      const interestHit = state.profile.interests.find((i) => INTEREST_TO_CATEGORY[i]?.includes(c.category))
      if (interestHit) {
        score += 4
        reasons.push(`Matches your interest in ${interestHit}.`)
      }
      if (c.difficulty === state.profile.skillLevel) {
        score += 2
        reasons.push(`Fits your ${state.profile.skillLevel.toLowerCase()} level.`)
      }
      const fallback = staticRecs.find((r) => r.id === c.id)?.reason
      if (reasons.length === 0 && fallback) reasons.push(fallback)
      if (reasons.length === 0) reasons.push(`Popular with learners aiming for ${state.profile.goal.toLowerCase()}.`)
      return { course: c, score: Math.min(99, score), reason: reasons.join(" ") }
    })
    .filter((r) => courseProgress(state, r.course.id) < 100 && !dismissed.includes(r.course.id))
    .sort((a, b) => b.score - a.score)

  const [top, ...rest] = ranked
  const factors = recommendationFactors.map((f) => ({ ...f }))

  const onEnroll = (c: Course) => {
    enroll(c.id)
    toast(`Enrolled in ${c.title}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="AI recommendations" description="Ranked using your goal, interests, level and current skill gaps. They update as your scores change." />

      {!top ? (
        <EmptyState title="No recommendations left" description="You’ve dismissed or finished everything. Reload to start fresh.">
          <Button variant="outline" onClick={() => setDismissed([])}>
            Show all again
          </Button>
        </EmptyState>
      ) : (
        <Card className="border-primary/30 bg-linear-to-br from-primary/10 to-secondary/10">
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex-1">
              <Badge tint="primary" className="mb-3">
                <Sparkles className="size-3.5" /> Top pick · {top.score}% match
              </Badge>
              <h2 className="font-display text-2xl font-bold">{top.course.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {top.course.instructor} · {top.course.duration} · {top.course.difficulty} · ★ {top.course.rating}
              </p>
              <p className="mt-3 max-w-2xl text-sm">
                {top.course.id === topRecommendation.id ? topRecommendation.reason : top.reason}
              </p>
            </div>
            <div className="flex gap-2 md:flex-col">
              {top.course.id in state.lessons ? (
                <ButtonLink href={`/courses/${top.course.id}`}>Continue course</ButtonLink>
              ) : (
                <Button onClick={() => onEnroll(top.course)}>Enroll now</Button>
              )}
              <ButtonLink href={`/courses/${top.course.id}`} variant="outline">
                View details
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {factors.map((f) => {
          const Icon = getIcon(f.icon)
          return (
            <Card key={f.label}>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" />
                  <p className="text-sm font-semibold">{f.label}</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{f.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <ProgressBar value={f.weight} className="h-1.5" />
                  <span className="text-xs font-medium">{f.weight}%</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">More for you</h2>
        <div className="space-y-3">
          {rest.map(({ course, score, reason }) => {
            const saved = state.bookmarks.includes(course.id)
            const enrolled = course.id in state.lessons
            return (
              <Card key={course.id}>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className={cn("hidden size-14 shrink-0 rounded-xl bg-linear-to-br sm:block", course.gradient)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/courses/${course.id}`} className="font-display font-semibold hover:text-primary">
                        {course.title}
                      </Link>
                      <Badge tint="primary">{score}% match</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {course.instructor} · {course.duration} · {course.difficulty} · ★ {course.rating}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {enrolled ? (
                      <ButtonLink href={`/courses/${course.id}`} size="sm" variant="soft">
                        Continue
                      </ButtonLink>
                    ) : (
                      <Button size="sm" onClick={() => onEnroll(course)}>
                        Enroll
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={saved ? "Remove bookmark" : "Bookmark"}
                      onClick={() => toggleBookmark(course.id)}
                    >
                      <Bookmark className={cn("size-4", saved && "fill-current text-primary")} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Not interested"
                      onClick={() => {
                        setDismissed((d) => [...d, course.id])
                        toast("We’ll hide this recommendation", "info")
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
