"use client"

import * as React from "react"
import { Bot, Send, Trash2, User as UserIcon } from "lucide-react"
import { initialMessages, suggestedQuestions } from "@/lib/assistant"
import { respond } from "@/lib/assistant-engine"
import { courseProgress, currentStreak, enrolledIds, overallScore, strongestSkills, useStore, weakestSkills } from "@/lib/store"
import { getCourse } from "@/lib/courses"
import { todayWeekday } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export default function AssistantPage() {
  const { state, setChat, setPlan } = useStore()
  const { toast } = useToast()
  const [input, setInput] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [state.chat.length, typing])

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const send = (text: string) => {
    const content = text.trim()
    if (!content || typing) return
    const id = `${Date.now()}`
    setChat((c) => [...c, { id: `u-${id}`, role: "user", content }])
    setInput("")
    setTyping(true)

    const lastQuiz = state.quizzes[state.quizzes.length - 1]
    const reply = respond(content, {
      name: state.profile.name,
      goal: state.profile.goal,
      weak: weakestSkills(state, 3),
      strong: strongestSkills(state, 3),
      streak: currentStreak(state.activity),
      overall: overallScore(state),
      courses: enrolledIds(state).map((cid) => ({ title: getCourse(cid)?.title ?? cid, progress: courseProgress(state, cid) })),
      tasksLeftToday: (state.plan[todayWeekday()] ?? []).filter((t) => !t.done).length,
      lastQuizPct: lastQuiz ? Math.round((lastQuiz.score / lastQuiz.total) * 100) : null,
    })

    timer.current = setTimeout(() => {
      setChat((c) => [...c, { id: `a-${id}`, role: "assistant", content: reply.content, planSuggestion: reply.plan }])
      setTyping(false)
    }, 700)
  }

  const clear = () => {
    setChat(() => initialMessages.map((m, i) => ({ id: `init-${Date.now()}-${i}`, ...m, content: m.content.replace("Arpita", state.profile.name) })))
    toast("Conversation cleared", "info")
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[28rem] flex-col">
      <PageHeader
        title="AI assistant"
        description="Ask what to learn next, get topics explained simply, or generate a study plan."
        actions={
          <Button variant="outline" size="sm" onClick={clear}>
            <Trash2 className="size-4" /> Clear
          </Button>
        }
      />
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6" aria-live="polite">
          {state.chat.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-linear-to-br from-primary to-secondary text-primary-foreground",
                )}
              >
                {m.role === "user" ? <UserIcon className="size-4" /> : <Bot className="size-4" />}
              </span>
              <div className={cn("max-w-[85%] space-y-2", m.role === "user" && "items-end")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                    m.role === "user" ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-muted",
                  )}
                >
                  {m.content}
                </div>
                {m.planSuggestion && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setPlan(m.planSuggestion!)
                      toast("Plan added to your Study Plan")
                    }}
                  >
                    Add to my study plan
                  </Button>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-primary-foreground">
                <Bot className="size-4" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3" aria-label="Assistant is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3 md:p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={typing}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your learning…"
              aria-label="Message"
              className="h-11 flex-1 rounded-lg border border-input bg-card px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
            />
            <Button type="submit" size="lg" disabled={!input.trim() || typing} aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
