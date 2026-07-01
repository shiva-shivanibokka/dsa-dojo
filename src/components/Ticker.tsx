import type { Problem, Profile } from '../data/types'

// A neon marquee band — recent solves + headline stats, star-separated, scrolling
// forever over a translucent dark strip.
export default function Ticker({ problems, profile }: { problems: Problem[]; profile: Profile }) {
  const bits: string[] = [
    `${profile.totalSolved} SOLVED`,
    `${profile.streak} DAY STREAK`,
    `${profile.byDifficulty.Easy.solved} EASY · ${profile.byDifficulty.Medium.solved} MED · ${profile.byDifficulty.Hard.solved} HARD`,
    ...problems.slice(0, 10).map((p) => p.title.toUpperCase()),
  ]
  if (bits.length <= 3 && problems.length === 0) return null
  const loop = [...bits, ...bits]

  return (
    <div className="overflow-hidden border-y border-white/10 bg-white/[0.03] py-2.5 backdrop-blur-sm">
      <div className="animate-ticker flex w-max items-center whitespace-nowrap pl-8">
        {loop.map((b, i) => (
          <span key={i} className="flex items-center font-mono text-[13px] font-bold uppercase tracking-wider text-subtle">
            {b}
            <span className="px-4 text-accent-cyan">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
