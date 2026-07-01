// Lightweight spaced-repetition scheduling. Your confidence rating IS the grade:
// a problem you found solid gets a long interval before it resurfaces; one you
// forgot comes back soon. The clock starts from your last review (or, if you've
// never reviewed it, from when you solved it).

export const REVIEW_INTERVALS: Record<string, number> = {
  forgot: 3,
  shaky: 10,
  solid: 30,
}
// Solved but not yet self-rated → nudge a review after this many days.
export const DEFAULT_INTERVAL = 21

export function intervalFor(confidence: string | undefined): number {
  return (confidence && REVIEW_INTERVALS[confidence]) || DEFAULT_INTERVAL
}

export function daysSince(iso: string | null | undefined): number {
  if (!iso) return Infinity
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return Infinity
  return Math.floor((Date.now() - t) / 86_400_000)
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
