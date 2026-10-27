import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "soft"
type Size = "sm" | "md" | "lg" | "icon"

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
  outline: "border border-border bg-card hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  soft: "bg-primary/10 text-primary hover:bg-primary/15",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9",
}

export function buttonClasses(opts: { variant?: Variant; size?: Size; className?: string } = {}) {
  const { variant = "primary", size = "md", className } = opts
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: Variant
  size?: Size
  className?: string
}

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />
}
