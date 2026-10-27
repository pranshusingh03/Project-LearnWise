import type { SkillGroup } from "@/lib/types"

export const overallSkillScore = 78

export const radarData = [
  { category: "Programming", score: 85, target: 95 },
  { category: "Data Structures", score: 64, target: 90 },
  { category: "Web Dev", score: 62, target: 80 },
  { category: "Databases", score: 58, target: 75 },
  { category: "Problem Solving", score: 74, target: 90 },
]

export const skillGroups: SkillGroup[] = [
  {
    category: "Programming",
    skills: [
      { name: "Java", value: 85 },
      { name: "Python", value: 60 },
      { name: "JavaScript", value: 55 },
    ],
  },
  {
    category: "Data Structures",
    skills: [
      { name: "Arrays", value: 90 },
      { name: "Linked Lists", value: 75 },
      { name: "Trees", value: 50 },
      { name: "Graphs", value: 40 },
    ],
  },
  {
    category: "Web Development",
    skills: [
      { name: "HTML/CSS", value: 80 },
      { name: "React", value: 60 },
      { name: "Backend", value: 45 },
    ],
  },
]

export const strengths = [
  { icon: "dumbbell", label: "Strong Java Fundamentals" },
  { icon: "puzzle", label: "Good Problem Solving" },
  { icon: "zap", label: "Strong Understanding of Arrays" },
]

export const areasToImprove = [
  { icon: "trees", label: "Trees" },
  { icon: "share-2", label: "Graph Algorithms" },
  { icon: "server", label: "Backend Development" },
]

export const popularSkills = [
  "Java",
  "Data Structures & Algorithms",
  "Python",
  "React",
  "Machine Learning",
  "SQL",
  "System Design",
  "Spring Boot",
]

export const skillGrowthData = [
  { month: "Jan", score: 42 },
  { month: "Feb", score: 48 },
  { month: "Mar", score: 55 },
  { month: "Apr", score: 61 },
  { month: "May", score: 68 },
  { month: "Jun", score: 72 },
  { month: "Jul", score: 78 },
]
