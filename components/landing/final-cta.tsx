import { ButtonLink } from "@/components/ui/button"
import { Logo } from "@/components/app/logo"

export function FinalCta() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="rounded-3xl bg-linear-to-br from-primary to-secondary p-10 text-center text-primary-foreground shadow-xl md:p-14">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Ready to build your path?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Set your goal, find your gaps and start learning with a plan that fits your week.
          </p>
          <ButtonLink href="/onboarding" size="lg" variant="outline" className="mt-7 border-transparent bg-white text-primary hover:bg-white/90">
            Get started free
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground md:flex-row md:px-8">
        <Logo />
        <p>© {new Date().getFullYear()} LearnWise AI. Built for learners.</p>
      </div>
    </footer>
  )
}
