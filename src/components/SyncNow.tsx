import { useRef, useState } from 'react'
import { dispatchSync, hasToken, latestRun } from '../lib/github'

// One-click LeetCode sync: kicks off the deploy workflow, watches it, and
// auto-reloads when it finishes (~1 min) so newly-solved problems appear.
type State = 'idle' | 'starting' | 'running' | 'done' | 'error'

export default function SyncNow() {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')
  const tries = useRef(0)

  const poll = (beforeId: number | null) => {
    tries.current += 1
    latestRun().then((run) => {
      if (run && run.id !== beforeId && run.status === 'completed') {
        setState('done')
        setTimeout(() => window.location.reload(), 800)
        return
      }
      if (tries.current > 24) {
        setMsg('taking a while — refresh soon')
        setState('idle')
        return
      }
      window.setTimeout(() => poll(beforeId), 8000)
    })
  }

  const run = async () => {
    if (!hasToken()) {
      setState('error')
      setMsg('add a token in settings first')
      return
    }
    setState('starting')
    setMsg('')
    const before = await latestRun()
    const res = await dispatchSync()
    if (!res.ok) {
      setState('error')
      setMsg(res.message)
      return
    }
    setState('running')
    tries.current = 0
    window.setTimeout(() => poll(before?.id ?? null), 6000)
  }

  const label =
    state === 'starting' ? 'Starting…' : state === 'running' ? 'Syncing…' : state === 'done' ? 'Reloading' : '⟳ Sync now'
  const busy = state === 'starting' || state === 'running' || state === 'done'

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={run}
        disabled={busy}
        title="Pull your latest LeetCode solves now (~1 min)"
        className={`rounded-xl border px-4 py-2.5 text-[14px] font-bold transition ${
          busy
            ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan/70'
            : 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan shadow-glowcyan hover:-translate-y-0.5'
        }`}
      >
        {busy && <span className="mr-1.5 inline-block animate-spin">⟳</span>}
        {label}
      </button>
      {msg && <span className="font-mono text-[11px] text-faint">{msg}</span>}
    </div>
  )
}
