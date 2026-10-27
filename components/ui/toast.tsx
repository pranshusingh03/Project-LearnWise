"use client"

import * as React from "react"
import { CheckCircle2, Info } from "lucide-react"

interface ToastItem {
  id: number
  message: string
  kind: "success" | "info"
}

const ToastContext = React.createContext<{ toast: (message: string, kind?: "success" | "info") => void }>({
  toast: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((message: string, kind: "success" | "info" = "success") => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, message, kind }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2"
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="size-4 text-success" />
            ) : (
              <Info className="size-4 text-primary" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
