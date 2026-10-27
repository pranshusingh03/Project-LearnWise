"use client"

import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Bookmark, Check, ChevronDown, Clock, Play, PlayCircle, Star, Users } from "lucide-react"
import { getCourse, learningOutcomes } from "@/lib/courses"
import { allLessonKeys, getModules } from "@/lib/curriculum"
import { courseProgress, useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress"
import { useToast } from "@/components/ui/toast"
import { LessonPlayer } from "@/components/app/lesson-player"
import { cn } from "@/lib/utils"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const course = getCourse(id)
  if (!course) notFound()

  const { state, enroll, unenroll, toggleLesson, toggleBookmark } = useStore()
  const { toast } = useToast()
  const [open, setOpen] = React.useState<number | null>(null)
  const [current, setCurrent] = React.useState<string | null>(null) // lesson key being watched
  const playerTop = React.useRef<HTMLDivElement>(null)

  const modules = getModules(course.id)
  const keys = allLessonKeys(course.id)
  const enrolled = course.id in state.lessons
  const done = state.lessons[course.id] ?? []
  const progress = courseProgress(state, course.id)
  const total = keys.length
  const saved = state.bookmarks.includes(course.id)

  const nextUnfinished = keys.find((k) => !done.includes(k)) ?? keys[0]

  const play = (key: string) => {
    if (!enrolled) {
      enroll(course.id)
      toast(`Enrolled in ${course.title}`)
    }
    setCurrent(key)
    setOpen(Number(key.split("-")[0]))
    requestAnimationFrame(() => playerTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  // open the first unfinished module by default
  React.useEffect(() => {
    const idx = modules.findIndex((m, mi) => Array.from({ length: m.lessons }, (_, li) => `${mi}-${li}`).some((k) => !done.includes(k)))
    setOpen(idx === -1 ? 0 : idx)
    setCurrent(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id])

  // /courses/<id>?play=1 (from the course cards) starts the next lesson straight away
  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get("play")) play(nextUnfinished)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id])

  const currentIndex = current ? keys.indexOf(current) : -1
  const currentModule = current ? modules[Number(current.split("-")[0])] : null
  const currentLesson = current ? Number(current.split("-")[1]) : 0

  const goTo = (i: number) => {
    const k = keys[i]
    if (k) {
      setCurrent(k)
      setOpen(Number(k.split("-")[0]))
    }
  }

  const markDone = (key: string) => {
    if (!done.includes(key)) {
      toggleLesson(course.id, key)
      toast("Lesson completed")
    }
  }

  return (
    <div>
      <Link href="/courses" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All courses
      </Link>

      <div className={cn("rounded-3xl bg-linear-to-br p-6 text-white md:p-10", course.gradient)}>
        <Badge className="bg-white/20 text-white">{course.category}</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-white/90">{course.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
          <span>By {course.instructor}</span>
          <span className="flex items-center gap-1"><Star className="size-4 fill-amber-300 text-amber-300" /> {course.rating}</span>
          <span className="flex items-center gap-1"><Users className="size-4" /> {course.students.toLocaleString()} students</span>
          <span className="flex items-center gap-1"><Clock className="size-4" /> {course.duration}</span>
          <span>{total} lessons</span>
          <span>{course.difficulty}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div ref={playerTop} className="scroll-mt-24">
            {current && currentModule ? (
              <LessonPlayer
                courseId={course.id}
                courseTitle={course.title}
                index={currentIndex}
                total={total}
                moduleTitle={currentModule.title}
                lessonTitle={`Lesson ${currentLesson + 1}`}
                completed={done.includes(current)}
                onToggleComplete={() => toggleLesson(course.id, current)}
                onEnded={() => {
                  markDone(current)
                  if (currentIndex < total - 1) goTo(currentIndex + 1)
                }}
                onPrev={currentIndex > 0 ? () => goTo(currentIndex - 1) : undefined}
                onNext={currentIndex < total - 1 ? () => goTo(currentIndex + 1) : undefined}
              />
            ) : (
              <button
                onClick={() => play(nextUnfinished)}
                aria-label="Start watching"
                className={cn(
                  "group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br text-white shadow-sm",
                  course.gradient,
                )}
              >
                <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                <span className="relative flex flex-col items-center gap-3">
                  <span className="flex size-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform group-hover:scale-105">
                    <Play className="size-9 translate-x-0.5 fill-current" />
                  </span>
                  <span className="font-display text-lg font-semibold">
                    {done.length > 0 ? "Continue watching" : "Start watching"}
                  </span>
                </span>
              </button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
              <span className="text-sm text-muted-foreground">{done.length}/{total} lessons</span>
            </CardHeader>
            <CardContent className="space-y-2">
              {!enrolled && (
                <p className="mb-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">Pick any lesson to start watching — you’ll be enrolled automatically.</p>
              )}
              {modules.map((m, mi) => {
                const mKeys = Array.from({ length: m.lessons }, (_, li) => `${mi}-${li}`)
                const completed = mKeys.filter((k) => done.includes(k)).length
                const status = completed === m.lessons ? "Completed" : completed > 0 ? "In Progress" : "Not Started"
                const isOpen = open === mi
                return (
                  <div key={mi} className="overflow-hidden rounded-xl border border-border">
                    <button
                      onClick={() => setOpen(isOpen ? null : mi)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          status === "Completed" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {status === "Completed" ? <Check className="size-4" /> : mi + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{m.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.lessons} lessons · {m.duration}
                        </span>
                      </span>
                      <Badge tint={status === "Completed" ? "green" : status === "In Progress" ? "primary" : "muted"}>{status}</Badge>
                      <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <ul className="divide-y divide-border border-t border-border">
                        {mKeys.map((k, li) => {
                          const isDone = done.includes(k)
                          const isCurrent = current === k
                          return (
                            <li key={k} className={cn("flex items-center", isCurrent && "bg-primary/5")}>
                              <button
                                onClick={() => {
                                  if (!enrolled) {
                                    enroll(course.id)
                                    toast(`Enrolled in ${course.title}`)
                                  }
                                  toggleLesson(course.id, k)
                                }}
                                aria-label={isDone ? `Mark lesson ${li + 1} not done` : `Mark lesson ${li + 1} done`}
                                aria-pressed={isDone}
                                className="flex shrink-0 items-center py-2.5 pr-1 pl-4"
                              >
                                <span
                                  className={cn(
                                    "flex size-5 items-center justify-center rounded-md border",
                                    isDone ? "border-success bg-success text-success-foreground" : "border-muted-foreground/40",
                                  )}
                                >
                                  {isDone && <Check className="size-3.5" />}
                                </span>
                              </button>
                              <button
                                onClick={() => play(k)}
                                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted/50"
                              >
                                <span className={cn("flex-1", isDone && "text-muted-foreground", isCurrent && "font-medium text-primary")}>
                                  Lesson {li + 1}
                                </span>
                                <span className={cn("flex items-center gap-1 text-xs", isCurrent ? "text-primary" : "text-muted-foreground")}>
                                  <PlayCircle className="size-4" /> {isCurrent ? "Now playing" : "Play"}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What you’ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {(course.id === "dsa-java" ? learningOutcomes : course.tags).map((o) => (
                  <li key={o} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-success" /> {o}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="space-y-4">
              {enrolled ? (
                <>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{progress >= 100 ? "Course completed 🎉" : "Your progress"}</span>
                      <span>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                  <Button className="w-full" onClick={() => play(nextUnfinished)}>
                    <PlayCircle className="size-4" /> {progress >= 100 ? "Watch again" : progress === 0 ? "Start course" : "Continue learning"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive"
                    onClick={() => {
                      unenroll(course.id)
                      setCurrent(null)
                      toast("Unenrolled from course", "info")
                    }}
                  >
                    Unenroll
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" size="lg" onClick={() => play(keys[0])}>
                    <PlayCircle className="size-4" /> Enroll &amp; start watching
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">Free · progress is saved as you watch</p>
                </>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toggleBookmark(course.id)
                  toast(saved ? "Bookmark removed" : "Course bookmarked", "info")
                }}
              >
                <Bookmark className={cn("size-4", saved && "fill-current")} /> {saved ? "Bookmarked" : "Bookmark"}
              </Button>
              <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                {course.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
