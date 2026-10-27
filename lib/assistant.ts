export const suggestedQuestions = [
  "What should I learn next?",
  "Explain Linked Lists simply",
  "Create a 7-day study plan",
  "Why was this course recommended?",
  "Help me improve my DSA skills",
]

const responses: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["next", "learn next", "what should"],
    answer:
      "Based on your learning profile, I recommend focusing on Trees and Graphs next. These are currently your biggest skill gaps and are important for technical interviews. Start with binary tree traversals, then move to BFS and DFS on graphs.",
  },
  {
    keywords: ["linked list", "linked lists"],
    answer:
      "Think of a linked list as a treasure hunt: each node holds a value and a clue (pointer) to the next node. Unlike arrays, the items aren't stored side by side in memory, so inserting or deleting is fast (O(1) if you have the node), but finding an item means following the clues one by one (O(n)).",
  },
  {
    keywords: ["7-day", "7 day", "study plan", "plan"],
    answer:
      "Here's a focused 7-day plan:\n\nDay 1–2: Binary Trees & traversals\nDay 3: Binary Search Trees\nDay 4: Heaps & priority queues\nDay 5: Graph representation + BFS\nDay 6: DFS & topological sort\nDay 7: Mixed practice + a timed quiz.\n\nAim for ~1.5 hours each day with 3–4 problems.",
  },
  {
    keywords: ["why", "recommend", "recommended"],
    answer:
      "This course was recommended because it aligns with your goal of a Software Engineering Internship (94% match), directly targets your weakest area (Trees & Graphs), and matches your hands-on learning style. Strengthening these topics gives you the biggest boost toward interview readiness.",
  },
  {
    keywords: ["dsa", "improve", "algorithm"],
    answer:
      "To level up your DSA: 1) Solve problems by pattern (two pointers, sliding window, recursion), not randomly. 2) Re-implement each data structure from scratch once. 3) Review your quiz mistakes — you're currently strongest in Arrays (90%) and need work on Graphs (40%). Consistency beats intensity here!",
  },
]

export function getAssistantResponse(input: string): string {
  const text = input.toLowerCase()
  const match = responses.find((r) => r.keywords.some((k) => text.includes(k)))
  if (match) return match.answer
  return "That's a great question! Based on your profile, I'd suggest continuing with your Data Structures path and practicing Trees and Graphs. Would you like me to create a study plan or explain a specific topic in more detail?"
}

export const initialMessages = [
  {
    role: "assistant" as const,
    content:
      "Hi Arpita! I'm your LearnWise AI Assistant. I can help you decide what to learn next, explain tricky concepts, or build a study plan. What would you like to work on today?",
  },
]
