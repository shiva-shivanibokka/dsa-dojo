import { CANONICAL_PATTERNS } from '../data/patternsCanonical'

// The core interview patterns you haven't solved a single problem for yet — a
// study to-do list.
export default function PatternsToLearn({ solvedTags }: { solvedTags: Set<string> }) {
  const untouched = CANONICAL_PATTERNS.filter((p) => !p.tags.some((t) => solvedTags.has(t)))

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-card backdrop-blur-md">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[17px] font-extrabold uppercase text-ink">Patterns to learn next</span>
        <span className="font-mono text-[13px] font-bold text-faint">{untouched.length} left</span>
      </div>
      {untouched.length === 0 ? (
        <p className="mt-3 font-mono text-[13px] font-bold text-accent-green">🎉 You've touched every core pattern!</p>
      ) : (
        <>
          <p className="mt-1.5 text-[12.5px] text-muted">You haven't solved anything tagged with these yet:</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {untouched.map((p) => (
              <span
                key={p.name}
                className="rounded-full border border-accent-purple/40 bg-accent-purple/10 px-3 py-1 text-[13px] font-bold text-accent-purple"
              >
                {p.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
