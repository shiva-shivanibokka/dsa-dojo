import type { Problem } from '../data/types'
import type { Dojo } from '../lib/store'
import { CONFIDENCE, DIFFICULTY_COLOR, rgb, tagColor } from '../lib/patterns'
import { companiesFor } from '../data/companies'
import { ago } from '../lib/format'
import Select from './Select'

export default function ProblemCard({ problem, dojo }: { problem: Problem; dojo: Dojo }) {
  const { get, set } = dojo
  const confidence = get(problem.slug, 'confidence')
  const revisit = get(problem.slug, 'revisit') === '1'
  const notes = get(problem.slug, 'notes') || ''
  const diff = DIFFICULTY_COLOR[problem.difficulty]
  const dRgb = rgb(diff)
  const companies = companiesFor(problem.slug)

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-card backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/20"
      style={{ boxShadow: `inset 3px 0 0 0 rgba(${dRgb},0.9)` }}
    >
      {/* top row: difficulty + id + revisit star */}
      <div className="flex items-center gap-2">
        <span
          className="rounded-md border px-2 py-0.5 font-mono text-[12.5px] font-extrabold uppercase tracking-wide"
          style={{ color: diff, borderColor: `rgba(${dRgb},0.45)`, background: `rgba(${dRgb},0.12)` }}
        >
          {problem.difficulty}
        </span>
        {problem.id > 0 && <span className="font-mono text-[13.5px] font-bold text-faint">#{problem.id}</span>}
        <button
          onClick={() => set(problem.slug, 'revisit', revisit ? undefined : '1')}
          aria-label={revisit ? 'Remove revisit flag' : 'Flag for revisit'}
          title={revisit ? 'Flagged to revisit' : 'Flag for revisit'}
          className={`ml-auto flex h-8 w-8 items-center justify-center rounded-lg border text-[15px] transition hover:-translate-y-px ${
            revisit
              ? 'border-accent-amber/60 bg-accent-amber/15 text-accent-amber shadow-[0_0_14px_-4px_rgba(251,191,36,0.9)]'
              : 'border-white/12 bg-white/[0.03] text-faint'
          }`}
        >
          {revisit ? '★' : '☆'}
        </button>
      </div>

      {/* title */}
      <a
        href={problem.url}
        target="_blank"
        rel="noreferrer"
        className="font-sans text-[16px] font-bold leading-tight text-ink underline-offset-2 transition hover:text-accent-cyan hover:underline"
      >
        {problem.title}
      </a>

      {/* tags */}
      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {problem.tags.map((t) => {
            const r = rgb(tagColor(t))
            return (
              <span
                key={t}
                className="rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-bold"
                style={{ color: tagColor(t), borderColor: `rgba(${r},0.4)`, background: `rgba(${r},0.12)` }}
              >
                {t}
              </span>
            )
          })}
        </div>
      )}

      {/* companies (community-sourced "commonly asked at") */}
      {companies.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-faint">Asked at</span>
          {companies.map((co) => (
            <span
              key={co}
              className="rounded-md border border-white/12 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-subtle"
            >
              {co}
            </span>
          ))}
        </div>
      )}

      {/* controls */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="font-mono text-[13px] font-semibold text-faint">
          {problem.solvedAt ? `solved ${ago(problem.solvedAt)}` : 'solved'}
        </span>
        <div className="ml-auto w-[116px]">
          <Select
            ariaLabel={`Confidence for ${problem.title}`}
            value={confidence}
            options={CONFIDENCE}
            onChange={(v) => set(problem.slug, 'confidence', v)}
            placeholder="Recall?"
          />
        </div>
      </div>

      {/* notes */}
      <input
        value={notes}
        onChange={(e) => set(problem.slug, 'notes', e.target.value)}
        placeholder="+ approach / notes…"
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[13px] font-medium text-ink outline-none transition placeholder:text-faint focus:border-accent-cyan/60 focus:bg-white/[0.05]"
      />
    </div>
  )
}
