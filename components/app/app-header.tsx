"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Menu, Moon, Search, Sun, X, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react"
import { SidebarNav } from "@/components/app/sidebar-nav"
import { useStore } from "@/lib/store"
import { courses } from "@/lib/courses"
import { buildNotifications } from "@/lib/notifications"
import { navItems } from "@/lib/nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [ref, onOutside])
}

export function AppHeader() {
  const router = useRouter()
  const { state, ready, setTheme, markNotifsRead } = useStore()
  const [drawer, setDrawer] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [notifOpen, setNotifOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)

  const searchRef = React.useRef<HTMLDivElement>(null)
  const notifRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  useClickOutside(searchRef, () => setSearchOpen(false))
  useClickOutside(notifRef, () => setNotifOpen(false))
  useClickOutside(menuRef, () => setMenuOpen(false))

  const q = query.trim().toLowerCase()
  const courseHits = q
    ? courses
        .filter((c) => [c.title, c.instructor, c.category, ...c.tags].some((t) => t.toLowerCase().includes(q)))
        .slice(0, 5)
    : []
  const pageHits = q ? navItems.filter((n) => n.label.toLowerCase().includes(q)).slice(0, 3) : []

  // date-dependent, so only after the browser has hydrated (avoids server/client mismatch)
  const notifications = ready ? buildNotifications(state) : []
  const unread = notifications.filter((n) => !state.notifsRead.includes(n.id))
  const isDark = state.theme === "dark"

  const go = (href: string) => {
    setQuery("")
    setSearchOpen(false)
    router.push(href)
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}>
          <Menu className="size-5" />
        </Button>

        <div ref={searchRef} className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && courseHits[0]) go(`/courses/${courseHits[0].id}`)
              if (e.key === "Escape") setSearchOpen(false)
            }}
            placeholder="Search courses, topics, pages…"
            aria-label="Search"
            className="h-10 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
          />
          {searchOpen && q && (
            <div className="absolute top-12 left-0 z-50 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
              {courseHits.length === 0 && pageHits.length === 0 && (
                <p className="px-4 py-3 text-sm text-muted-foreground">No results for “{query}”</p>
              )}
              {courseHits.map((c) => (
                <button
                  key={c.id}
                  onClick={() => go(`/courses/${c.id}`)}
                  className="flex w-full flex-col px-4 py-2.5 text-left hover:bg-muted"
                >
                  <span className="text-sm font-medium">{c.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.category} · {c.instructor}
                  </span>
                </button>
              ))}
              {pageHits.map((n) => (
                <button key={n.href} onClick={() => go(n.href)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted">
                  <n.icon className="size-4 text-muted-foreground" /> {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <div ref={notifRef} className="relative">
            <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setNotifOpen((o) => !o)}>
              <Bell className="size-5" />
              {unread.length > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                  {unread.length}
                </span>
              )}
            </Button>
            {notifOpen && (
              <div className="absolute top-11 right-0 z-50 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unread.length > 0 && (
                    <button
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => markNotifsRead(notifications.map((n) => n.id))}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted-foreground">You’re all caught up.</p>}
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markNotifsRead([n.id])
                      setNotifOpen(false)
                      router.push(n.href)
                    }}
                    className={cn("flex w-full flex-col px-4 py-3 text-left hover:bg-muted", !state.notifsRead.includes(n.id) && "bg-primary/5")}
                  >
                    <span className="text-sm font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.body}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Account menu"
              className="ml-1 flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-ring"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.profile.avatar} alt="" className="size-9 rounded-full border border-border object-cover" />
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-sm font-medium">{state.profile.name}</span>
                <span className="block text-xs text-muted-foreground">{state.profile.role}</span>
              </span>
            </button>
            {menuOpen && (
              <div className="absolute top-12 right-0 z-50 w-52 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg">
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                  <UserIcon className="size-4" /> Profile
                </Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                  <SettingsIcon className="size-4" /> Settings
                </Link>
                <Link href="/" className="flex items-center gap-2 border-t border-border px-4 py-2.5 text-sm hover:bg-muted">
                  <LogOut className="size-4" /> Back to home
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar shadow-xl">
            <Button variant="ghost" size="icon" aria-label="Close menu" className="absolute top-3 right-3" onClick={() => setDrawer(false)}>
              <X className="size-5" />
            </Button>
            <SidebarNav onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}
    </>
  )
}

