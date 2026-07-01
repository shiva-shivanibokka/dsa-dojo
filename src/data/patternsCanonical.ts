// The core interview patterns worth covering. Each maps to the LeetCode topic
// tag(s) that count as "touched". "Patterns to learn next" = the ones for which
// you haven't solved a single tagged problem yet.
export interface CanonicalPattern {
  name: string
  tags: string[] // LeetCode topicTag names that count as covering this pattern
}

export const CANONICAL_PATTERNS: CanonicalPattern[] = [
  { name: 'Two Pointers', tags: ['Two Pointers'] },
  { name: 'Sliding Window', tags: ['Sliding Window'] },
  { name: 'Hash Table', tags: ['Hash Table'] },
  { name: 'Stack', tags: ['Stack', 'Monotonic Stack'] },
  { name: 'Binary Search', tags: ['Binary Search'] },
  { name: 'Linked List', tags: ['Linked List'] },
  { name: 'Trees', tags: ['Tree', 'Binary Tree', 'Binary Search Tree'] },
  { name: 'Heap', tags: ['Heap (Priority Queue)'] },
  { name: 'Graphs', tags: ['Graph'] },
  { name: 'DFS / BFS', tags: ['Depth-First Search', 'Breadth-First Search'] },
  { name: 'Backtracking', tags: ['Backtracking'] },
  { name: 'Dynamic Programming', tags: ['Dynamic Programming'] },
  { name: 'Greedy', tags: ['Greedy'] },
  { name: 'Trie', tags: ['Trie'] },
  { name: 'Bit Manipulation', tags: ['Bit Manipulation'] },
  { name: 'Matrix', tags: ['Matrix'] },
  { name: 'Intervals', tags: ['Line Sweep'] },
  { name: 'Union Find', tags: ['Union Find'] },
]
