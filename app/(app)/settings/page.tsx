"use client"

import Link from "next/link"
import { Download, Monitor, Moon, RotateCcw, Sun } from "lucide-react"
import { useStore, type Prefs, type Theme } from "@/lib/store"
import { Button, ButtonLink } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const themes: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
]

const prefRows: { key: keyof Prefs; title: string; text: string }[] = [
  { key: "emailReminders", title: "Study reminders", text: "Remind me about tasks planned for today." },
  { key: "streakAlerts", title: "Streak alerts", text: "Alert me before my streak is at risk." },
  { key: "weeklyReport", title: "Weekly progress report", text: "Summary of study time, quizzes and skills." },
  { key: "productUpdates", title: "Product updates", text: "News about new LearnWise features." },
]

export default function SettingsPage() {
  const { state, setTheme, setPref, resetAll } = useStore()
  const { toast } = useToast()

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "learnwise-data.json"
    a.click()
    URL.revokeObjectURL(url)
    toast("Your data was exported")
  }

  const reset = () => {
    if (!window.confirm("Reset all progress, quizzes, plans and settings to the defaults? This can’t be undone.")) return
    resetAll()
    toast("All data reset", "info")
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Appearance, notifications and your data." />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme">
            {themes.map((t) => (
              <button
                key={t.id}
                role="radio"
                aria-checked={state.theme === t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                  state.theme === t.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50",
                )}
              >
                <t.icon className="size-5" />
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {prefRows.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.text}</p>
              </div>
              <Switch label={r.title} checked={state.prefs[r.key]} onChange={(v) => setPref(r.key, v)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account & data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Everything is stored in this browser only. Edit your details in <Link href="/profile" className="font-medium text-primary hover:underline">Profile</Link>.
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/onboarding" variant="outline">
              Redo onboarding
            </ButtonLink>
            <Button variant="outline" onClick={exportData}>
              <Download className="size-4" /> Export my data
            </Button>
            <Button variant="destructive" onClick={reset}>
              <RotateCcw className="size-4" /> Reset all data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
