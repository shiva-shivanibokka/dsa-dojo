import type { Problem, Profile } from '../data/types'

// The signature coral marquee band — recent solves + headline stats, separated
// by stars, scrolling forever. Pure personality, like the reference.
export default function Ticker({ problems, profile }: { problems: Problem[]; profile: Profile }) {
  const bits: string[] = [
    `${profile.totalSolved} SOLVED`,
    `${profile.streak} DAY STREAK`,
    `${profile.byDifficulty.Easy.solved} EASY · ${profile.byDifficulty.Medium.solved} MED · ${profile.byDifficulty.Hard.solved} HARD`,
    ...problems.slice(0, 10).map((p) => p.title.toUpperCase()),
  ]
  if (bits.length === 0) return null
  const loop = [...bits, ...bits]

  return (
    <div className="overflow-hidden border-y-[3px] border-ink bg-coral py-2.5">
      <div className="animate-ticker flex w-max items-center whitespace-nowrap pl-8">
        {loop.map((b, i) => (
          <span key={i} className="flex items-center font-mono text-[14px] font-extrabold uppercase tracking-wider text-ink">
            {b}
            <span className="px-4 text-[13px]">★</span>
          </span>
        ))}
      </div>
    </div>
  )
}
