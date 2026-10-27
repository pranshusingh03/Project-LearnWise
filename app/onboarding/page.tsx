"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import {
  learningGoals,
  interestOptions,
  skillLevels,
  learningStyles,
  studyTimes,
  assessmentQuestions,
} from "@/lib/onboarding"
import { getIcon } from "@/lib/icon-map"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/progress"
import { Logo } from "@/components/app/logo"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/lib/types"

const STEPS = ["About you", "Goal", "Interests", "Level & style", "Time", "Assessment"]

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50",
      )}
    >
      {children}
      {selected && <Check className="ml-auto size-4 text-primary" />}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { state, completeOnboarding, ready } = useStore()
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState("")
  const [role, setRole] = React.useState("Student")
  const [goal, setGoal] = React.useState("")
  const [interests, setInterests] = React.useState<string[]>([])
  const [level, setLevel] = React.useState("")
  const [style, setStyle] = React.useState("")
  const [time, setTime] = React.useState("")
  const [answers, setAnswers] = React.useState<Record<number, number>>({})

  React.useEffect(() => {
    if (ready && !name) setName(state.profile.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const canNext = [
    name.trim().length > 0,
    goal !== "",
    interests.length > 0,
    level !== "" && style !== "",
    time !== "",
    assessmentQuestions.every((q) => answers[q.id] !== undefined),
  ][step]

  const finish = () => {
    // Assessment: average option index (0-3) decides skill level + a small score adjustment.
    const avg = assessmentQuestions.reduce((s, q) => s + (answers[q.id] ?? 0), 0) / assessmentQuestions.length
    const assessed: Difficulty = avg >= 2.4 ? "Advanced" : avg >= 1.2 ? "Intermediate" : "Beginner"
    const chosen = skillLevels.find((l) => l.id === level)?.label as Difficulty | undefined
    const final: Difficulty = chosen ?? assessed
    const boost = Math.round((avg - 1.5) * 4)
    completeOnboarding(
      {
        name: name.trim(),
        role: role.trim() || "Student",
        goal: learningGoals.find((g) => g.id === goal)?.label ?? state.profile.goal,
        interests: interests.map((id) => interestOptions.find((i) => i.id === id)!.label),
        skillLevel: final,
        learningStyle: learningStyles.find((s) => s.id === style)?.label ?? state.profile.learningStyle,
        weeklyTime: studyTimes.find((t) => t.id === time)?.label ?? state.profile.weeklyTime,
      },
      boost,
    )
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Logo />
        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </span>
            <button className="hover:text-foreground" onClick={() => router.push("/dashboard")}>
              Skip
            </button>
          </div>
          <ProgressBar value={((step + 1) / STEPS.length) * 100} />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-bold">Let’s get to know you</h1>
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Arpita" />
              </div>
              <div>
                <Label htmlFor="role">I am a…</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Student" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display text-2xl font-bold">What’s your main learning goal?</h1>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {learningGoals.map((g) => {
                  const Icon = getIcon(g.icon)
                  return (
                    <Choice key={g.id} selected={goal === g.id} onClick={() => setGoal(g.id)}>
                      <Icon className="size-5 text-primary" />
                      <span className="font-medium">{g.label}</span>
                    </Choice>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-2xl font-bold">What are you interested in?</h1>
              <p className="mt-1 text-sm text-muted-foreground">Pick one or more.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {interestOptions.map((i) => {
                  const Icon = getIcon(i.icon)
                  return (
                    <Choice
                      key={i.id}
                      selected={interests.includes(i.id)}
                      onClick={() =>
                        setInterests((cur) => (cur.includes(i.id) ? cur.filter((x) => x !== i.id) : [...cur, i.id]))
                      }
                    >
                      <Icon className="size-5 text-primary" />
                      <span className="font-medium">{i.label}</span>
                    </Choice>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold">Your level</h1>
                <div className="mt-4 grid gap-3">
                  {skillLevels.map((l) => (
                    <Choice key={l.id} selected={level === l.id} onClick={() => setLevel(l.id)}>
                      <div>
                        <p className="font-medium">{l.label}</p>
                        <p className="text-sm text-muted-foreground">{l.description}</p>
                      </div>
                    </Choice>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">How do you learn best?</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {learningStyles.map((s) => {
                    const Icon = getIcon(s.icon)
                    return (
                      <Choice key={s.id} selected={style === s.id} onClick={() => setStyle(s.id)}>
                        <Icon className="size-5 text-primary" />
                        <span className="font-medium">{s.label}</span>
                      </Choice>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="font-display text-2xl font-bold">How much time can you study each week?</h1>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {studyTimes.map((t) => (
                  <Choice key={t.id} selected={time === t.id} onClick={() => setTime(t.id)}>
                    <div>
                      <p className="font-medium">{t.label}</p>
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                    </div>
                  </Choice>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold">Quick skill check</h1>
                <p className="mt-1 text-sm text-muted-foreground">Answer honestly — this tunes your starting scores.</p>
              </div>
              {assessmentQuestions.map((q) => (
                <div key={q.id}>
                  <p className="mb-3 font-medium">{q.question}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {q.options.map((o, idx) => (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={answers[q.id] === idx}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition-colors",
                          answers[q.id] === idx ? "border-primary bg-primary/10 font-medium" : "border-border hover:border-primary/50",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button disabled={!canNext} onClick={finish}>
                Finish setup <Check className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
