import { cn } from "@/lib/utils"

export function ProgressBar({
  value,
  className,
  barClassName,
}: {
  value: number
  className?: string
  barClassName?: string
}) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500", barClassName)}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
