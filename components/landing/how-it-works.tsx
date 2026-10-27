const steps = [
  { n: "1", title: "Tell us your goal", text: "Pick your goal, interests, level and weekly time in a 2-minute setup." },
  { n: "2", title: "Take a quick assessment", text: "We estimate your starting level and spot where to focus first." },
  { n: "3", title: "Follow your path", text: "Work through courses, quizzes and a weekly plan — your progress is saved." },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary font-display font-bold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
