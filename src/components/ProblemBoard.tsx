import { useMemo, useState } from 'react'
import type { Difficulty } from '../data/types'
import type { Dojo } from '../lib/store'
import { DIFFICULTY_COLOR, DIFFICULTY_ORDER, tagColor } from '../lib/patterns'
import ProblemCard from './ProblemCard'

type SortKey = 'recent' | 'difficulty' | 'id'

export default function ProblemBoard({ dojo }: { dojo: Dojo }) {
  const { problems, get } = dojo
  const [q, setQ] = useState('')
  const [diff, setDiff] = useState<Difficulty | 'all'>('all')
  const [pattern, setPattern] = useState<string>('all')
  const [onlyRevisit, setOnlyRevisit] = useState(false)
  const [sort, setSort] = useState<SortKey>('recent')

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
      {/* difficulty + revisit filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[13px] font-bold uppercase tracking-wide text-muted">Difficulty</span>
        <Chip active={diff === 'all'} label="All" count={problems.length} color="#141210" light onClick={() => setDiff('all')} />
        {DIFFICULTY_ORDER.map((d) => (
          <Chip key={d} active={diff === d} label={d} count={diffCounts[d] || 0} color={DIFFICULTY_COLOR[d]} onClick={() => setDiff(d)} />
        ))}
        <button
          onClick={() => setOnlyRevisit((v) => !v)}
          className={`ml-1 inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-[13px] font-bold text-ink shadow-hardsm transition hover:-translate-y-px ${
            onlyRevisit ? 'bg-gold' : 'bg-card'
          }`}
        >
          ★ Needs revisit <span className="tabular-nums opacity-70">{revisitCount}</span>
        </button>
      </div>

      {/* pattern filter */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[13px] font-bold uppercase tracking-wide text-muted">Pattern</span>
        <Chip active={pattern === 'all'} label="All" count={problems.length} color="#141210" light onClick={() => setPattern('all')} />
        {patterns.map(([t, n]) => (
          <Chip key={t} active={pattern === t} label={t} count={n} color={tagColor(t)} onClick={() => setPattern(t)} />
        ))}
      </div>

      {/* search + sort */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
            <path d="m14 14 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, number, or tag…"
            className="w-full rounded-lg border-2 border-ink bg-card py-2.5 pl-9 pr-3 text-[14px] font-medium text-ink shadow-hardsm outline-none placeholder:text-faint focus:-translate-y-px"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border-2 border-ink bg-card p-1 shadow-hardsm">
          {(['recent', 'difficulty', 'id'] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded px-3 py-1.5 text-[13px] font-bold transition ${
                sort === s ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              {s === 'recent' ? 'Recent' : s === 'difficulty' ? 'Difficulty' : '# Number'}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      {visible.length === 0 ? (
        <p className="mt-12 text-center font-mono text-[14px] font-bold text-muted">No problems match.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <ProblemCard key={p.slug} problem={p} dojo={dojo} />
          ))}
        </div>
      )}

      <p className="mt-5 text-center font-mono text-[13.5px] font-bold text-muted">
        Showing {visible.length} of {problems.length} solved
        {diff !== 'all' && <> · {diff}</>}
        {pattern !== 'all' && <> · {pattern}</>}
        {onlyRevisit && <> · needs revisit</>}
      </p>
    </div>
  )
}

function Chip({
  active,
  label,
  count,
  color,
  light,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  color: string
  light?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-[13px] font-bold text-ink transition hover:-translate-y-px ${
        active ? 'shadow-hardsm' : 'bg-card hover:shadow-hardsm'
      }`}
      style={active ? { background: light ? '#141210' : color, color: light ? '#FBF6EA' : '#141210' } : undefined}
    >
      <span className="h-2.5 w-2.5 rounded-full border border-ink" style={{ background: color }} />
      {label}
      <span className="tabular-nums opacity-70">{count}</span>
    </button>
  )
}
