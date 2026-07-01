import type { Profile } from '../data/types'
import { DIFFICULTY_COLOR } from '../lib/patterns'

// A chunky donut of Easy/Med/Hard solved counts, with the total in the middle.
export default function DifficultyRing({ profile, size = 132 }: { profile: Profile; size?: number }) {
  const e = profile.byDifficulty.Easy.solved
  const m = profile.byDifficulty.Medium.solved
  const h = profile.byDifficulty.Hard.solved
  const total = e + m + h || 1

  const r = size / 2 - 12
  const c = 2 * Math.PI * r
  const segs = [
    { v: e, color: DIFFICULTY_COLOR.Easy },
    { v: m, color: DIFFICULTY_COLOR.Medium },
    { v: h, color: DIFFICULTY_COLOR.Hard },
  ]

  let offset = 0
  const arcs = segs.map((s, i) => {
    const frac = s.v / total
    const len = frac * c
    const arc = (
      <circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={s.color}
        strokeWidth={14}
        strokeDasharray={`${len} ${c - len}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    )
    offset += len
    return arc
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {/* track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
      {total > 0 && arcs}
      <text x="50%" y="47%" textAnchor="middle" className="fill-ink font-display" style={{ fontSize: 30, fontWeight: 700 }}>
        {profile.totalSolved}
      </text>
      <text x="50%" y="62%" textAnchor="middle" className="fill-muted font-mono" style={{ fontSize: 11, fontWeight: 700 }}>
        SOLVED
      </text>
    </svg>
  )
}
