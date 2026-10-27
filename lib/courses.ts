import type { Course, CourseProgress } from "@/lib/types"

export const courseCategories = [
  "Programming",
  "Web Development",
  "Artificial Intelligence",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
]

export const courses: Course[] = [
  {
    id: "dsa-java",
    title: "Master Data Structures in Java",
    instructor: "Dr. Meera Nair",
    category: "Programming",
    difficulty: "Intermediate",
    duration: "24h 30m",
    rating: 4.9,
    students: 48210,
    lessons: 86,
    match: 94,
    description:
      "Go from arrays to advanced graph algorithms with hands-on problems designed for technical interviews. Build the problem-solving intuition top companies look for.",
    gradient: "from-indigo-500 to-violet-600",
    tags: ["Arrays", "Trees", "Graphs", "DP"],
  },
  {
    id: "java-collections",
    title: "Advanced Java Collections",
    instructor: "Rahul Verma",
    category: "Programming",
    difficulty: "Intermediate",
    duration: "12h 10m",
    rating: 4.7,
    students: 31200,
    lessons: 52,
    match: 91,
    description:
      "Deep dive into Lists, Maps, Sets, and Queues. Learn when to use each collection and how they perform under the hood.",
    gradient: "from-violet-500 to-purple-600",
    tags: ["Java", "Collections", "Generics"],
  },
  {
    id: "react-guide",
    title: "React Complete Guide",
    instructor: "Sophia Alvarez",
    category: "Web Development",
    difficulty: "Beginner",
    duration: "31h 45m",
    rating: 4.8,
    students: 92450,
    lessons: 120,
    match: 82,
    description:
      "Build modern, reactive user interfaces with hooks, context, and the latest React patterns. Ship real projects along the way.",
    gradient: "from-cyan-500 to-blue-600",
    tags: ["React", "Hooks", "Frontend"],
  },
  {
    id: "ml-intro",
    title: "Introduction to Machine Learning",
    instructor: "Dr. Aditya Rao",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    duration: "28h 00m",
    rating: 4.6,
    students: 40120,
    lessons: 78,
    match: 76,
    description:
      "Understand the math and intuition behind supervised and unsupervised learning, and train your first real models.",
    gradient: "from-fuchsia-500 to-pink-600",
    tags: ["ML", "Python", "Models"],
  },
  {
    id: "spring-boot",
    title: "Spring Boot Fundamentals",
    instructor: "Rahul Verma",
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "18h 20m",
    rating: 4.7,
    students: 27800,
    lessons: 64,
    match: 88,
    description:
      "Build production-grade REST APIs with Spring Boot, JPA, and security. The backend skills placements expect.",
    gradient: "from-emerald-500 to-green-600",
    tags: ["Spring", "Backend", "REST"],
  },
  {
    id: "sql-dev",
    title: "SQL for Developers",
    instructor: "Nina Patel",
    category: "Data Science",
    difficulty: "Beginner",
    duration: "9h 40m",
    rating: 4.5,
    students: 55300,
    lessons: 40,
    match: 79,
    description:
      "Master querying, joins, indexing, and database design with practical exercises on real datasets.",
    gradient: "from-amber-500 to-orange-600",
    tags: ["SQL", "Databases", "Queries"],
  },
  {
    id: "system-design",
    title: "System Design Basics",
    instructor: "Dr. Meera Nair",
    category: "Programming",
    difficulty: "Advanced",
    duration: "16h 15m",
    rating: 4.8,
    students: 21400,
    lessons: 48,
    match: 71,
    description:
      "Learn to design scalable systems: load balancing, caching, databases, and the trade-offs behind real architectures.",
    gradient: "from-slate-500 to-indigo-600",
    tags: ["Scalability", "Architecture"],
  },
  {
    id: "python-master",
    title: "Python Masterclass",
    instructor: "Dr. Aditya Rao",
    category: "Programming",
    difficulty: "Beginner",
    duration: "22h 05m",
    rating: 4.7,
    students: 78900,
    lessons: 95,
    match: 74,
    description:
      "From syntax to real projects — a complete Python journey covering automation, data handling, and clean code.",
    gradient: "from-blue-500 to-cyan-600",
    tags: ["Python", "Automation"],
  },
  {
    id: "cyber-intro",
    title: "Cybersecurity Essentials",
    instructor: "Marcus Lee",
    category: "Cybersecurity",
    difficulty: "Beginner",
    duration: "14h 30m",
    rating: 4.4,
    students: 18600,
    lessons: 44,
    match: 62,
    description:
      "Understand threats, encryption, network security, and how to think like both attacker and defender.",
    gradient: "from-red-500 to-rose-600",
    tags: ["Security", "Networking"],
  },
]

export const continueLearning: CourseProgress[] = [
  { id: "java-collections", title: "Java Collections", progress: 70 },
  { id: "dsa-java", title: "Data Structures & Algorithms", progress: 45 },
  { id: "react-guide", title: "React Fundamentals", progress: 25 },
]

export const curriculum = [
  { module: "Module 1", title: "Arrays and Strings", lessons: 12, duration: "3h 20m", status: "Completed" },
  { module: "Module 2", title: "Linked Lists", lessons: 10, duration: "2h 45m", status: "Completed" },
  { module: "Module 3", title: "Stacks and Queues", lessons: 8, duration: "2h 10m", status: "In Progress" },
  { module: "Module 4", title: "Trees", lessons: 14, duration: "4h 05m", status: "Not Started" },
  { module: "Module 5", title: "Graphs", lessons: 13, duration: "3h 50m", status: "Not Started" },
  { module: "Module 6", title: "Dynamic Programming", lessons: 15, duration: "4h 30m", status: "Not Started" },
]

export const learningOutcomes = [
  "Arrays and Strings",
  "Linked Lists",
  "Stacks and Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
]

export function getCourse(id: string) {
  return courses.find((c) => c.id === id)
}
