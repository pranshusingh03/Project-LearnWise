"use client"

import * as React from "react"
import { Check, Plus, Trash2, Wand2, RotateCcw } from "lucide-react"
import { initialStudyPlan } from "@/lib/analytics"
import { WEEKDAYS, todayWeekday } from "@/lib/date"
import { generatePlan } from "@/lib/planner"
import { useStore, weakestSkills } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const durations = ["15 min", "20 min", "30 min", "45 min", "60 min", "90 min"]

export default function StudyPlanPage() {
  const { state, toggleTask, addTask, deleteTask, setPlan } = useStore()
  const { toast } = useToast()
  const [selected, setSelected] = React.useState(todayWeekday())
  const [title, setTitle] = React.useState("")
  const [duration, setDuration] = React.useState("30 min")

  const all = WEEKDAYS.flatMap((d) => state.plan[d] ?? [])
  const doneAll = all.filter((t) => t.done).length
  const weekPct = all.length ? Math.round((doneAll / all.length) * 100) : 0
  const tasks = state.plan[selected] ?? []

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    addTask(selected, t, duration)
    setTitle("")
    toast(`Added to ${selected}`)
  }

  const regenerate = () => {
    const weak = weakestSkills(state, 3).map((s) => s.name)
    if (!window.confirm(`Replace your current plan with one focused on: ${weak.join(", ")}?`)) return
    setPlan(generatePlan(weak))
    toast("New plan generated from your weak areas")
  }

  const resetDefault = () => {
    if (!window.confirm("Restore the default weekly plan?")) return
    setPlan(JSON.parse(JSON.stringify(initialStudyPlan)))
    toast("Default plan restored", "info")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study plan"
        description="Plan your week, tick tasks off, or let AI build a plan around your weakest skills."
        actions={
          <>
            <Button variant="outline" onClick={resetDefault}>
              <RotateCcw className="size-4" /> Reset
            </Button>
            <Button onClick={regenerate}>
              <Wand2 className="size-4" /> Generate with AI
            </Button>
          </>
        }
      />

      <Card>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">This week</span>
            <span className="text-muted-foreground">
              {doneAll}/{all.length} tasks · {weekPct}%
            </span>
          </div>
          <ProgressBar value={weekPct} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="tablist" aria-label="Days of the week">
        {WEEKDAYS.map((d) => {
          const list = state.plan[d] ?? []
          const done = list.filter((t) => t.done).length
          const isToday = d === todayWeekday()
          return (
            <button
              key={d}
              role="tab"
              aria-selected={selected === d}
              onClick={() => setSelected(d)}
              className={cn(
                "rounded-xl border p-2 text-center transition-colors sm:p-3",
                selected === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50",
              )}
            >
              <span className="block text-xs font-medium sm:text-sm">{d.slice(0, 3)}</span>
              <span className={cn("block text-[10px] sm:text-xs", selected === d ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {done}/{list.length}
              </span>
              {isToday && <span className={cn("mx-auto mt-1 block size-1.5 rounded-full", selected === d ? "bg-white" : "bg-primary")} />}
            </button>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{selected}</CardTitle>
          <span className="text-xs text-muted-foreground">{tasks.length} task{tasks.length !== 1 && "s"}</span>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Nothing planned. Add a task below.</p>}
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <button
                onClick={() => toggleTask(selected, t.id)}
                aria-label={t.done ? `Mark ${t.title} not done` : `Mark ${t.title} done`}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md border",
                  t.done ? "border-success bg-success text-success-foreground" : "border-muted-foreground/40 hover:border-primary",
                )}
              >
                {t.done && <Check className="size-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", t.done && "text-muted-foreground line-through")}>{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.duration}</p>
              </div>
              <Button size="icon" variant="ghost" aria-label={`Delete ${t.title}`} onClick={() => deleteTask(selected, t.id)}>
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}

          <form onSubmit={onAdd} className="flex flex-col gap-2 pt-3 sm:flex-row">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Add a task for ${selected}`} aria-label="New task title" className="flex-1" />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              aria-label="Task duration"
              className="h-10 rounded-lg border border-input bg-card px-3 text-sm"
            >
              {durations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <Button type="submit" disabled={!title.trim()}>
              <Plus className="size-4" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
