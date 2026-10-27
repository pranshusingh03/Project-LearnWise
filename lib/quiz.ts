import type { QuizQuestion } from "@/lib/types"

export const quizTitle = "Data Structures Assessment"

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    topic: "Searching",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
  },
  {
    id: 2,
    topic: "Arrays",
    question: "Which operation is O(1) on a dynamic array (amortized)?",
    options: ["Insert at beginning", "Append at end", "Delete at index", "Search by value"],
    answer: 1,
  },
  {
    id: 3,
    topic: "Linked Lists",
    question: "What is the main advantage of a linked list over an array?",
    options: [
      "Constant time random access",
      "Better cache locality",
      "Efficient insertion and deletion",
      "Lower memory usage",
    ],
    answer: 2,
  },
  {
    id: 4,
    topic: "Stacks",
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Heap", "Tree"],
    answer: 1,
  },
  {
    id: 5,
    topic: "Trees",
    question: "In a binary search tree, an in-order traversal visits nodes in what order?",
    options: ["Random order", "Descending order", "Ascending order", "Level order"],
    answer: 2,
  },
  {
    id: 6,
    topic: "Trees",
    question: "What is the height of a balanced binary tree with n nodes?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
  },
  {
    id: 7,
    topic: "Graphs",
    question: "Which algorithm finds the shortest path in an unweighted graph?",
    options: ["DFS", "BFS", "Dijkstra", "Prim's"],
    answer: 1,
  },
  {
    id: 8,
    topic: "Graphs",
    question: "What data structure does Dijkstra's algorithm typically use?",
    options: ["Stack", "Queue", "Priority Queue", "Hash Map"],
    answer: 2,
  },
  {
    id: 9,
    topic: "Hashing",
    question: "What is the average time complexity of a hash table lookup?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 0,
  },
  {
    id: 10,
    topic: "Sorting",
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    answer: 2,
  },
]

export const quizResultTopics = [
  { topic: "Arrays", score: 90 },
  { topic: "Linked Lists", score: 85 },
  { topic: "Trees", score: 50 },
  { topic: "Graphs", score: 40 },
]

export const quizAiFeedback =
  "Great performance in Arrays and Linked Lists. However, you should focus on Tree traversal and Graph algorithms before moving to advanced topics."
