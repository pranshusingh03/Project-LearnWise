"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { learningGoals, interestOptions, learningStyles, studyTimes } from "@/lib/onboarding"
import { achievements } from "@/lib/user"
import { getIcon } from "@/lib/icon-map"
import { currentStreak, overallScore, useStore, completedCourseCount } from "@/lib/store"
import type { Difficulty, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input, Label, Select } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/components/ui/toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { state, setProfile } = useStore()
  const { toast } = useToast()
  const [form, setForm] = React.useState<User>(state.profile)
  const [newSkill, setNewSkill] = React.useState("")

  const set = <K extends keyof User>(k: K, v: User[K]) => setForm((f) => ({ ...f, [k]: v }))
  const dirty = JSON.stringify(form) !== JSON.stringify(state.profile)

  const goalOptions = Array.from(new Set([form.goal, "Software Engineering Internship", ...learningGoals.map((g) => g.label)]))
  const styleOptions = Array.from(new Set([form.learningStyle, ...learningStyles.map((s) => s.label)]))
  const timeOptions = Array.from(new Set([form.weeklyTime, ...studyTimes.map((t) => t.label)]))

  const addSkill = () => {
    const s = newSkill.trim()
    if (!s || form.skills.some((x) => x.toLowerCase() === s.toLowerCase())) return
    set("skills", [...form.skills, s])
    setNewSkill("")
  }

  const save = () => {
    if (!form.name.trim()) {
      toast("Name can’t be empty", "info")
      return
    }
    setProfile({ ...form, name: form.name.trim() })
    toast("Profile saved")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your details shape your recommendations and study plan."
        actions={
          <>
            <Button variant="outline" disabled={!dirty} onClick={() => setForm(state.profile)}>
              Discard
            </Button>
            <Button disabled={!dirty} onClick={save}>
              Save changes
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={state.profile.avatar} alt="" className="size-24 rounded-full border border-border object-cover" />
            <p className="mt-3 font-display text-lg font-bold">{state.profile.name}</p>
            <p className="text-sm text-muted-foreground">{state.profile.role}</p>
            <p className="text-sm text-muted-foreground">{state.profile.email}</p>
            <div className="mt-5 grid w-full grid-cols-3 gap-2 text-center">
              {[
                { l: "Streak", v: `${currentStreak(state.activity)}d` },
                { l: "Courses", v: String(completedCourseCount(state)) },
                { l: "Score", v: String(overallScore(state)) },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-muted p-2">
                  <p className="font-display font-bold">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="p-role">Role</Label>
              <Input id="p-role" value={form.role} onChange={(e) => set("role", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-email">Email</Label>
              <Input id="p-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-goal">Learning goal</Label>
              <Select id="p-goal" value={form.goal} onChange={(e) => set("goal", e.target.value)}>
                {goalOptions.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="p-level">Skill level</Label>
              <Select id="p-level" value={form.skillLevel} onChange={(e) => set("skillLevel", e.target.value as Difficulty)}>
                {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="p-style">Learning style</Label>
              <Select id="p-style" value={form.learningStyle} onChange={(e) => set("learningStyle", e.target.value)}>
                {styleOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-time">Weekly study time</Label>
              <Select id="p-time" value={form.weeklyTime} onChange={(e) => set("weeklyTime", e.target.value)}>
                {timeOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <Badge key={s} tint="primary" className="gap-1.5 py-1 pl-3">
                  {s}
                  <button aria-label={`Remove ${s}`} onClick={() => set("skills", form.skills.filter((x) => x !== s))} className="rounded-full hover:bg-primary/20">
                    <X className="size-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                addSkill()
              }}
            >
              <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill" aria-label="New skill" />
              <Button type="submit" variant="soft" disabled={!newSkill.trim()}>
                <Plus className="size-4" /> Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...form.interests, ...interestOptions.map((i) => i.label)])).map((i) => {
                const on = form.interests.includes(i)
                return (
                  <button
                    key={i}
                    aria-pressed={on}
                    onClick={() => set("interests", on ? form.interests.filter((x) => x !== i) : [...form.interests, i])}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                    )}
                  >
                    {i}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const Icon = getIcon(a.icon)
            return (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
