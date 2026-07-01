import { useState } from 'react'
import { createPortal } from 'react-dom'
import { getToken, setToken, verifyToken } from '../lib/github'

// Lets the user paste a fine-grained GitHub token to enable auto-sync. The token
// lives only in localStorage (never committed). We never see or transmit it
// anywhere except GitHub's API.
export default function SettingsModal({ open, onClose, onChange }: { open: boolean; onClose: () => void; onChange: () => void }) {
  const [token, setTok] = useState(getToken())
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    getToken() ? { ok: true, msg: 'Auto-sync is on' } : null,
  )
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const save = async () => {
    const t = token.trim()
    if (!t) {
      setToken('')
      onChange()
      setStatus({ ok: false, msg: 'Token cleared — auto-sync off' })
      return
    }
    setBusy(true)
    const res = await verifyToken(t)
    setBusy(false)
    if (res.ok) {
      setToken(t)
      onChange()
      setStatus({ ok: true, msg: 'Connected — auto-sync is on' })
    } else {
      setStatus({ ok: false, msg: res.message })
    }
  }

  const clear = () => {
    setToken('')
    setTok('')
    onChange()
    setStatus({ ok: false, msg: 'Token cleared — auto-sync off' })
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/12 bg-[#12101f] p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-[18px] font-bold text-ink">Auto-sync to GitHub</h2>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-faint transition hover:bg-white/10 hover:text-ink">
            ✕
          </button>
        </div>

        <p className="mt-3 text-[13.5px] leading-relaxed text-subtle">
          Paste a <b className="text-ink">fine-grained personal access token</b> and your confidence, revisit flags &
          notes commit straight to the repo — no downloading files. The token is stored{' '}
          <b className="text-ink">only in this browser</b> and is never committed or sent anywhere except GitHub.
        </p>

        <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13px] text-faint">
          <li>
            Open{' '}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-accent-cyan hover:underline"
            >
              github.com/settings/personal-access-tokens
            </a>
          </li>
          <li>Repository access → <b className="text-ink">Only select repositories</b> → <b className="text-ink">dsa-dojo</b></li>
          <li>Permissions → <b className="text-ink">Contents</b> → <b className="text-ink">Read and write</b></li>
          <li>Generate, copy, and paste it below.</li>
        </ol>

        <input
          type="password"
          value={token}
          onChange={(e) => setTok(e.target.value)}
          placeholder="github_pat_…"
          className="mt-4 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 font-mono text-[13px] text-ink outline-none transition placeholder:text-faint focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
        />

        {status && (
          <p className="mt-2 text-[13px] font-bold" style={{ color: status.ok ? '#34d399' : '#fb7185' }}>
            {status.ok ? '✓ ' : '⚠ '}
            {status.msg}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button onClick={clear} className="text-[13px] font-semibold text-faint transition hover:text-accent-rose">
            Remove token
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border border-white/12 px-4 py-2 text-[13.5px] font-semibold text-subtle transition hover:text-ink">
              Close
            </button>
            <button
              onClick={save}
              disabled={busy}
              className="rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan px-4 py-2 text-[13.5px] font-bold text-canvas shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? 'Checking…' : 'Save & connect'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function SyncBadge({ state, onManual }: { state: string; onManual?: () => void }) {
  if (state === 'off') return null
  const map: Record<string, { text: string; color: string }> = {
    idle: { text: '⟳ Auto-sync on', color: '#A19BC6' },
    saving: { text: '⟳ Saving…', color: '#22d3ee' },
    saved: { text: '✓ Synced', color: '#34d399' },
    error: { text: '⚠ Sync failed — retry', color: '#fb7185' },
  }
  const s = map[state] || map.idle
  return (
    <button onClick={onManual} className="text-[13px] font-bold transition hover:opacity-80" style={{ color: s.color }} title="Sync now">
      {s.text}
    </button>
  )
}
