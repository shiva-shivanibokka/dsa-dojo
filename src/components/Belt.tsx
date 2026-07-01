import { beltFor } from '../lib/belts'

// A dojo belt banner: the belt swatch + current rank, and progress to the next.
export default function Belt({ solved }: { solved: number }) {
  const b = beltFor(solved)
  const c = b.current.color

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
      {/* belt swatch */}
      <div className="flex items-center gap-3">
        <BeltIcon color={c} />
        <div>
          <div className="font-display text-[22px] font-extrabold uppercase leading-none text-ink" style={{ textShadow: `0 0 18px ${c}66` }}>
            {b.current.name} Belt
          </div>
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[16px] font-bold uppercase tracking-wide text-subtle">
            <span className="text-[22px] leading-none">⚔️</span> {solved} solved
          </div>
        </div>
      </div>

      {/* progress to next */}
      <div className="min-w-[220px] flex-1">
        {b.next ? (
          <>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-mono text-[12.5px] font-bold uppercase tracking-wide text-muted">
                {b.toNext} to <span style={{ color: b.next.color }}>{b.next.name}</span> belt
              </span>
              <span className="font-mono text-[12.5px] font-bold text-faint">{Math.round(b.progress * 100)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${b.progress * 100}%`, background: `linear-gradient(90deg, ${c}, ${b.next.color})`, boxShadow: `0 0 12px ${b.next.color}` }}
              />
            </div>
          </>
        ) : (
          <div className="font-mono text-[13px] font-bold uppercase tracking-wide text-accent-amber">
            ★ Black belt — top rank reached
          </div>
        )}
      </div>
    </div>
  )
}

// A little tied-belt mark in the given colour.
function BeltIcon({ color }: { color: string }) {
  return (
    <div className="relative h-11 w-11 shrink-0">
      <div
        className="absolute left-0 top-1/2 h-3.5 w-full -translate-y-1/2 rounded-sm"
        style={{ background: color, boxShadow: `0 0 14px -2px ${color}` }}
      />
      {/* knot */}
      <div
        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-[5px] border border-black/30"
        style={{ background: color, boxShadow: `0 0 12px -1px ${color}` }}
      />
      {/* tails */}
      <div className="absolute left-[15px] top-1/2 h-4 w-2 rounded-b-sm" style={{ background: color, opacity: 0.85 }} />
      <div className="absolute left-[24px] top-1/2 h-4 w-2 rounded-b-sm" style={{ background: color, opacity: 0.85 }} />
    </div>
  )
}
