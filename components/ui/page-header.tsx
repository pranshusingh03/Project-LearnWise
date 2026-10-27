import * as React from "react"

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="font-display font-semibold">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  )
}
