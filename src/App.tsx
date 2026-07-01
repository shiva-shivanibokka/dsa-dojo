import { useMemo, useState } from 'react'
import { useDojo } from './lib/store'
import { hasToken } from './lib/github'
import { shortDate } from './lib/format'
import StatsBar from './components/StatsBar'
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

  return (
    <div className="min-h-screen">
      {/* header */}
      <header className="border-b-2 border-ink bg-paper/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-coral text-[20px] shadow-hardsm">
              🥋
            </span>
            <div>
              <h1 className="font-black text-[26px] leading-none tracking-tight text-ink">DSA DOJO</h1>
              <p className="mt-1 font-mono text-[12.5px] font-bold uppercase tracking-wide text-grapeInk">
                Grind. Pattern. Master.
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {dojo.generatedAt && (
              <span className="hidden font-mono text-[12.5px] font-semibold text-faint sm:inline">
                Synced {shortDate(dojo.generatedAt)} · {dojo.problems.length} solved
              </span>
            )}
            <SyncBadge state={dojo.syncState} onManual={dojo.syncNow} />
            <button
              onClick={() => (tokenOn ? dojo.syncNow() : dojo.exportOverrides())}
              className="rounded-lg border-2 border-ink bg-lime px-3.5 py-2 text-[13.5px] font-bold text-ink shadow-hard transition hover:-translate-y-0.5"
            >
              {tokenOn ? 'Save now' : 'Back up'}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-grape text-ink shadow-hard transition hover:-translate-y-0.5"
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

      <main className="mx-auto max-w-6xl px-5 pb-10 pt-6">
        {dojo.loading ? (
          <p className="mt-16 text-center font-mono text-[15px] font-bold text-muted">Loading your dojo…</p>
        ) : dojo.error ? (
          <p className="mt-16 text-center font-mono text-[14px] font-bold" style={{ color: '#C22' }}>
            Couldn’t load problems: {dojo.error}
          </p>
        ) : (
          <>
            <StatsBar profile={dojo.profile} patterns={patternCount} revisitCount={revisitCount} />
            <div className="mt-7">
              <ProblemBoard dojo={dojo} />
            </div>
          </>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-1">
        <p className="text-center font-mono text-[12.5px] font-semibold text-faint">
          New solves appear here automatically — solve on LeetCode, the dojo picks them up.
        </p>
      </footer>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChange={() => setTokenOn(hasToken())}
      />
    </div>
  )
}
