export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

export type ModuleStatus =
  | "Completed"
  | "In Progress"
  | "Recommended Next"
  | "Locked"
  | "Upcoming"
  | "Final Goal"

export interface User {
  name: string
  role: string
  email: string
  goal: string
  avatar: string
  skillLevel: Difficulty
  learningStyle: string
  weeklyTime: string
  skills: string[]
  interests: string[]
}

export interface Course {
  id: string
  title: string
  instructor: string
  category: string
  difficulty: Difficulty
  duration: string
  rating: number
  students: number
  lessons: number
  match?: number
  description: string
  gradient: string
  tags: string[]
}

export interface CourseProgress {
  id: string
  title: string
  progress: number
}

export interface PathModule {
  id: number
  title: string
  status: ModuleStatus
  progress: number
  difficulty: Difficulty
  duration: string
  description: string
}

export interface Recommendation {
  id: string
  title: string
  instructor: string
  duration: string
  difficulty: Difficulty
  rating: number
  match: number
  reason: string
}

export interface SkillGroup {
  category: string
  skills: { name: string; value: number }[]
}

export interface QuizQuestion {
  id: number
  topic: string
  question: string
  options: string[]
  answer: number
}

export interface StudyTask {
  id: string
  title: string
  duration: string
  done: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}
