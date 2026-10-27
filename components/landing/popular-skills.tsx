import Link from "next/link"
import { popularSkills } from "@/lib/skills"

export function PopularSkills() {
  return (
    <section id="skills" className="scroll-mt-16 bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Popular skills to learn</h2>
        <p className="mt-3 text-muted-foreground">Click a skill to search matching courses.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {popularSkills.map((s) => (
            <Link
              key={s}
              href={`/courses?q=${encodeURIComponent(s.split(" ")[0])}`}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:border-primary hover:text-primary"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
