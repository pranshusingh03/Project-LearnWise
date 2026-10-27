import type { StudyTask } from "@/lib/types"
import { generatePlan } from "@/lib/planner"

export interface AssistantContext {
  name: string
  goal: string
  weak: { name: string; value: number }[]
  strong: { name: string; value: number }[]
  streak: number
  overall: number
  courses: { title: string; progress: number }[]
  tasksLeftToday: number
  lastQuizPct: number | null
}

export interface AssistantReply {
  content: string
  plan?: Record<string, StudyTask[]>
}

const topics: { keys: string[]; text: string }[] = [
  {
    keys: ["linked list"],
    text: "Think of a linked list as a treasure hunt: each node holds a value and a clue (pointer) to the next node. Unlike arrays, items aren’t stored side by side, so inserting or deleting is fast (O(1) once you have the node), but finding an item means following the clues one by one (O(n)).",
  },
  {
    keys: ["array"],
    text: "An array stores items side by side in memory, so reading by index is O(1). The trade-off is that inserting or deleting in the middle means shifting elements (O(n)). Dynamic arrays (like Java’s ArrayList) grow automatically and append in amortized O(1).",
  },
  {
    keys: ["stack"],
    text: "A stack is last-in, first-out (LIFO) — like a pile of plates. You push onto the top and pop from the top, both O(1). It powers undo, expression evaluation and DFS.",
  },
  {
    keys: ["queue"],
    text: "A queue is first-in, first-out (FIFO) — like a line at a ticket counter. Enqueue at the back, dequeue from the front, both O(1). BFS uses a queue.",
  },
  {
    keys: ["binary search"],
    text: "Binary search finds a value in a sorted array by repeatedly halving the search range: compare with the middle, discard the half that can’t contain the target. That gives O(log n) time.",
  },
  {
    keys: ["tree", "bst", "traversal"],
    text: "A tree is a hierarchy of nodes. In a binary tree each node has up to two children. Key traversals: in-order (left, node, right — sorted order for a BST), pre-order, post-order, and level-order (BFS). Balanced trees keep height around O(log n), which keeps search fast.",
  },
  {
    keys: ["graph", "bfs", "dfs"],
    text: "A graph is nodes (vertices) connected by edges. BFS explores level by level using a queue and finds shortest paths in unweighted graphs. DFS goes as deep as possible first using recursion or a stack — great for cycle detection, connected components and topological sort.",
  },
  {
    keys: ["hash"],
    text: "A hash table maps keys to array slots using a hash function, giving average O(1) lookup, insert and delete. Collisions (two keys, same slot) are handled by chaining or open addressing. Java’s HashMap is the classic example.",
  },
  {
    keys: ["recursion"],
    text: "Recursion solves a problem by calling itself on a smaller version. Every recursive function needs a base case (when to stop) and a recursive case that moves toward it. Trace small inputs by hand to build intuition.",
  },
  {
    keys: ["dynamic programming", " dp"],
    text: "Dynamic programming speeds up recursive problems with overlapping subproblems by storing results. Top-down = recursion + memoization; bottom-up = filling a table. Start by writing the brute-force recursion, then add a cache.",
  },
  {
    keys: ["sort"],
    text: "Quick sort and merge sort run in O(n log n) on average (merge sort guarantees it). Bubble, insertion and selection sort are O(n²) — fine for tiny inputs, rarely for real ones. In interviews, know the trade-offs between time, space and stability.",
  },
  {
    keys: ["big o", "complexity"],
    text: "Big-O describes how runtime or memory grows with input size n: O(1) constant, O(log n) halving, O(n) one pass, O(n log n) efficient sorting, O(n²) nested loops. Count how many times the main work repeats as n grows.",
  },
  {
    keys: ["oop", "object oriented", "object-oriented"],
    text: "OOP organizes code around objects with four ideas: encapsulation (hide internals), abstraction (expose what matters), inheritance (reuse behavior) and polymorphism (one interface, many implementations).",
  },
  {
    keys: ["react", "hooks"],
    text: "React builds UIs from components. useState holds local state, useEffect runs side effects after render, and props pass data down. When state changes, React re-renders the affected components. Build one small project to make it stick.",
  },
  {
    keys: ["sql", "database", "join"],
    text: "SQL queries relational data. SELECT picks columns, WHERE filters rows, JOIN combines tables on a key, GROUP BY aggregates. Indexes speed up lookups at the cost of slower writes. Practice with a real dataset.",
  },
  {
    keys: ["spring"],
    text: "Spring Boot lets you build Java REST APIs quickly: controllers handle HTTP requests, services hold business logic, and repositories (Spring Data JPA) talk to the database. Auto-configuration removes most boilerplate.",
  },
]

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w))

export function respond(input: string, ctx: AssistantContext): AssistantReply {
  const t = ` ${input.toLowerCase()} `
  const weakNames = ctx.weak.map((w) => w.name)

  if (has(t, "plan", "schedule", "7-day", "7 day", "timetable")) {
    const plan = generatePlan(weakNames)
    const days = Object.entries(plan)
      .map(([d, tasks]) => `${d.slice(0, 3)}: ${tasks.map((x) => x.title).join(" + ")}`)
      .join("\n")
    return {
      content: `Here’s a 7-day plan focused on your weakest areas (${weakNames.join(", ")}):\n\n${days}\n\nWant me to put it in your Study Plan?`,
      plan,
    }
  }

  if (has(t, "explain", "what is", "what are", "how does", "teach", "simply", "meaning of") || topics.some((x) => x.keys.some((k) => t.includes(k)))) {
    const hit = topics.find((x) => x.keys.some((k) => t.includes(k)))
    if (hit) return { content: hit.text }
  }

  if (has(t, "why") && has(t, "recommend")) {
    const top = ctx.weak[0]
    return {
      content: `Recommendations combine your goal (${ctx.goal}), your interests, your level and your skill gaps. Right now your lowest score is ${top?.name ?? "—"} at ${top?.value ?? 0}%, so courses that target it rank higher. Open AI Recommendations to see the reason for each course.`,
    }
  }

  if (has(t, "next", "what should i", "where do i start", "roadmap")) {
    const focus = weakNames.slice(0, 2).join(" and ")
    const cont = ctx.courses.find((c) => c.progress > 0 && c.progress < 100)
    return {
      content: `Based on your scores, focus on ${focus} next — they’re your biggest gaps for “${ctx.goal}”.${cont ? ` Meanwhile, keep going with ${cont.title} (${cont.progress}% done).` : ""} Start with a short lesson, then take the Smart Quiz to measure progress.`,
    }
  }

  if (has(t, "progress", "how am i", "doing", "streak", "score", "stats")) {
    const list = ctx.courses.map((c) => `${c.title}: ${c.progress}%`).join(", ")
    return {
      content: `You’re on a ${ctx.streak}-day streak with an overall skill score of ${ctx.overall}/100.${list ? ` Courses — ${list}.` : ""}${ctx.lastQuizPct !== null ? ` Your last quiz was ${ctx.lastQuizPct}%.` : ""} Strongest: ${ctx.strong.map((s) => s.name).join(", ")}. Weakest: ${weakNames.join(", ")}.`,
    }
  }

  if (has(t, "quiz", "test me", "practice")) {
    return {
      content: `Take the Smart Quiz to check yourself — it updates your skill scores. Based on your profile, expect extra questions to matter on ${weakNames.slice(0, 2).join(" and ")}. Head to Smart Quiz in the sidebar.`,
    }
  }

  if (has(t, "dsa", "improve", "algorithm", "interview", "placement")) {
    return {
      content: `To level up your DSA: 1) Solve problems by pattern (two pointers, sliding window, recursion), not randomly. 2) Re-implement each data structure from scratch once. 3) Review your quiz mistakes — you’re strongest in ${ctx.strong[0]?.name ?? "arrays"} (${ctx.strong[0]?.value ?? 0}%) and need work on ${ctx.weak[0]?.name ?? "graphs"} (${ctx.weak[0]?.value ?? 0}%). Consistency beats intensity!`,
    }
  }

  if (has(t, "today", "tasks", "todo")) {
    return {
      content:
        ctx.tasksLeftToday > 0
          ? `You have ${ctx.tasksLeftToday} task${ctx.tasksLeftToday > 1 ? "s" : ""} left today. Open Study Plan to tick them off.`
          : "You’ve finished everything planned for today. Nice work — add another task or rest!",
    }
  }

  if (has(t, "hello", "hi ", "hey", "thanks", "thank you")) {
    return { content: `Hi ${ctx.name}! I can suggest what to learn next, explain a topic (try “explain trees”), or build a study plan. What would you like?` }
  }

  return {
    content: `I can help with: what to learn next, explaining topics (arrays, linked lists, trees, graphs, hashing, recursion, DP, React, SQL, Spring Boot), your progress, quizzes, and weekly study plans. Which one would you like?`,
  }
}
