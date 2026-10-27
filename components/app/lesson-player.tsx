"use client"

import * as React from "react"
import { Check, ChevronLeft, ChevronRight, ExternalLink, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { lessonStart, videosFor, watchUrl, youtubeSearchUrl } from "@/lib/videos"
import { cn } from "@/lib/utils"

/* eslint-disable @typescript-eslint/no-explicit-any */

let apiPromise: Promise<any> | null = null

/** Loads the YouTube IFrame API once and resolves with window.YT. */
function loadYouTubeApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"))
  const w = window as any
  if (w.YT?.Player) return Promise.resolve(w.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(w.YT)
    }
    const s = document.createElement("script")
    s.src = "https://www.youtube.com/iframe_api"
    s.async = true
    s.onerror = () => {
      apiPromise = null
      reject(new Error("Could not load the YouTube player"))
    }
    document.head.appendChild(s)
  })
  return apiPromise
}

interface LessonPlayerProps {
  courseId: string
  courseTitle: string
  /** 0-based index of the lesson across the whole course */
  index: number
  total: number
  lessonTitle: string
  moduleTitle: string
  completed: boolean
  onToggleComplete: () => void
  /** called when the video reaches its end (used to auto-complete + advance) */
  onEnded: () => void
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

export function LessonPlayer({
  courseId,
  courseTitle,
  index,
  total,
  lessonTitle,
  moduleTitle,
  completed,
  onToggleComplete,
  onEnded,
  onPrev,
  onNext,
  className,
}: LessonPlayerProps) {
  const videos = React.useMemo(() => videosFor(courseId), [courseId])
  const [vi, setVi] = React.useState(0) // which candidate video is in use
  const [status, setStatus] = React.useState<"loading" | "ready" | "failed">("loading")

  const hostRef = React.useRef<HTMLDivElement>(null)
  const playerRef = React.useRef<any>(null)
  const readyRef = React.useRef(false)
  const onEndedRef = React.useRef(onEnded)
  onEndedRef.current = onEnded

  const video = videos[vi]
  const start = video ? lessonStart(video, index, total) : 0

  // keep the latest values reachable from the player's event callbacks
  const viRef = React.useRef(vi)
  viRef.current = vi
  const videosRef = React.useRef(videos)
  videosRef.current = videos

  // new course -> start from the first candidate again
  React.useEffect(() => {
    setVi(0)
    setStatus("loading")
  }, [courseId])

  // create the player once per mount
  React.useEffect(() => {
    let cancelled = false
    const first = videosRef.current[viRef.current]
    if (!first || !hostRef.current) {
      setStatus("failed")
      return
    }
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return
        // YouTube replaces the element it is given, so hand it a throwaway child
        const mount = document.createElement("div")
        hostRef.current.innerHTML = ""
        hostRef.current.appendChild(mount)
        playerRef.current = new YT.Player(mount, {
          width: "100%",
          height: "100%",
          videoId: first.id,
          playerVars: {
            autoplay: 1,
            start: lessonStart(first, index, total),
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: () => {
              readyRef.current = true
              setStatus("ready")
            },
            onStateChange: (e: any) => {
              if (e.data === YT.PlayerState.ENDED) onEndedRef.current()
            },
            onError: () => {
              const next = viRef.current + 1
              if (next < videosRef.current.length) setVi(next)
              else setStatus("failed")
            },
          },
        })
      })
      .catch(() => !cancelled && setStatus("failed"))

    return () => {
      cancelled = true
      readyRef.current = false
      try {
        playerRef.current?.destroy()
      } catch {
        /* already gone */
      }
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // switch lesson / fallback video without rebuilding the player
  const first = React.useRef(true)
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!video || !readyRef.current || !playerRef.current) return
    setStatus("ready")
    try {
      playerRef.current.loadVideoById({ videoId: video.id, startSeconds: start })
    } catch {
      setStatus("failed")
    }
  }, [video?.id, start]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-sm", className)}>
      <div className="relative aspect-video w-full bg-black">
        <div ref={hostRef} className="absolute inset-0 [&>iframe]:size-full" />
        {status === "loading" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/70">
            Loading video…
          </div>
        )}
        {status === "failed" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black p-6 text-center text-white">
            <VideoOff className="size-10 text-white/70" />
            <p className="max-w-sm text-sm text-white/80">
              This video couldn’t be loaded. Check your internet connection, or watch it on YouTube instead.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {video && (
                <a
                  href={watchUrl(video, start)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-medium text-black"
                >
                  <ExternalLink className="size-4" /> Open on YouTube
                </a>
              )}
              <a
                href={youtubeSearchUrl(courseId)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/30 px-3 text-sm font-medium text-white"
              >
                Search for this course
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            {courseTitle} · {moduleTitle}
          </p>
          <h2 className="font-display truncate text-lg font-semibold">{lessonTitle}</h2>
          {video && (
            <p className="truncate text-xs text-muted-foreground">
              {video.title} · {video.channel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrev} disabled={!onPrev} aria-label="Previous lesson">
            <ChevronLeft className="size-4" /> Prev
          </Button>
          <Button variant={completed ? "soft" : "primary"} size="sm" onClick={onToggleComplete}>
            <Check className="size-4" /> {completed ? "Completed" : "Mark complete"}
          </Button>
          <Button variant="outline" size="sm" onClick={onNext} disabled={!onNext} aria-label="Next lesson">
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
