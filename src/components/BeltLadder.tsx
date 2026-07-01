import type { CSSProperties } from 'react'
import { BELTS, beltFor } from '../lib/belts'

// The full belt progression as a row — reached belts glow, the current one is
// highlighted with a "YOU" tag.
export default function BeltLadder({ solved }: { solved: number }) {
  const current = beltFor(solved).current.name

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 shadow-card backdrop-blur-md">
      <div className="mb-3 font-mono text-[13px] font-bold uppercase tracking-wide text-muted">Belt ladder</div>
      <div className="flex gap-2.5 overflow-x-auto px-1 py-1">
        {BELTS.map((b) => {
          const active = b.name === current // where you are now → pulsing border
          const reached = solved >= b.min
          const earned = reached && !active // belts you've crossed → solid glowing border

          const style: Record<string, string | undefined> = {}
          if (earned) {
            // belts you've crossed → steady solid border in their own colour
            style.borderColor = b.color
            style.boxShadow = `0 0 14px -4px ${b.color}`
          } else if (!active) {
            style.borderColor = 'rgba(255,255,255,0.08)'
          }

          return (
            <div
              key={b.name}
              className={`flex min-w-[96px] flex-1 flex-col items-center gap-2 rounded-xl border px-2 py-3 ${active ? 'belt-current' : ''}`}
              style={style as CSSProperties}
            >
              <span
                className="h-3 w-full rounded-full"
                style={{
                  background: reached ? b.color : `${b.color}26`,
                  boxShadow: reached ? `0 0 10px ${b.color}` : undefined,
                }}
              />
              <span
                className="font-display text-[14px] font-extrabold uppercase leading-none"
                style={{ color: reached ? '#EDECFF' : '#6A6796' }}
              >
                {b.name}
              </span>
              <span className="font-mono text-[12px] font-bold" style={{ color: active || earned ? b.color : '#6A6796' }}>
                {b.min}+
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
