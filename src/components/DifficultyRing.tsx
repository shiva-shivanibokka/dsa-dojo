import type { Profile } from '../data/types'
import { DIFFICULTY_COLOR } from '../lib/patterns'

// A chunky donut of Easy/Med/Hard solved counts, with the total in the middle.
export default function DifficultyRing({ profile, size = 132 }: { profile: Profile; size?: number }) {
  const e = profile.byDifficulty.Easy.solved
  const m = profile.byDifficulty.Medium.solved
  const h = profile.byDifficulty.Hard.solved
  const total = e + m + h || 1

  const sw = 15
  const r = size / 2 - sw
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
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${Math.max(len - 2, 0)} ${c - len + 2}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
      />
    )
    offset += len
    return arc
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {/* track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
      {total > 0 && arcs}
      <text x="50%" y="48%" textAnchor="middle" className="fill-ink font-display" style={{ fontSize: 46, fontWeight: 800 }}>
        {profile.totalSolved}
      </text>
      <text x="50%" y="63%" textAnchor="middle" className="fill-muted font-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
        SOLVED
      </text>
    </svg>
  )
}
