import * as React from "react"
import { cn } from "@/lib/utils"

export type Tint = "primary" | "secondary" | "cyan" | "green" | "orange" | "red" | "muted"

export const tintClasses: Record<Tint, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  cyan: "bg-accent/15 text-cyan-700 dark:text-cyan-300",
  green: "bg-success/15 text-emerald-700 dark:text-emerald-300",
  orange: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  red: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
}

export function tintOf(name: string): Tint {
  return (name in tintClasses ? name : "primary") as Tint
}

export function Badge({ tint = "muted", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tint?: Tint }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tintClasses[tint], className)}
      {...props}
    />
  )
}
