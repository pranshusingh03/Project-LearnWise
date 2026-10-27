"use client"

import Link from "next/link"
import { Bookmark, Clock, Play, Star, Users } from "lucide-react"
import type { Course } from "@/lib/types"
import { courseProgress, useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"

export function CourseCard({ course }: { course: Course }) {
  const { state, toggleBookmark } = useStore()
  const { toast } = useToast()
  const enrolled = course.id in state.lessons
  const progress = courseProgress(state, course.id)
  const saved = state.bookmarks.includes(course.id)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("relative h-28 bg-linear-to-br", course.gradient)}>
        <span className="absolute bottom-3 left-4 rounded-full bg-black/25 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
          {course.category}
        </span>
        <button
          aria-label={saved ? "Remove bookmark" : "Bookmark course"}
          aria-pressed={saved}
          onClick={() => {
            toggleBookmark(course.id)
            toast(saved ? "Bookmark removed" : "Course bookmarked", "info")
          }}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur hover:bg-black/40"
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </button>
        {course.match && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {course.match}% match
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/courses/${course.id}`} className="font-display font-semibold leading-snug hover:text-primary">
          {course.title}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{course.instructor}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" /> {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {course.students.toLocaleString()}
          </span>
        </div>
        <div className="mt-3">
          <Badge tint={course.difficulty === "Beginner" ? "green" : course.difficulty === "Intermediate" ? "primary" : "orange"}>
            {course.difficulty}
          </Badge>
        </div>
        <div className="mt-auto pt-4">
          {enrolled && (
            <>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">{progress >= 100 ? "Completed" : "In progress"}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </>
          )}
          <div className={cn("flex gap-2", enrolled && "mt-3")}>
            <Link
              href={`/courses/${course.id}?play=1`}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Play className="size-4 fill-current" /> {progress >= 100 ? "Watch again" : enrolled ? "Continue" : "Watch"}
            </Link>
            <Link
              href={`/courses/${course.id}`}
              className="flex h-9 items-center justify-center rounded-lg bg-primary/10 px-3 text-sm font-medium text-primary hover:bg-primary/15"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
