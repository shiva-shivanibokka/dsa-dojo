import type { Difficulty, Profile } from '../data/types'
import { DIFFICULTY_COLOR, DIFFICULTY_ORDER } from '../lib/patterns'
import DifficultyRing from './DifficultyRing'

// The loud stat band at the top — streak, solved donut, per-difficulty bars,
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
      <div className="flex items-center justify-center rounded-xl border-2 border-ink bg-card px-6 py-4 shadow-hard">
        <DifficultyRing profile={profile} />
      </div>

      {/* per-difficulty bars */}
      <div className="flex flex-col justify-center gap-3 rounded-xl border-2 border-ink bg-card px-5 py-4 shadow-hard">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12px] font-bold uppercase tracking-wide text-muted">Breakdown</span>
          {profile.ranking && (
            <span className="font-mono text-[12px] font-bold text-faint">
              rank #{profile.ranking.toLocaleString()}
            </span>
          )}
        </div>
        {DIFFICULTY_ORDER.map((d) => (
          <Bar key={d} d={d} solved={profile.byDifficulty[d].solved} total={profile.byDifficulty[d].total} />
        ))}
      </div>

      {/* streak + patterns + revisit */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:grid-rows-3">
        <Tile value={`🔥 ${profile.streak}`} label="Day streak" bg="#FFD24D" />
        <Tile value={patterns} label="Patterns" bg="#C7B4FF" />
        <Tile value={revisitCount} label="To revisit" bg="#FF9E9E" />
      </div>
    </div>
  )
}

function Bar({ d, solved, total }: { d: Difficulty; solved: number; total: number }) {
  const pct = total ? Math.round((solved / total) * 100) : 0
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-mono text-[12.5px] font-bold uppercase" style={{ color: DIFFICULTY_COLOR[d] }}>
          {d}
        </span>
        <span className="font-mono text-[12.5px] font-bold text-ink">
          {solved}
          <span className="text-faint">/{total}</span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
        <div className="h-full rounded-full" style={{ width: `${Math.max(pct, solved > 0 ? 4 : 0)}%`, background: DIFFICULTY_COLOR[d] }} />
      </div>
    </div>
  )
}

function Tile({ value, label, bg }: { value: string | number; label: string; bg: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-ink px-3 py-2.5 text-center shadow-hard" style={{ background: bg }}>
      <div className="font-black text-[24px] leading-none text-ink">{value}</div>
      <div className="mt-1 font-mono text-[11.5px] font-bold uppercase tracking-wide text-ink/70">{label}</div>
    </div>
  )
}
