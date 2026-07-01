// Shapes of the build-time LeetCode sync output (public/problems.json) and the
// browser-side overrides (confidence / revisit / notes) the user controls.

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Problem {
  id: number // LeetCode frontend question id (e.g. 49 for Group Anagrams)
  slug: string // titleSlug — stable key
  title: string
  difficulty: Difficulty
  tags: string[] // topic tags → patterns (Hash Table, Two Pointers, DP, …)
  url: string
  solvedAt: string | null // ISO date of the accepted submission
}

export interface DifficultyStat {
  solved: number
  total: number
}

export interface Profile {
  ranking: number | null
  totalSolved: number
  byDifficulty: Record<Difficulty, DifficultyStat>
  streak: number // current streak (days)
  totalActiveDays: number
  submissionsPastYear: number
  calendar: Record<string, number> // 'YYYY-MM-DD' → submissions that day (past year)
}

export interface ProblemsFile {
  generatedAt: string
  username: string
  profile: Profile
  problems: Problem[]
}

// User-controlled fields, keyed by problem slug.
export type OverrideKey = 'confidence' | 'revisit' | 'notes'
export interface Override {
  confidence?: string // 'solid' | 'shaky' | 'forgot'
  revisit?: string // '1' when flagged
  notes?: string
}
export type Overrides = Record<string, Override>
