// The classic "Blind 75" interview list (slug + display title). Used to show
// how many of the must-do problems you've completed. Matching is by slug.
export interface ListItem {
  slug: string
  title: string
}

export const BLIND75: ListItem[] = [
  // Array
  { slug: 'two-sum', title: 'Two Sum' },
  { slug: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock' },
  { slug: 'contains-duplicate', title: 'Contains Duplicate' },
  { slug: 'product-of-array-except-self', title: 'Product of Array Except Self' },
  { slug: 'maximum-subarray', title: 'Maximum Subarray' },
  { slug: 'maximum-product-subarray', title: 'Maximum Product Subarray' },
  { slug: 'find-minimum-in-rotated-sorted-array', title: 'Find Minimum in Rotated Sorted Array' },
  { slug: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array' },
  { slug: '3sum', title: '3Sum' },
  { slug: 'container-with-most-water', title: 'Container With Most Water' },
  // Binary
  { slug: 'sum-of-two-integers', title: 'Sum of Two Integers' },
  { slug: 'number-of-1-bits', title: 'Number of 1 Bits' },
  { slug: 'counting-bits', title: 'Counting Bits' },
  { slug: 'missing-number', title: 'Missing Number' },
  { slug: 'reverse-bits', title: 'Reverse Bits' },
  // Dynamic Programming
  { slug: 'climbing-stairs', title: 'Climbing Stairs' },
  { slug: 'coin-change', title: 'Coin Change' },
  { slug: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence' },
  { slug: 'longest-common-subsequence', title: 'Longest Common Subsequence' },
  { slug: 'word-break', title: 'Word Break' },
  { slug: 'combination-sum', title: 'Combination Sum' },
  { slug: 'house-robber', title: 'House Robber' },
  { slug: 'house-robber-ii', title: 'House Robber II' },
  { slug: 'decode-ways', title: 'Decode Ways' },
  { slug: 'unique-paths', title: 'Unique Paths' },
  { slug: 'jump-game', title: 'Jump Game' },
  // Graph
  { slug: 'clone-graph', title: 'Clone Graph' },
  { slug: 'course-schedule', title: 'Course Schedule' },
  { slug: 'pacific-atlantic-water-flow', title: 'Pacific Atlantic Water Flow' },
  { slug: 'number-of-islands', title: 'Number of Islands' },
  { slug: 'longest-consecutive-sequence', title: 'Longest Consecutive Sequence' },
  { slug: 'alien-dictionary', title: 'Alien Dictionary' },
  { slug: 'graph-valid-tree', title: 'Graph Valid Tree' },
  { slug: 'number-of-connected-components-in-an-undirected-graph', title: 'Connected Components in Undirected Graph' },
  // Interval
  { slug: 'insert-interval', title: 'Insert Interval' },
  { slug: 'merge-intervals', title: 'Merge Intervals' },
  { slug: 'non-overlapping-intervals', title: 'Non-overlapping Intervals' },
  { slug: 'meeting-rooms', title: 'Meeting Rooms' },
  { slug: 'meeting-rooms-ii', title: 'Meeting Rooms II' },
  // Linked List
  { slug: 'reverse-linked-list', title: 'Reverse Linked List' },
  { slug: 'linked-list-cycle', title: 'Linked List Cycle' },
  { slug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists' },
  { slug: 'merge-k-sorted-lists', title: 'Merge k Sorted Lists' },
  { slug: 'remove-nth-node-from-end-of-list', title: 'Remove Nth Node From End of List' },
  { slug: 'reorder-list', title: 'Reorder List' },
  // Matrix
  { slug: 'set-matrix-zeroes', title: 'Set Matrix Zeroes' },
  { slug: 'spiral-matrix', title: 'Spiral Matrix' },
  { slug: 'rotate-image', title: 'Rotate Image' },
  { slug: 'word-search', title: 'Word Search' },
  // String
  { slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters' },
  { slug: 'longest-repeating-character-replacement', title: 'Longest Repeating Character Replacement' },
  { slug: 'minimum-window-substring', title: 'Minimum Window Substring' },
  { slug: 'valid-anagram', title: 'Valid Anagram' },
  { slug: 'group-anagrams', title: 'Group Anagrams' },
  { slug: 'valid-parentheses', title: 'Valid Parentheses' },
  { slug: 'valid-palindrome', title: 'Valid Palindrome' },
  { slug: 'longest-palindromic-substring', title: 'Longest Palindromic Substring' },
  { slug: 'palindromic-substrings', title: 'Palindromic Substrings' },
  { slug: 'encode-and-decode-strings', title: 'Encode and Decode Strings' },
  // Tree
  { slug: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree' },
  { slug: 'same-tree', title: 'Same Tree' },
  { slug: 'invert-binary-tree', title: 'Invert Binary Tree' },
  { slug: 'binary-tree-maximum-path-sum', title: 'Binary Tree Maximum Path Sum' },
  { slug: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal' },
  { slug: 'serialize-and-deserialize-binary-tree', title: 'Serialize and Deserialize Binary Tree' },
  { slug: 'subtree-of-another-tree', title: 'Subtree of Another Tree' },
  { slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', title: 'Construct Binary Tree from Preorder and Inorder' },
  { slug: 'validate-binary-search-tree', title: 'Validate Binary Search Tree' },
  { slug: 'kth-smallest-element-in-a-bst', title: 'Kth Smallest Element in a BST' },
  { slug: 'lowest-common-ancestor-of-a-binary-search-tree', title: 'Lowest Common Ancestor of a BST' },
  { slug: 'implement-trie-prefix-tree', title: 'Implement Trie (Prefix Tree)' },
  { slug: 'design-add-and-search-words-data-structure', title: 'Add and Search Word' },
  { slug: 'word-search-ii', title: 'Word Search II' },
  // Heap
  { slug: 'top-k-frequent-elements', title: 'Top K Frequent Elements' },
  { slug: 'find-median-from-data-stream', title: 'Find Median from Data Stream' },
]
