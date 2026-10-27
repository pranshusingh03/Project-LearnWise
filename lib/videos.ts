import { getCourse } from "@/lib/courses"

/**
 * Lesson videos.
 *
 * Every course lists one or more candidate YouTube videos. The player uses the
 * first one and automatically falls back to the next if YouTube reports that a
 * video is missing or can't be embedded. To change a video, just edit its `id`
 * (the part after `v=` in a YouTube URL).
 *
 * `approxSeconds` is a deliberately conservative length: lesson N starts at the
 * matching point of the video (lesson 1 at 0:00, the last lesson near the end),
 * so each lesson plays a different part instead of always restarting.
 */
export interface CourseVideo {
  id: string
  title: string
  channel: string
  approxSeconds: number
}

export const courseVideos: Record<string, CourseVideo[]> = {
  "dsa-java": [
    { id: "RBSGKlAvoiM", title: "Data Structures Easy to Advanced Course", channel: "freeCodeCamp.org", approxSeconds: 25000 },
    { id: "8hly31xKli0", title: "Algorithms and Data Structures Tutorial", channel: "freeCodeCamp.org", approxSeconds: 7000 },
  ],
  "java-collections": [
    { id: "eIrMbAQSU34", title: "Java Tutorial for Beginners", channel: "Programming with Mosh", approxSeconds: 8000 },
  ],
  "react-guide": [
    { id: "bMknfKXIFA8", title: "React Course for Beginners", channel: "freeCodeCamp.org", approxSeconds: 40000 },
  ],
  "ml-intro": [
    { id: "i_LwzRVP7bg", title: "Machine Learning for Everybody", channel: "freeCodeCamp.org", approxSeconds: 13000 },
  ],
  "spring-boot": [
    { id: "5rNk7m_zlAg", title: "Spring Boot & Spring Data JPA", channel: "freeCodeCamp.org", approxSeconds: 44000 },
  ],
  "sql-dev": [
    { id: "HXV3zeQKqGY", title: "SQL Tutorial – Full Database Course", channel: "freeCodeCamp.org", approxSeconds: 14000 },
  ],
  "system-design": [
    { id: "F2FmTdLtb_4", title: "System Design Concepts and Interview Prep", channel: "freeCodeCamp.org", approxSeconds: 2400 },
  ],
  "python-master": [
    { id: "rfscVS0vtbw", title: "Learn Python – Full Course for Beginners", channel: "freeCodeCamp.org", approxSeconds: 15000 },
    { id: "_uQrJ0TkZlc", title: "Python Tutorial for Beginners", channel: "Programming with Mosh", approxSeconds: 21000 },
  ],
  "cyber-intro": [
    { id: "qiQR5rTSshw", title: "Computer Networking Full Course", channel: "freeCodeCamp.org", approxSeconds: 30000 },
  ],
}

export interface LessonRef {
  /** index of the lesson across the whole course (0-based) */
  index: number
  moduleIndex: number
  lessonIndex: number
  key: string
}

export function videosFor(courseId: string): CourseVideo[] {
  return courseVideos[courseId] ?? []
}

/** Which second of `video` the given lesson should start at. */
export function lessonStart(video: CourseVideo, index: number, total: number): number {
  if (total <= 1) return 0
  return Math.floor((index / total) * video.approxSeconds)
}

/** A YouTube search link, used if every embed fails. */
export function youtubeSearchUrl(courseId: string): string {
  const c = getCourse(courseId)
  const q = c ? `${c.title} ${c.tags[0] ?? ""} full course` : "programming full course"
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
}

export function watchUrl(video: CourseVideo, start: number): string {
  return `https://www.youtube.com/watch?v=${video.id}${start > 0 ? `&t=${start}s` : ""}`
}
