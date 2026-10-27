"use client"

import type React from "react"
import { useStore } from "@/lib/store"

// Avoids a hydration flash: pages render once saved progress is loaded from the browser.
export function ReadyGate({ children }: { children: React.ReactNode }) {
  const { ready } = useStore()
  if (!ready) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }
  return <>{children}</>
}
