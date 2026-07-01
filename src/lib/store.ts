import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { OverrideKey, Overrides, Problem, ProblemsFile, Profile } from '../data/types'
import { commitJson, hasToken, type SyncState } from './github'

const LS_KEY = 'dojo-overrides-v1'
const base = import.meta.env.BASE_URL

const EMPTY_PROFILE: Profile = {
  ranking: null,
  totalSolved: 0,
  byDifficulty: { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } },
  streak: 0,
  totalActiveDays: 0,
  submissionsPastYear: 0,
  calendar: {},
}

function readLocal(): Overrides {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}
function writeLocal(o: Overrides) {
  localStorage.setItem(LS_KEY, JSON.stringify(o))
}

// committed baseline (overrides.json) with the browser's unsynced edits on top
function merge(baseline: Overrides, local: Overrides): Overrides {
  const out: Overrides = {}
  const slugs = new Set([...Object.keys(baseline), ...Object.keys(local)])
  for (const s of slugs) out[s] = { ...(baseline[s] || {}), ...(local[s] || {}) }
  return out
}

function clean(effective: Overrides): Overrides {
  const out: Overrides = {}
  for (const [slug, ov] of Object.entries(effective)) {
    const entries = Object.entries(ov).filter(([, v]) => v != null && v !== '')
    if (entries.length) out[slug] = Object.fromEntries(entries)
  }
  return out
}

export interface Dojo {
  loading: boolean
  error: string | null
  generatedAt: string | null
  profile: Profile
  problems: Problem[]
  get: (slug: string, key: OverrideKey) => string | undefined
  set: (slug: string, key: OverrideKey, value: string | undefined) => void
  dirtyCount: number
  exportOverrides: () => void
  syncState: SyncState
  syncNow: () => void
}

export function useDojo(): Dojo {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [problems, setProblems] = useState<Problem[]>([])
  const [baseline, setBaseline] = useState<Overrides>({})
  const [local, setLocal] = useState<Overrides>(() => readLocal())
  const [syncState, setSyncState] = useState<SyncState>(hasToken() ? 'idle' : 'off')
  const timer = useRef<number>()

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`${base}problems.json`).then((r) => {
        if (!r.ok) throw new Error(`problems.json ${r.status}`)
        return r.json() as Promise<ProblemsFile>
      }),
      fetch(`${base}overrides.json`)
        .then((r) => (r.ok ? (r.json() as Promise<Overrides>) : {}))
        .catch(() => ({}) as Overrides),
    ])
      .then(([pf, ov]) => {
        if (cancelled) return
        setProblems(pf.problems || [])
        setProfile(pf.profile || EMPTY_PROFILE)
        setGeneratedAt(pf.generatedAt || null)
        setBaseline(ov || {})
      })
      .catch((e) => !cancelled && setError(String(e?.message || e)))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const effective = useMemo(() => merge(baseline, local), [baseline, local])
  const get = useCallback((slug: string, key: OverrideKey) => effective[slug]?.[key], [effective])

  const set = useCallback((slug: string, key: OverrideKey, value: string | undefined) => {
    setLocal((prev) => {
      const next: Overrides = { ...prev, [slug]: { ...(prev[slug] || {}) } }
      if (value === undefined || value === '') delete next[slug][key]
      else next[slug][key] = value
      if (Object.keys(next[slug]).length === 0) delete next[slug]
      writeLocal(next)
      return next
    })
  }, [])

  const dirtyCount = useMemo(() => {
    let n = 0
    for (const slug of Object.keys(local)) {
      const l = local[slug] || {}
      const b = baseline[slug] || {}
      for (const k of Object.keys(l) as OverrideKey[]) if (l[k] !== b[k]) n++
    }
    return n
  }, [local, baseline])

  const syncNow = useCallback(() => {
    if (!hasToken()) return
    const payload = clean(effective)
    setSyncState('saving')
    commitJson('public/overrides.json', payload, 'Update DSA Dojo notes & confidence')
      .then(() => {
        setBaseline(payload)
        setLocal({})
        writeLocal({})
        setSyncState('saved')
      })
      .catch(() => setSyncState('error'))
  }, [effective])

  // Debounced auto-commit whenever there are unsaved edits and a token is set.
  useEffect(() => {
    if (loading || !hasToken() || dirtyCount === 0) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(syncNow, 3500)
    return () => window.clearTimeout(timer.current)
  }, [local, dirtyCount, loading, syncNow])

  const exportOverrides = useCallback(() => {
    const blob = new Blob([JSON.stringify(clean(effective), null, 2) + '\n'], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'overrides.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [effective])

  return {
    loading,
    error,
    generatedAt,
    profile,
    problems,
    get,
    set,
    dirtyCount,
    exportOverrides,
    syncState,
    syncNow,
  }
}
