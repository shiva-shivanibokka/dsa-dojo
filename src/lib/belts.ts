// Dojo belt progression, earned by total problems solved.
export interface BeltTier {
  name: string
  min: number
  color: string
}

export const BELTS: BeltTier[] = [
  { name: 'White', min: 0, color: '#e5e7eb' },
  { name: 'Yellow', min: 10, color: '#fbbf24' },
  { name: 'Orange', min: 25, color: '#fb923c' },
  { name: 'Green', min: 50, color: '#34d399' },
  { name: 'Blue', min: 100, color: '#60a5fa' },
  { name: 'Purple', min: 175, color: '#a78bfa' },
  { name: 'Brown', min: 275, color: '#b45309' },
  { name: 'Black', min: 400, color: '#6b7280' },
]

export interface BeltState {
  current: BeltTier
  next: BeltTier | null
  solved: number
  toNext: number // problems remaining to next belt (0 if maxed)
  progress: number // 0..1 within the current tier toward the next
}

export function beltFor(solved: number): BeltState {
  let idx = 0
  for (let i = 0; i < BELTS.length; i++) if (solved >= BELTS[i].min) idx = i
  const current = BELTS[idx]
  const next = idx < BELTS.length - 1 ? BELTS[idx + 1] : null
  const toNext = next ? next.min - solved : 0
  const progress = next ? (solved - current.min) / (next.min - current.min) : 1
  return { current, next, solved, toNext, progress: Math.max(0, Math.min(1, progress)) }
}
