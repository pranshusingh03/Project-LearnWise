import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-sm">
        <GraduationCap className="size-5" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">LearnWise AI</span>
    </Link>
  )
}
