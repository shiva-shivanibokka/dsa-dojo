import { useEffect, useRef } from 'react'

// A textarea that wraps long text and auto-grows to fit its content (no inner
// scrollbar, no clipping) — height follows the text as you type.
export default function AutoTextarea({
  value,
  onChange,
  placeholder,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  // Re-fit whenever the value changes (typing, or an external reset).
  useEffect(resize, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={resize}
      rows={1}
      placeholder={placeholder}
      className={`block w-full resize-none overflow-hidden ${className}`}
    />
  )
}
