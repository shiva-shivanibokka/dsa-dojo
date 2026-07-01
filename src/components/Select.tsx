import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface SelectOption {
  value: string
  label: string
  color: string
}

type Pos = { top: number; left: number; width: number }

// Neo-brutalist dropdown replacing the native <select>. The option panel is
// rendered in a portal with fixed positioning so it floats above cards, and
// flips upward when there's no room below.
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

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex w-full items-center gap-1.5 rounded-md border-2 border-ink px-2.5 py-1.5 text-[13.5px] font-bold text-ink shadow-hardsm transition hover:-translate-y-px"
        style={{ background: cur ? cur.color : '#FFFDF7' }}
      >
        <span className="truncate">{cur ? cur.label : placeholder}</span>
        <svg className={`ml-auto h-3 w-3 shrink-0 transition ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={panelRef}
            role="listbox"
            style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width }}
            className="z-[999] overflow-hidden rounded-md border-2 border-ink bg-card p-1 shadow-hardlg"
          >
            <li>
              <button
                onClick={() => choose(undefined)}
                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-[13.5px] font-semibold text-muted transition hover:bg-ink/5"
              >
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-paper" />
                <span>None</span>
                {value == null && <span className="ml-auto">✓</span>}
              </button>
            </li>
            {options.map((o) => (
              <li key={o.value}>
                <button
                  onClick={() => choose(o.value)}
                  className={`flex w-full items-center gap-2 rounded px-2.5 py-2 text-[13.5px] font-bold text-ink transition hover:bg-ink/5 ${
                    value === o.value ? 'bg-ink/5' : ''
                  }`}
                >
                  <span className="h-3 w-3 rounded-full border-2 border-ink" style={{ background: o.color }} />
                  <span>{o.label}</span>
                  {value === o.value && <span className="ml-auto">✓</span>}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </>
  )
}
