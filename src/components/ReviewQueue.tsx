import { useMemo } from 'react'
import type { Dojo } from '../lib/store'
import { CONFIDENCE, DIFFICULTY_COLOR, confOf, rgb } from '../lib/patterns'
import { daysSince, intervalFor, todayISO } from '../lib/review'
import Select from './Select'

// Spaced-repetition queue: problems that are due to be reviewed, most-overdue
// first. Rate your recall and hit "Reviewed" to reset its clock.
export default function ReviewQueue({ dojo }: { dojo: Dojo }) {
  const { problems, get, set } = dojo

  const due = useMemo(() => {
    return problems
      .map((p) => {
        const confidence = get(p.slug, 'confidence')
        const flagged = get(p.slug, 'revisit') === '1'
        const reviewedAt = get(p.slug, 'reviewedAt')
        const base = reviewedAt || p.solvedAt
        const days = daysSince(base)
        const interval = intervalFor(confidence)
        const overdue = days - interval
        const isDue = flagged || days >= interval
        return { p, confidence, flagged, reviewedAt, days, interval, overdue, isDue }
      })
      .filter((x) => x.isDue)
      .sort((a, b) => Number(b.flagged) - Number(a.flagged) || b.overdue - a.overdue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problems, get])

  const reason = (x: (typeof due)[number]): string => {
    if (x.flagged) return '★ flagged to revisit'
    const label = confOf(x.confidence)?.label
    const src = x.reviewedAt ? 'review' : 'solve'
    if (label) return `${label} · ${x.overdue >= 0 ? `${x.overdue}d overdue` : 'due'}`
    return `unrated · ${x.days}d since ${src}`
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-display text-[17px] font-extrabold uppercase text-ink">Due for review</span>
        <span className="font-mono text-[13px] font-bold text-accent-amber">{due.length} due</span>
      </div>
      <p className="mb-3 text-[12.5px] text-muted">
        Spaced repetition — Forgot returns in ~3d, Shaky ~10d, Solid ~30d. Rate your recall, then mark reviewed.
      </p>

      {due.length === 0 ? (
        <p className="py-4 text-center font-mono text-[13.5px] font-bold text-accent-green">🎉 Nothing due — you're all caught up.</p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {due.map((x) => {
            const dRgb = rgb(DIFFICULTY_COLOR[x.p.difficulty])
            return (
              <li
                key={x.p.slug}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
              >
                <span
                  className="rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] font-extrabold uppercase"
                  style={{ color: DIFFICULTY_COLOR[x.p.difficulty], borderColor: `rgba(${dRgb},0.45)`, background: `rgba(${dRgb},0.12)` }}
                >
                  {x.p.difficulty}
                </span>
                <a
                  href={x.p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-bold text-ink transition hover:text-accent-cyan hover:underline"
                >
                  {x.p.title}
                </a>
                <span className="font-mono text-[11.5px] font-semibold text-faint">{reason(x)}</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-[112px]">
                    <Select
                      ariaLabel={`Recall for ${x.p.title}`}
                      value={x.confidence}
                      options={CONFIDENCE}
                      onChange={(v) => set(x.p.slug, 'confidence', v)}
                      placeholder="Recall?"
                    />
                  </div>
                  <button
                    onClick={() => set(x.p.slug, 'reviewedAt', todayISO())}
                    className="rounded-lg border border-accent-green/50 bg-accent-green/15 px-3 py-1.5 text-[13px] font-bold text-accent-green transition hover:-translate-y-px"
                    title="Reset this problem's review clock to today"
                  >
                    ✓ Reviewed
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
