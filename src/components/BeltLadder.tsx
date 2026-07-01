import { BELTS, beltFor } from '../lib/belts'

// The full belt progression as a row — reached belts glow, the current one is
// highlighted with a "YOU" tag.
export default function BeltLadder({ solved }: { solved: number }) {
  const current = beltFor(solved).current.name

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 shadow-card backdrop-blur-md">
      <div className="mb-3 font-mono text-[13px] font-bold uppercase tracking-wide text-muted">Belt ladder</div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {BELTS.map((b) => {
          const active = b.name === current
          const reached = solved >= b.min
          return (
            <div
              key={b.name}
              className="relative flex min-w-[96px] flex-1 flex-col items-center gap-2 rounded-xl border px-2 py-3 transition"
              style={
                active
                  ? { borderColor: `${b.color}99`, background: `${b.color}1f`, boxShadow: `0 0 22px -8px ${b.color}` }
                  : { borderColor: 'rgba(255,255,255,0.08)' }
              }
            >
              {active && (
                <span className="absolute -top-2 rounded-full border border-white/15 bg-canvas px-2 py-0.5 font-mono text-[9.5px] font-extrabold uppercase tracking-wide text-accent-cyan">
                  You
                </span>
              )}
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
              <span className="font-mono text-[12px] font-bold" style={{ color: active ? b.color : '#6A6796' }}>
                {b.min}+
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
