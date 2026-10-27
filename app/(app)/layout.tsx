import type React from "react"
import { AppHeader } from "@/components/app/app-header"
import { SidebarNav } from "@/components/app/sidebar-nav"
import { ReadyGate } from "@/components/app/ready-gate"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar md:block">
        <SidebarNav />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <AppHeader />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <ReadyGate>{children}</ReadyGate>
          </div>
        </main>
      </div>
    </div>
  )
}
