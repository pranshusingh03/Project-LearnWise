"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react"
import { quizQuestions, quizTitle } from "@/lib/quiz"
import { useStore, type QuizAttempt } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

type Phase = "intro" | "running" | "results"

function feedbackFor(topics: Record<string, { correct: number; total: number }>): string {
  const rows = Object.entries(topics).map(([topic, r]) => ({ topic, pct: Math.round((r.correct / r.total) * 100) }))
  const strong = rows.filter((r) => r.pct >= 80).map((r) => r.topic)
  const weak = rows.filter((r) => r.pct < 60).map((r) => r.topic)
  const parts: string[] = []
  if (strong.length) parts.push(`Great performance in ${strong.join(", ")}.`)
  if (weak.length) parts.push(`Focus on ${weak.join(", ")} before moving to advanced topics.`)
  if (!strong.length && !weak.length) parts.push("Solid, balanced results — keep practicing to push every topic above 80%.")
  if (!weak.length && strong.length) parts.push("No weak topics this time. Try a harder course next.")
  return parts.join(" ")
}

export default function QuizPage() {
  const { state, saveQuiz } = useStore()
  const { toast } = useToast()
  const [phase, setPhase] = React.useState<Phase>("intro")
  const [index, setIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<(number | null)[]>(() => quizQuestions.map(() => null))
  const [result, setResult] = React.useState<QuizAttempt | null>(null)

  const q = quizQuestions[index]
  const answered = answers.filter((a) => a !== null).length
  const history = [...state.quizzes].reverse().slice(0, 6)
  const best = state.quizzes.reduce((m, a) => Math.max(m, Math.round((a.score / a.total) * 100)), 0)

  const start = () => {
    setAnswers(quizQuestions.map(() => null))
    setIndex(0)
    setResult(null)
    setPhase("running")
  }

  const submit = () => {
    const topics: QuizAttempt["topics"] = {}
    let score = 0
    quizQuestions.forEach((question, i) => {
      const t = (topics[question.topic] ??= { correct: 0, total: 0 })
      t.total += 1
      if (answers[i] === question.answer) {
        t.correct += 1
        score += 1
      }
    })
    const attempt: QuizAttempt = {
      id: `q-${Date.now()}`,
      date: new Date().toISOString(),
      score,
      total: quizQuestions.length,
      topics,
    }
    saveQuiz(attempt)
    setResult(attempt)
    setPhase("results")
    toast("Quiz saved — your skill scores were updated")
  }

  if (phase === "intro") {
    return (
      <div>
        <PageHeader title="Smart quiz" description="Test yourself, find weak topics and update your skill scores." />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="space-y-4">
              <h2 className="font-display text-xl font-bold">{quizTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {quizQuestions.length} multiple-choice questions on searching, arrays, linked lists, stacks, trees, graphs,
                hashing and sorting. Your results update the matching skill scores.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(quizQuestions.map((x) => x.topic))).map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <Button size="lg" onClick={start}>
                Start quiz <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your history</CardTitle>
              <span className="text-xs text-muted-foreground">Best: {best}%</span>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((h) => {
                const pct = Math.round((h.score / h.total) * 100)
                return (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{new Date(h.date).toLocaleDateString()}</span>
                    <span className={cn("font-medium", pct >= 80 ? "text-success" : pct >= 60 ? "text-primary" : "text-orange-500")}>
                      {h.score}/{h.total} · {pct}%
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (phase === "running") {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title={quizTitle} />
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
          <span>
            Question {index + 1} of {quizQuestions.length}
          </span>
          <span>{answered} answered</span>
        </div>
        <ProgressBar value={((index + 1) / quizQuestions.length) * 100} />
        <Card className="mt-6">
          <CardContent className="space-y-5">
            <Badge tint="primary">{q.topic}</Badge>
            <h2 className="font-display text-xl font-semibold">{q.question}</h2>
            <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
              {q.options.map((opt, i) => {
                const selected = answers[index] === i
                return (
                  <button
                    key={opt}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setAnswers((a) => a.map((v, idx) => (idx === index ? i : v)))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors",
                      selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
                <ArrowLeft className="size-4" /> Previous
              </Button>
              {index < quizQuestions.length - 1 ? (
                <Button disabled={answers[index] === null} onClick={() => setIndex((i) => i + 1)}>
                  Next <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button disabled={answered < quizQuestions.length} onClick={submit}>
                  Submit quiz <Check className="size-4" />
                </Button>
              )}
            </div>
            {index === quizQuestions.length - 1 && answered < quizQuestions.length && (
              <p className="text-xs text-muted-foreground">Answer every question to submit.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // results
  const r = result!
  const pct = Math.round((r.score / r.total) * 100)
  const topicRows = Object.entries(r.topics)
    .map(([topic, t]) => ({ topic, pct: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => b.pct - a.pct)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz results"
        actions={
          <Button onClick={start}>
            <RotateCcw className="size-4" /> Retake quiz
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">Your score</p>
            <p className="font-display text-5xl font-bold">
              {r.score}
              <span className="text-xl text-muted-foreground">/{r.total}</span>
            </p>
            <p className={cn("mt-1 font-medium", pct >= 80 ? "text-success" : pct >= 60 ? "text-primary" : "text-orange-500")}>{pct}%</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance by topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topicRows.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{t.topic}</span>
                  <span className="text-muted-foreground">{t.pct}%</span>
                </div>
                <ProgressBar value={t.pct} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent>
          <p className="text-sm font-semibold text-primary">AI feedback</p>
          <p className="mt-1 text-sm">{feedbackFor(r.topics)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quizQuestions.map((question, i) => {
            const mine = answers[i]
            const ok = mine === question.answer
            return (
              <div key={question.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white", ok ? "bg-success" : "bg-destructive")}>
                    {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium">{question.question}</p>
                    <p className="mt-1 text-muted-foreground">
                      Your answer: {mine !== null ? question.options[mine] : "—"}
                      {!ok && <span className="text-success"> · Correct: {question.options[question.answer]}</span>}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
