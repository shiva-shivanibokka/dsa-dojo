import type { Difficulty } from '../data/types'

// Neo-brutalist tag chips: solid pastel fill + black text + black border.
// Each topic tag gets a stable colour, so "Two Pointers" is always the same hue.
const PALETTE = [
  '#C7B4FF', // grape
  '#7FD1FF', // sky
  '#8CE35B', // lime
  '#FFD24D', // gold
  '#FF9E9E', // coral
  '#FFB4E1', // pink
  '#7FE9D0', // teal
  '#FFC08A', // orange
  '#B8C0FF', // periwinkle
  '#D4E157', // chartreuse
]

// A few marquee patterns get hand-picked colours so the common ones read well.
const FIXED: Record<string, string> = {
  'Two Pointers': '#7FD1FF',
  'Hash Table': '#FFD24D',
  Array: '#C7B4FF',
  String: '#FFB4E1',
  'Dynamic Programming': '#FF9E9E',
  Sorting: '#8CE35B',
  'Binary Search': '#7FE9D0',
  Greedy: '#FFC08A',
  Tree: '#8CE35B',
  Graph: '#B8C0FF',
  'Sliding Window': '#FFD24D',
  Stack: '#C7B4FF',
  Backtracking: '#FF9E9E',
}

export function tagColor(tag: string): string {
  if (FIXED[tag]) return FIXED[tag]
  let h = 0
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

// hex (#RRGGBB) → "r,g,b" for translucent neon fills on the dark theme.
export function rgb(hex: string): string {
  const m = hex.replace('#', '')
  const n = parseInt(m.length === 3 ? m.replace(/(.)/g, '$1$1') : m, 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

// Brightened for the dark theme.
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: '#34d399',
  Medium: '#fbbf24',
  Hard: '#fb7185',
}

export const DIFFICULTY_ORDER: Difficulty[] = ['Easy', 'Medium', 'Hard']

// Confidence dropdown options (the user's self-assessment).
export type ConfKey = 'solid' | 'shaky' | 'forgot'
export const CONFIDENCE: { value: ConfKey; label: string; color: string }[] = [
  { value: 'solid', label: 'Solid', color: '#34d399' },
  { value: 'shaky', label: 'Shaky', color: '#fbbf24' },
  { value: 'forgot', label: 'Forgot', color: '#fb7185' },
]
export const confOf = (v: string | undefined) => CONFIDENCE.find((c) => c.value === v)
