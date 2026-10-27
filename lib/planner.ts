import type { StudyTask } from "@/lib/types"
import { WEEKDAYS } from "@/lib/date"

const templates: Record<string, { learn: string; practice: string }> = {
  Trees: { learn: "Learn Binary Trees", practice: "Practice Tree Traversal" },
  Graphs: { learn: "Graph Algorithms Intro (BFS/DFS)", practice: "Solve 3 Graph Problems" },
  Backend: { learn: "Spring Boot Basics", practice: "Build a small REST endpoint" },
  "Linked Lists": { learn: "Revise Linked Lists", practice: "Solve 3 Linked List Problems" },
  JavaScript: { learn: "JavaScript Core Concepts", practice: "Solve 3 JS Exercises" },
  Python: { learn: "Python Fundamentals Review", practice: "Write 3 Python Scripts" },
  React: { learn: "React Hooks Deep Dive", practice: "Build a small React component" },
  Arrays: { learn: "Revise Arrays & Strings", practice: "Solve 5 Array Problems" },
  "HTML/CSS": { learn: "Responsive Layout Practice", practice: "Clone a landing page section" },
  Java: { learn: "Java Collections Review", practice: "Solve 3 Java Problems" },
}

let counter = 0
function task(title: string, duration: string): StudyTask {
  counter += 1
  return { id: `gen-${Date.now()}-${counter}`, title, duration, done: false }
}

/** Builds a Mon–Sun plan that focuses on the user's weakest skills. */
export function generatePlan(weakNames: string[]): Record<string, StudyTask[]> {
  const names = weakNames.length > 0 ? weakNames : ["Trees", "Graphs", "Backend"]
  const tpl = (n: string) => templates[n] ?? { learn: `Study ${n}`, practice: `Practice ${n} problems` }
  const plan: Record<string, StudyTask[]> = {}
  WEEKDAYS.forEach((d) => (plan[d] = []))

  const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  weekdayOrder.forEach((day, i) => {
    const skill = names[i % names.length]
    const t = tpl(skill)
    plan[day].push(task(i < names.length ? t.learn : t.practice, "45 min"))
    plan[day].push(task(i < names.length ? t.practice : `Revise ${skill} notes`, "30 min"))
  })
  plan["Saturday"].push(task("Mini project: apply this week’s topics", "60 min"))
  plan["Sunday"].push(task("Take a Smart Quiz", "20 min"))
  plan["Sunday"].push(task("Weekly Review", "30 min"))
  return plan
}
