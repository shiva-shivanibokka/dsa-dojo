import type { Problem } from '../data/types'
import type { Dojo } from '../lib/store'
import { CONFIDENCE, DIFFICULTY_COLOR, tagColor } from '../lib/patterns'
import { ago } from '../lib/format'
import Select from './Select'

export default function ProblemCard({ problem, dojo }: { problem: Problem; dojo: Dojo }) {
  const { get, set } = dojo
  const confidence = get(problem.slug, 'confidence')
  const revisit = get(problem.slug, 'revisit') === '1'
  const notes = get(problem.slug, 'notes') || ''
  const diffColor = DIFFICULTY_COLOR[problem.difficulty]

  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 border-ink bg-card p-4 shadow-hard transition hover:-translate-y-0.5 hover:shadow-hardlg">
      {/* top row: difficulty + id + revisit star */}
      <div className="flex items-center gap-2">
        <span
          className="rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[11.5px] font-extrabold uppercase tracking-wide text-ink"
          style={{ background: diffColor }}
        >
          {problem.difficulty}
        </span>
        {problem.id > 0 && <span className="font-mono text-[12.5px] font-bold text-faint">#{problem.id}</span>}
        <button
          onClick={() => set(problem.slug, 'revisit', revisit ? undefined : '1')}
          aria-label={revisit ? 'Remove revisit flag' : 'Flag for revisit'}
          title={revisit ? 'Flagged to revisit' : 'Flag for revisit'}
          className={`ml-auto flex h-8 w-8 items-center justify-center rounded-md border-2 border-ink text-[15px] shadow-hardsm transition hover:-translate-y-px ${
            revisit ? 'bg-gold' : 'bg-card'
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
        className="font-display text-[17px] font-bold leading-tight text-ink underline-offset-2 hover:underline"
      >
        {problem.title}
      </a>

      {/* tags */}
      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {problem.tags.map((t) => (
            <span
              key={t}
              className="rounded border-2 border-ink px-1.5 py-0.5 font-mono text-[11px] font-bold text-ink"
              style={{ background: tagColor(t) }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* controls */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="font-mono text-[12px] font-semibold text-faint">
          {problem.solvedAt ? `solved ${ago(problem.solvedAt)}` : 'solved'}
        </span>
        <div className="ml-auto w-[112px]">
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
        className="w-full rounded-md border-2 border-ink/25 bg-paper px-2.5 py-1.5 text-[13px] font-medium text-ink outline-none transition placeholder:text-faint focus:border-ink"
      />
    </div>
  )
}
