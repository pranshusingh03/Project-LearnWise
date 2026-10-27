"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/app/logo"
import { ProgressBar } from "@/components/ui/progress"
import { overallScore, useStore } from "@/lib/store"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { state } = useStore()
  const score = overallScore(state)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="m-3 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 p-4">
        <p className="text-xs font-medium text-muted-foreground">Skill score</p>
        <p className="font-display text-2xl font-bold">
          {score}
          <span className="text-sm font-medium text-muted-foreground">/100</span>
        </p>
        <ProgressBar value={score} className="mt-2 h-1.5" />
      </div>
    </div>
  )
}
