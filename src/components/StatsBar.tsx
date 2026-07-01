import type { Difficulty, Profile } from '../data/types'
import { DIFFICULTY_COLOR, DIFFICULTY_ORDER } from '../lib/patterns'
import DifficultyRing from './DifficultyRing'

// Big solved-circle with the small stat boxes beside it, and the difficulty
// breakdown in a full-width bar below.
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
    <div className="flex flex-col gap-4">
      {/* top row: BIG circle + small boxes beside it */}
      <div className="grid gap-4 sm:grid-cols-[minmax(0,250px)_1fr]">
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-5 shadow-card backdrop-blur-md">
          <DifficultyRing profile={profile} size={190} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Tile value={`🔥 ${profile.streak}`} label="Day streak" rgb="251,191,36" />
          <Tile value={patterns} label="Patterns" rgb="167,139,250" />
          <Tile value={revisitCount} label="To revisit" rgb="244,114,182" />
        </div>
      </div>

      {/* full-width breakdown below */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[12.5px] font-bold uppercase tracking-wide text-muted">Breakdown</span>
          {profile.ranking && (
            <span className="font-mono text-[12.5px] font-bold text-faint">rank #{profile.ranking.toLocaleString()}</span>
          )}
        </div>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-3">
          {DIFFICULTY_ORDER.map((d) => (
            <Bar key={d} d={d} solved={profile.byDifficulty[d].solved} total={profile.byDifficulty[d].total} />
          ))}
        </div>
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
        <span className="font-mono text-[13px] font-bold uppercase" style={{ color }}>
          {d}
        </span>
        <span className="font-mono text-[13px] font-bold text-ink">
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
      className="flex flex-col items-center justify-center rounded-2xl border px-3 py-4 text-center backdrop-blur-md"
      style={{ borderColor: `rgba(${rgb},0.35)`, background: `rgba(${rgb},0.10)`, boxShadow: `0 0 30px -14px rgba(${rgb},0.8)` }}
    >
      <div
        className="font-display text-[30px] font-extrabold leading-none text-ink"
        style={{ textShadow: `0 0 18px rgba(${rgb},0.55)` }}
      >
        {value}
      </div>
      <div className="mt-2 font-mono text-[11.5px] font-bold uppercase tracking-wide text-muted">{label}</div>
    </div>
  )
}
