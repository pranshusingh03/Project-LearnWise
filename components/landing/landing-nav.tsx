"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/app/logo"
import { ButtonLink, Button } from "@/components/ui/button"

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#skills", label: "Skills" },
]

export function LandingNav() {
  const [open, setOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/dashboard" variant="ghost">
            Log in
          </ButtonLink>
          <ButtonLink href="/onboarding">Get started</ButtonLink>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-border px-4 py-3 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
              {l.label}
            </a>
          ))}
          <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
            Log in
          </Link>
          <ButtonLink href="/onboarding" className="mt-2 w-full">
            Get started
          </ButtonLink>
        </div>
      )}
    </header>
  )
}
