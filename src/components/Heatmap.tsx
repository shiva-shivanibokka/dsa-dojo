const WEEKS = 53
const CELL = 12
const GAP = 3

// Local 'YYYY-MM-DD' from the calendar-day parts. Cell position, label and this
// lookup key all use the same local day, so a submission never lands one cell off
// for users away from UTC (toISOString would shift the key into the wrong day).
function localKey(date: Date): string {
  const y = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

function cellColor(count: number): string {
  if (count <= 0) return 'rgba(255,255,255,0.05)'
  if (count < 3) return 'rgba(52,211,153,0.35)'
  if (count < 6) return 'rgba(52,211,153,0.62)'
  if (count < 10) return 'rgba(34,211,238,0.8)'
  return '#22d3ee'
}

// GitHub-style daily activity calendar for the past year, from the LeetCode
// submission calendar (date → submissions).
export default function Heatmap({ calendar, total }: { calendar: Record<string, number>; total: number }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - today.getDay() - (WEEKS - 1) * 7) // Sunday of the first column

  const cols: ({ key: string; count: number; label: string } | null)[][] = []
  for (let w = 0; w < WEEKS; w++) {
    const col: ({ key: string; count: number; label: string } | null)[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      if (date > today) {
        col.push(null)
        continue
      }
      const key = localKey(date)
      const count = calendar[key] || 0
      col.push({ key, count, label: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${count} submission${count === 1 ? '' : 's'}` })
    }
    cols.push(col)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[14px] font-bold uppercase tracking-wide text-muted">Activity</span>
        <span className="font-mono text-[13px] font-bold text-faint">{total} submissions · past year</span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex" style={{ gap: `${GAP}px` }}>
          {cols.map((col, i) => (
            <div key={i} className="flex flex-col" style={{ gap: `${GAP}px` }}>
              {col.map((cell, j) =>
                cell ? (
                  <div
                    key={j}
                    title={cell.label}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 3,
                      background: cellColor(cell.count),
                      boxShadow: cell.count >= 3 ? `0 0 8px -2px ${cellColor(cell.count)}` : undefined,
                    }}
                  />
                ) : (
                  <div key={j} style={{ width: CELL, height: CELL }} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span className="mr-1 font-mono text-[11.5px] font-semibold text-faint">less</span>
        {[0, 2, 5, 9, 12].map((c) => (
          <span key={c} style={{ width: CELL, height: CELL, borderRadius: 3, background: cellColor(c) }} />
        ))}
        <span className="ml-1 font-mono text-[11.5px] font-semibold text-faint">more</span>
      </div>
    </div>
  )
}
