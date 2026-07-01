import { useMemo, useState } from 'react'
import { useDojo } from './lib/store'
import { hasToken } from './lib/github'
import { shortDate } from './lib/format'
import StarfieldBackground from './components/StarfieldBackground'
import StatsBar from './components/StatsBar'
import Belt from './components/Belt'
import Heatmap from './components/Heatmap'
import InterviewProgress from './components/InterviewProgress'
import PatternsToLearn from './components/PatternsToLearn'
import { BLIND75 } from './data/blind75'
import { NEETCODE150 } from './data/neetcode150'
import Ticker from './components/Ticker'
import ProblemBoard from './components/ProblemBoard'
import SettingsModal, { SyncBadge } from './components/SettingsModal'

export default function App() {
  const dojo = useDojo()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tokenOn, setTokenOn] = useState(hasToken())

  const patternCount = useMemo(() => {
    const s = new Set<string>()
    for (const p of dojo.problems) for (const t of p.tags) s.add(t)
    return s.size
  }, [dojo.problems])

  const revisitCount = useMemo(
    () => dojo.problems.filter((p) => dojo.get(p.slug, 'revisit') === '1' || dojo.get(p.slug, 'confidence') === 'forgot').length,
    [dojo.problems, dojo.get],
  )

  const solvedSlugs = useMemo(() => new Set(dojo.problems.map((p) => p.slug)), [dojo.problems])
  const solvedTags = useMemo(() => {
    const s = new Set<string>()
    for (const p of dojo.problems) for (const t of p.tags) s.add(t)
    return s
  }, [dojo.problems])

  return (
    <div className="min-h-screen">
      <StarfieldBackground />

      {/* header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-canvas/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-cyan text-[38px] leading-none shadow-glow">
              🥋
            </span>
            <div>
              <h1 className="bg-gradient-to-r from-accent-indigo via-accent-blue to-accent-cyan bg-clip-text font-display text-[38px] font-extrabold uppercase leading-none tracking-tight text-transparent [text-shadow:0_0_28px_rgba(99,102,241,0.35)]">
                DSA Dojo
              </h1>
              <p className="mt-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-accent-cyan">
                Grind. Pattern. Master.
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {dojo.generatedAt && (
              <span className="hidden font-mono text-[14px] font-semibold text-subtle sm:inline">
                Synced {shortDate(dojo.generatedAt)} · {dojo.problems.length} solved
              </span>
            )}
            <SyncBadge state={dojo.syncState} onManual={dojo.syncNow} />
            <button
              onClick={() => (tokenOn ? dojo.syncNow() : dojo.exportOverrides())}
              className="rounded-xl bg-gradient-to-r from-accent-indigo to-accent-cyan px-4 py-2.5 text-[14px] font-bold text-canvas shadow-glow transition hover:-translate-y-0.5"
            >
              {tokenOn ? 'Save now' : 'Back up'}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan shadow-glowcyan transition hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <Ticker problems={dojo.problems} profile={dojo.profile} />

      <main className="mx-auto max-w-6xl px-5 pb-3 pt-7">
        {dojo.loading ? (
          <p className="mt-16 text-center font-mono text-[15px] font-bold text-muted">Loading your dojo…</p>
        ) : dojo.error ? (
          <p className="mt-16 text-center font-mono text-[14px] font-bold text-accent-rose">
            Couldn’t load problems: {dojo.error}
          </p>
        ) : (
          <>
            <Belt solved={dojo.profile.totalSolved} />
            <div className="mt-4">
              <StatsBar profile={dojo.profile} problems={dojo.problems} patterns={patternCount} revisitCount={revisitCount} />
            </div>
            <div className="mt-4">
              <Heatmap calendar={dojo.profile.calendar} total={dojo.profile.submissionsPastYear} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InterviewProgress name="Blind 75" items={BLIND75} solvedSlugs={solvedSlugs} />
              <InterviewProgress name="NeetCode 150" items={NEETCODE150} solvedSlugs={solvedSlugs} />
            </div>
            <div className="mt-4">
              <PatternsToLearn solvedTags={solvedTags} />
            </div>
            <div className="mt-8">
              <ProblemBoard dojo={dojo} />
            </div>
          </>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10">
        <p className="text-center font-mono text-[14px] font-semibold text-faint">
          New solves appear here automatically — solve on LeetCode, the dojo picks them up.
        </p>
      </footer>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onChange={() => setTokenOn(hasToken())} />
    </div>
  )
}
