import type { Difficulty, Profile } from '../data/types'
import { DIFFICULTY_COLOR, DIFFICULTY_ORDER } from '../lib/patterns'
import DifficultyRing from './DifficultyRing'

// The glowing stat band — streak, solved donut, per-difficulty bars,
// patterns covered and the revisit count.
export default function StatsBar({
  profile,
  patterns,
  revisitCount,
}: {
  profile: Profile
  patterns: number
  revisitCount: number
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[auto_1fr_auto]">
      {/* solved donut */}
      <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 shadow-card backdrop-blur-md">
        <DifficultyRing profile={profile} />
      </div>

      {/* per-difficulty bars */}
      <div className="flex flex-col justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12px] font-bold uppercase tracking-wide text-muted">Breakdown</span>
          {profile.ranking && (
            <span className="font-mono text-[12px] font-bold text-faint">rank #{profile.ranking.toLocaleString()}</span>
          )}
        </div>
        {DIFFICULTY_ORDER.map((d) => (
          <Bar key={d} d={d} solved={profile.byDifficulty[d].solved} total={profile.byDifficulty[d].total} />
        ))}
      </div>

      {/* streak + patterns + revisit */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:grid-rows-3">
        <Tile value={`🔥 ${profile.streak}`} label="Day streak" rgb="251,191,36" />
        <Tile value={patterns} label="Patterns" rgb="167,139,250" />
        <Tile value={revisitCount} label="To revisit" rgb="244,114,182" />
      </div>
    </div>
  )
}

function Bar({ d, solved, total }: { d: Difficulty; solved: number; total: number }) {
  const pct = total ? Math.round((solved / total) * 100) : 0
  const color = DIFFICULTY_COLOR[d]
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-mono text-[12.5px] font-bold uppercase" style={{ color }}>
          {d}
        </span>
        <span className="font-mono text-[12.5px] font-bold text-ink">
          {solved}
          <span className="text-faint">/{total}</span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(pct, solved > 0 ? 4 : 0)}%`, background: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  )
}

function Tile({ value, label, rgb }: { value: string | number; label: string; rgb: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border px-3 py-2.5 text-center backdrop-blur-md"
      style={{ borderColor: `rgba(${rgb},0.35)`, background: `rgba(${rgb},0.10)`, boxShadow: `0 0 26px -12px rgba(${rgb},0.7)` }}
    >
      <div className="font-display text-[22px] font-bold leading-none text-ink" style={{ textShadow: `0 0 16px rgba(${rgb},0.6)` }}>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[11.5px] font-bold uppercase tracking-wide text-muted">{label}</div>
    </div>
  )
}
