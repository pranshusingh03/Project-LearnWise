"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { courseCategories, courses } from "@/lib/courses"
import { useStore } from "@/lib/store"
import { CourseCard } from "@/components/app/course-card"
import { Input, Select } from "@/components/ui/input"
import { PageHeader, EmptyState } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const

function CoursesInner() {
  const params = useSearchParams()
  const { state } = useStore()
  const [q, setQ] = React.useState(params.get("q") ?? "")
  const [category, setCategory] = React.useState("All")
  const [difficulty, setDifficulty] = React.useState<(typeof difficulties)[number]>("All")
  const [sort, setSort] = React.useState("match")
  const [onlySaved, setOnlySaved] = React.useState(false)

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = courses.filter((c) => {
      if (category !== "All" && c.category !== category) return false
      if (difficulty !== "All" && c.difficulty !== difficulty) return false
      if (onlySaved && !state.bookmarks.includes(c.id)) return false
      if (!needle) return true
      return [c.title, c.instructor, c.category, c.description, ...c.tags].some((t) => t.toLowerCase().includes(needle))
    })
    return [...list].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating
      if (sort === "popular") return b.students - a.students
      if (sort === "title") return a.title.localeCompare(b.title)
      return (b.match ?? 0) - (a.match ?? 0)
    })
  }, [q, category, difficulty, sort, onlySaved, state.bookmarks])

  const reset = () => {
    setQ("")
    setCategory("All")
    setDifficulty("All")
    setOnlySaved(false)
  }

  return (
    <div>
      <PageHeader title="Explore courses" description="Search, filter and bookmark courses. Open one to enroll and track lessons." />

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, topic or instructor" className="pl-9" aria-label="Search courses" />
        </div>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort courses" className="md:w-48">
          <option value="match">Best match</option>
          <option value="rating">Highest rated</option>
          <option value="popular">Most popular</option>
          <option value="title">Title (A–Z)</option>
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...courseCategories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            aria-pressed={difficulty === d}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              difficulty === d ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => setOnlySaved((v) => !v)}
          aria-pressed={onlySaved}
          className={cn(
            "ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors",
            onlySaved ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          Bookmarked only
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No courses match your filters" description="Try a different keyword or clear the filters.">
          <Button variant="outline" onClick={reset}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{filtered.length} course{filtered.length !== 1 && "s"}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function CoursesPage() {
  // useSearchParams needs a Suspense boundary for static rendering
  return (
    <React.Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted" />}>
      <CoursesInner />
    </React.Suspense>
  )
}
