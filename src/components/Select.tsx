import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { rgb } from '../lib/patterns'

export interface SelectOption {
  value: string
  label: string
  color: string
}

type Pos = { top: number; left: number; width: number }

// Custom dropdown replacing the native <select>. The option panel renders in a
// portal (fixed) so it floats above the glass cards, flipping up when needed.
export default function Select({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = 'Rate',
}: {
  value: string | undefined
  options: SelectOption[]
  onChange: (value: string | undefined) => void
  ariaLabel: string
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<Pos | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)
  const cur = options.find((o) => o.value === value) ?? null

  const place = () => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const rows = options.length + 1
    const estH = rows * 38 + 12
    const openUp = r.bottom + estH + 8 > window.innerHeight && r.top - estH - 8 > 0
    const width = Math.max(r.width, 150)
    let left = r.left
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8
    setPos({ top: openUp ? r.top - estH - 6 : r.bottom + 6, left, width })
  }

  const toggle = () => {
    if (open) setOpen(false)
    else {
      place()
      setOpen(true)
    }
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (btnRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  const choose = (v: string | undefined) => {
    onChange(v)
    setOpen(false)
  }

  const c = cur ? rgb(cur.color) : null

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex w-full items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13.5px] font-bold transition hover:-translate-y-px"
        style={
          c
            ? { color: cur!.color, borderColor: `rgba(${c},0.5)`, background: `rgba(${c},0.14)`, boxShadow: `0 0 16px -6px rgba(${c},0.8)` }
            : { color: '#A19BC6', borderColor: 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)' }
        }
      >
        {cur && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cur.color, boxShadow: `0 0 8px ${cur.color}` }} />}
        <span className="truncate">{cur ? cur.label : placeholder}</span>
        <svg className={`ml-auto h-3 w-3 shrink-0 opacity-70 transition ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={panelRef}
            role="listbox"
            style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width }}
            className="z-[999] overflow-hidden rounded-xl border border-white/12 bg-[#15132a] p-1 shadow-2xl ring-1 ring-black/40"
          >
            <li>
              <button
                onClick={() => choose(undefined)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-faint transition hover:bg-white/[0.06]"
              >
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span>None</span>
                {value == null && <span className="ml-auto text-accent-cyan">✓</span>}
              </button>
            </li>
            {options.map((o) => (
              <li key={o.value}>
                <button
                  onClick={() => choose(o.value)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] font-bold transition hover:bg-white/[0.06] ${
                    value === o.value ? 'text-ink' : 'text-subtle'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: o.color, boxShadow: `0 0 8px ${o.color}` }} />
                  <span>{o.label}</span>
                  {value === o.value && <span className="ml-auto text-accent-cyan">✓</span>}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </>
  )
}
