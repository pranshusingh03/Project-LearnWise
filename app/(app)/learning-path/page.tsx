"use client"

import Link from "next/link"
import { Check, Lock, Play, Flag, Clock, Plus } from "lucide-react"
import { learningPath } from "@/lib/learning-path"
import { pathStatuses, useStore } from "@/lib/store"
import { courseProgress } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tint } from "@/components/ui/badge"
import { Button, ButtonLink } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

// Path modules that map onto a real course (progress comes from lessons completed).
const MODULE_COURSE: Record<number, string> = { 3: "java-collections", 4: "dsa-java", 7: "spring-boot" }

const statusTint: Record<string, Tint> = {
  Completed: "green",
  "In Progress": "primary",
  "Recommended Next": "cyan",
  Locked: "muted",
  Upcoming: "muted",
  "Final Goal": "orange",
}

export default function LearningPathPage() {
  const { state, logPathProgress } = useStore()
  const { toast } = useToast()
  const modules = pathStatuses(state).map((m) => {
    const courseId = MODULE_COURSE[m.id]
    const linked = courseId && courseId in state.lessons
    const progress = linked ? courseProgress(state, courseId) : m.progress
    const status = linked ? (progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : m.status) : m.status
    return { ...m, courseId, progress, status }
  })
  const completed = modules.filter((m) => m.progress >= 100).length
  const overall = Math.round(modules.reduce((s, m) => s + m.progress, 0) / modules.length)

  return (
    <div>
      <PageHeader
        title="Learning path"
        description={`Your personalized roadmap to: ${state.profile.goal}.`}
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium">Overall path progress</span>
              <span className="text-muted-foreground">
                {completed}/{learningPath.length} modules · {overall}%
              </span>
            </div>
            <ProgressBar value={overall} />
          </div>
        </CardContent>
      </Card>

      <ol className="relative space-y-4 border-l-2 border-border pl-6 md:pl-8">
        {modules.map((m) => {
          const done = m.progress >= 100
          const locked = !m.available && !done
          const Icon = done ? Check : locked ? Lock : m.status === "Final Goal" ? Flag : Play
          return (
            <li key={m.id} className="relative">
              <span
                className={cn(
                  "absolute top-5 -left-[2.1rem] flex size-8 items-center justify-center rounded-full border-2 md:-left-[2.6rem]",
                  done
                    ? "border-success bg-success text-success-foreground"
                    : locked
                      ? "border-border bg-muted text-muted-foreground"
                      : "border-primary bg-card text-primary",
                )}
              >
                <Icon className="size-4" />
              </span>
              <Card className={cn(locked && "opacity-70")}>
                <CardContent>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Module {m.id}</p>
                      <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                    </div>
                    <Badge tint={statusTint[m.status]}>{locked && m.status !== "Upcoming" && m.status !== "Final Goal" ? "Locked" : m.status}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{m.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <Badge>{m.difficulty}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {m.duration}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <ProgressBar value={m.progress} className="flex-1" />
                    <span className="w-10 text-right text-sm font-medium">{m.progress}%</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.courseId ? (
                      <ButtonLink href={`/courses/${m.courseId}`} size="sm" variant={done ? "outline" : "primary"} className={locked ? "pointer-events-none opacity-50" : ""}>
                        {done ? "Review course" : m.progress > 0 ? "Continue" : "Start course"}
                      </ButtonLink>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          disabled={locked || done}
                          onClick={() => {
                            logPathProgress(m.id, 20)
                            toast(`Logged progress on ${m.title}`)
                          }}
                        >
                          <Plus className="size-3.5" /> {done ? "Completed" : "Log study session (+20%)"}
                        </Button>
                        {m.progress > 0 && (
                          <Button size="sm" variant="ghost" onClick={() => logPathProgress(m.id, -20)}>
                            Undo
                          </Button>
                        )}
                      </>
                    )}
                    {locked && (
                      <span className="self-center text-xs text-muted-foreground">Finish earlier modules to unlock.</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">
        Need help choosing what to do next? <Link href="/assistant" className="font-medium text-primary hover:underline">Ask the AI assistant</Link>.
      </p>
    </div>
  )
}
