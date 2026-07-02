import { useMemo, useState } from 'react'
import { NEETCODE250, NC250_PATTERNS, type Diff, type RoadmapProblem } from '../data/neetcode250'

// The NeetCode 250 roadmap: the curated list you still need to do, grouped by
// category, every problem tagged Easy/Medium/Hard. Anything already solved on
// LeetCode (in solvedSlugs) shows done; toggle "to-do only" to hide those.
const DIFF_COLOR: Record<Diff, string> = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#fb7185' }

function DiffPill({ d }: { d: Diff }) {
  const c = DIFF_COLOR[d]
  return (
    <span className="rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] font-extrabold uppercase" style={{ color: c, borderColor: `${c}66`, background: `${c}1f` }}>
      {d}
    </span>
  )
}

export default function RoadmapBoard({ solvedSlugs }: { solvedSlugs: Set<string> }) {
  const [open, setOpen] = useState<string | null>(NC250_PATTERNS[0])
  const [todoOnly, setTodoOnly] = useState(false)

  const byPattern = useMemo(() => {
    const m = new Map<string, RoadmapProblem[]>()
    for (const p of NEETCODE250) {
      if (!m.has(p.pattern)) m.set(p.pattern, [])
      m.get(p.pattern)!.push(p)
    }
    return m
  }, [])

  const totalDone = NEETCODE250.filter((p) => solvedSlugs.has(p.slug)).length

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-[17px] font-extrabold uppercase text-ink">NeetCode 250 · Roadmap</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTodoOnly((v) => !v)}
            className={`rounded-full border px-3 py-1 font-mono text-[12px] font-bold transition ${
              todoOnly ? 'border-accent-cyan/60 bg-accent-cyan/15 text-accent-cyan' : 'border-white/15 bg-white/[0.03] text-subtle hover:border-white/30'
            }`}
          >
            {todoOnly ? '✓ to-do only' : 'to-do only'}
          </button>
          <span className="font-mono text-[13px] font-bold text-subtle">
            <span className="text-accent-cyan">{totalDone}</span> / {NEETCODE250.length}
          </span>
        </div>
      </div>
      <p className="mb-3 font-mono text-[11.5px] text-muted">Tagged by difficulty &amp; category · solved auto-checks from your LeetCode · click a category to expand</p>

      <div className="space-y-2">
        {NC250_PATTERNS.map((pat) => {
          const items = byPattern.get(pat) || []
          const done = items.filter((p) => solvedSlugs.has(p.slug)).length
          const isOpen = open === pat
          const shown = todoOnly ? items.filter((p) => !solvedSlugs.has(p.slug)) : items
          return (
            <div key={pat} className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
              <button onClick={() => setOpen(isOpen ? null : pat)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-white/[0.03]">
                <span className={`font-mono text-[12px] text-faint transition ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                <span className="font-display text-[14.5px] font-bold text-ink">{pat}</span>
                <span className="ml-auto font-mono text-[12px] text-muted">{done}/{items.length}</span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
                </div>
              </button>
              {isOpen && (
                <ul className="divide-y divide-white/5 border-t border-white/5">
                  {shown.length === 0 ? (
                    <li className="px-3.5 py-2 font-mono text-[12px] text-accent-cyan">🎉 all done in this category</li>
                  ) : (
                    shown.map((p) => {
                      const solved = solvedSlugs.has(p.slug)
                      return (
                        <li key={p.slug} className="flex items-center gap-3 px-3.5 py-2">
                          <span className={`grid h-4 w-4 place-items-center rounded text-[10px] font-black ${solved ? 'bg-accent-cyan/25 text-accent-cyan' : 'bg-white/8 text-faint'}`}>{solved ? '✓' : ''}</span>
                          <DiffPill d={p.difficulty} />
                          <a href={`https://leetcode.com/problems/${p.slug}/`} target="_blank" rel="noreferrer" className={`text-[13.5px] font-semibold transition hover:text-accent-cyan hover:underline ${solved ? 'text-faint line-through' : 'text-subtle'}`}>
                            {p.title}
                          </a>
                          {solved && <span className="ml-auto font-mono text-[10.5px] text-accent-cyan">solved ✓</span>}
                        </li>
                      )
                    })
                  )}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
