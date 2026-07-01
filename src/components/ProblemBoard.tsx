import { useMemo, useState } from 'react'
import type { Difficulty } from '../data/types'
import type { Dojo } from '../lib/store'
import { DIFFICULTY_COLOR, DIFFICULTY_ORDER, rgb, tagColor } from '../lib/patterns'
import ProblemCard from './ProblemCard'

type SortKey = 'recent' | 'difficulty' | 'id'

export default function ProblemBoard({ dojo }: { dojo: Dojo }) {
  const { problems, get } = dojo
  const [q, setQ] = useState('')
  const [diff, setDiff] = useState<Difficulty | 'all'>('all')
  const [pattern, setPattern] = useState<string>('all')
  const [onlyRevisit, setOnlyRevisit] = useState(false)
  const [sort, setSort] = useState<SortKey>('recent')
  const [grouped, setGrouped] = useState(false)

  const diffCounts = useMemo(() => {
    const c: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 }
    for (const p of problems) c[p.difficulty] = (c[p.difficulty] || 0) + 1
    return c
  }, [problems])

  const patterns = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of problems) for (const t of p.tags) c[t] = (c[t] || 0) + 1
    return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [problems])

  const needsRevisit = (slug: string) => get(slug, 'revisit') === '1' || get(slug, 'confidence') === 'forgot'
  const revisitCount = useMemo(
    () => problems.filter((p) => needsRevisit(p.slug)).length,
    [problems, get], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const diffRank: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }
    let list = problems.filter((p) => {
      if (diff !== 'all' && p.difficulty !== diff) return false
      if (pattern !== 'all' && !p.tags.includes(pattern)) return false
      if (onlyRevisit && !needsRevisit(p.slug)) return false
      if (!needle) return true
      return [p.title, String(p.id), ...p.tags].join(' ').toLowerCase().includes(needle)
    })
    list = [...list].sort((a, b) => {
      if (sort === 'id') return (a.id || 0) - (b.id || 0)
      if (sort === 'difficulty') return diffRank[a.difficulty] - diffRank[b.difficulty]
      return (b.solvedAt || '').localeCompare(a.solvedAt || '')
    })
    return list
  }, [problems, q, diff, pattern, onlyRevisit, sort, get]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* difficulty + revisit filters — heading in its own column so wrapped chips stay aligned */}
      <div className="flex gap-3">
        <span className="w-[76px] shrink-0 pt-2 font-mono text-[13px] font-bold uppercase tracking-wide text-muted">Difficulty</span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Chip active={diff === 'all'} label="All" count={problems.length} color="#a78bfa" onClick={() => setDiff('all')} />
          {DIFFICULTY_ORDER.map((d) => (
            <Chip key={d} active={diff === d} label={d} count={diffCounts[d] || 0} color={DIFFICULTY_COLOR[d]} onClick={() => setDiff(d)} />
          ))}
          <button
            onClick={() => setOnlyRevisit((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] font-bold transition hover:-translate-y-px ${
              onlyRevisit
                ? 'border-accent-amber/60 bg-accent-amber/15 text-accent-amber shadow-[0_0_16px_-6px_rgba(251,191,36,0.9)]'
                : 'border-white/12 bg-white/[0.03] text-subtle hover:border-white/25'
            }`}
          >
            ★ Needs revisit <span className="tabular-nums opacity-70">{revisitCount}</span>
          </button>
        </div>
      </div>

      {/* pattern filter */}
      <div className="mt-3 flex gap-3">
        <span className="w-[76px] shrink-0 pt-2 font-mono text-[13px] font-bold uppercase tracking-wide text-muted">Pattern</span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Chip active={pattern === 'all'} label="All" count={problems.length} color="#a78bfa" onClick={() => setPattern('all')} />
          {patterns.map(([t, n]) => (
            <Chip key={t} active={pattern === t} label={t} count={n} color={tagColor(t)} onClick={() => setPattern(t)} />
          ))}
        </div>
      </div>

      {/* search + sort */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="m14 14 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, number, or tag…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-[14px] font-medium text-ink outline-none backdrop-blur-md placeholder:text-faint focus:border-accent-cyan/60"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
          {(['recent', 'difficulty', 'id'] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition ${
                sort === s ? 'bg-white/10 text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {s === 'recent' ? 'Recent' : s === 'difficulty' ? 'Difficulty' : '# Number'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setGrouped((v) => !v)}
          className={`rounded-xl border px-3.5 py-2.5 text-[13px] font-bold transition ${
            grouped
              ? 'border-accent-purple/60 bg-accent-purple/15 text-accent-purple shadow-[0_0_16px_-6px_rgba(167,139,250,0.9)]'
              : 'border-white/10 bg-white/[0.04] text-muted hover:text-ink'
          }`}
        >
          ⊞ Group by pattern
        </button>
      </div>

      {/* grid */}
      {visible.length === 0 ? (
        <p className="mt-12 text-center font-mono text-[14px] font-bold text-muted">No problems match.</p>
      ) : grouped ? (
        <div className="mt-5 flex flex-col gap-7">
          {groupByPattern(visible).map(([tag, items]) => (
            <div key={tag}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: tagColor(tag), boxShadow: `0 0 8px ${tagColor(tag)}` }} />
                <h3 className="font-display text-[16px] font-extrabold uppercase text-ink">{tag}</h3>
                <span className="font-mono text-[13px] font-bold text-faint">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => (
                  <ProblemCard key={p.slug} problem={p} dojo={dojo} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <ProblemCard key={p.slug} problem={p} dojo={dojo} />
          ))}
        </div>
      )}

      <p className="mt-5 text-center font-mono text-[14.5px] font-bold text-subtle">
        Showing {visible.length} of {problems.length} solved
        {diff !== 'all' && <> · {diff}</>}
        {pattern !== 'all' && <> · {pattern}</>}
        {onlyRevisit && <> · needs revisit</>}
      </p>
    </div>
  )
}

// Group problems by pattern (a problem appears under each of its tags), sections
// ordered by size then name.
function groupByPattern(items: import('../data/types').Problem[]): [string, import('../data/types').Problem[]][] {
  const map = new Map<string, import('../data/types').Problem[]>()
  for (const p of items) {
    for (const t of p.tags) {
      if (!map.has(t)) map.set(t, [])
      map.get(t)!.push(p)
    }
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
}

function Chip({
  active,
  label,
  count,
  color,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  color: string
  onClick: () => void
}) {
  const r = rgb(color)
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] font-bold transition hover:-translate-y-px ${
        active ? 'text-ink' : 'border-white/12 bg-white/[0.03] text-subtle hover:border-white/25'
      }`}
      style={active ? { borderColor: `rgba(${r},0.6)`, background: `rgba(${r},0.16)`, boxShadow: `0 0 16px -6px rgba(${r},0.9)` } : undefined}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
      <span className="tabular-nums opacity-70">{count}</span>
    </button>
  )
}
