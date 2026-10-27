import type { User, Achievement } from "@/lib/types"

export const currentUser: User = {
  name: "Arpita",
  role: "Student",
  email: "arpita@learnwise.ai",
  goal: "Software Engineering Internship",
  avatar: "/student-avatar.png",
  skillLevel: "Intermediate",
  learningStyle: "Hands-on Practice",
  weeklyTime: "8–12 Hours",
  skills: ["Java", "DSA", "React", "SQL"],
  interests: ["Web Development", "Machine Learning", "Backend Development"],
}

export const achievements: Achievement[] = [
  {
    id: "a1",
    title: "First Course Completed",
    description: "Finished your very first course",
    icon: "trophy",
    unlocked: true,
  },
  {
    id: "a2",
    title: "7 Day Streak",
    description: "Learned 7 days in a row",
    icon: "flame",
    unlocked: true,
  },
  {
    id: "a3",
    title: "Quiz Master",
    description: "Scored 80%+ on 5 quizzes",
    icon: "brain",
    unlocked: true,
  },
  {
    id: "a4",
    title: "Skill Explorer",
    description: "Explored 10+ different skills",
    icon: "rocket",
    unlocked: true,
  },
  {
    id: "a5",
    title: "Marathon Learner",
    description: "Study 30 days in a row",
    icon: "medal",
    unlocked: false,
  },
  {
    id: "a6",
    title: "Path Finisher",
    description: "Complete a full learning path",
    icon: "target",
    unlocked: false,
  },
]
