import { useState } from 'react'
import { BLIND75 } from '../data/blind75'

// Progress against the classic Blind 75 interview list, with an expandable
// checklist of the ones still to do.
export default function InterviewProgress({ solvedSlugs }: { solvedSlugs: Set<string> }) {
  const [open, setOpen] = useState(false)
  const done = BLIND75.filter((p) => solvedSlugs.has(p.slug)).length
  const total = BLIND75.length
  const pct = Math.round((done / total) * 100)
  const remaining = BLIND75.filter((p) => !solvedSlugs.has(p.slug))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[17px] font-extrabold uppercase text-ink">Blind 75</span>
        <span className="font-mono text-[13px] font-bold text-subtle">
          <span className="text-accent-cyan">{done}</span> / {total}
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan transition-all duration-500"
          style={{ width: `${Math.max(pct, done > 0 ? 3 : 0)}%`, boxShadow: '0 0 12px rgba(34,211,238,0.7)' }}
        />
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 font-mono text-[12.5px] font-bold text-accent-cyan transition hover:opacity-80"
      >
        {open ? '▾ hide remaining' : `▸ show ${remaining.length} remaining`}
      </button>
      {open && (
        <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto pr-1">
          {remaining.map((p) => (
            <li key={p.slug}>
              <a
                href={`https://leetcode.com/problems/${p.slug}/`}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-subtle transition hover:text-accent-cyan hover:underline"
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
