import { ArrowRight, Sparkles, Flame, Target } from "lucide-react"
import { ButtonLink } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> AI-personalized learning
          </span>
          <h1 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
            Learn what matters, <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">faster.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            LearnWise AI builds a learning path around your goal, finds your skill gaps with smart quizzes, and keeps you on
            track with a study plan that adapts as you grow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/onboarding" size="lg">
              Start free <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/dashboard" size="lg" variant="outline">
              View demo dashboard
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold">Your learning path</p>
            <span className="flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-medium text-orange-600 dark:text-orange-300">
              <Flame className="size-3.5" /> 12 day streak
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {[
              { t: "Java Collections", p: 70 },
              { t: "Data Structures & Algorithms", p: 45 },
              { t: "React Fundamentals", p: 25 },
            ].map((x) => (
              <div key={x.t}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{x.t}</span>
                  <span className="text-muted-foreground">{x.p}%</span>
                </div>
                <ProgressBar value={x.p} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
            <Target className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm">
              <span className="font-semibold">AI tip:</span> Focus on Trees & Graphs next — they’re your biggest gap for
              interviews.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
