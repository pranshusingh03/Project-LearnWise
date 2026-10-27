import { Compass, Sparkles, FileQuestion, CalendarDays, TrendingUp, Bot } from "lucide-react"

const features = [
  { icon: Compass, title: "Personalized learning path", text: "A step-by-step roadmap built around your goal and current level." },
  { icon: Sparkles, title: "AI recommendations", text: "Courses ranked by how well they fit your goal, interests and skill gaps." },
  { icon: FileQuestion, title: "Smart quizzes", text: "Find weak topics fast and watch your skill scores update." },
  { icon: CalendarDays, title: "Adaptive study plan", text: "A weekly plan you can edit, tick off and regenerate from your weak areas." },
  { icon: TrendingUp, title: "Progress analytics", text: "Streaks, study time, quiz accuracy and skill growth in one place." },
  { icon: Bot, title: "AI study assistant", text: "Ask what to learn next, get simple explanations and instant study plans." },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Everything you need to level up</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">One workspace for planning, practicing and tracking your growth.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
