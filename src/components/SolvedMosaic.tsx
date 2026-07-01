import { useEffect, useRef, useState } from 'react'
import type { Difficulty, Problem } from '../data/types'
import { DIFFICULTY_COLOR } from '../lib/patterns'

const RANK: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }

// One glowing square per solved problem, coloured by difficulty. The grid picks
// the column count that makes the squares as large as possible for the current
// box size + problem count, so it auto-resizes as more problems are solved and
// always fills the space (with a small even margin all around, from the box's
// own padding).
export default function SolvedMosaic({ problems }: { problems: Problem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setBox({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // cluster colours: Easy → Medium → Hard
  const sorted = [...problems].sort((a, b) => RANK[a.difficulty] - RANK[b.difficulty])
  const n = sorted.length

  const gap = 7
  let cols = 1
  let size = 0
  if (box.w > 0 && box.h > 0 && n > 0) {
    for (let c = 1; c <= n; c++) {
      const rows = Math.ceil(n / c)
      const s = Math.min((box.w - (c - 1) * gap) / c, (box.h - (rows - 1) * gap) / rows)
      if (s > size) {
        size = s
        cols = c
      }
    }
  }

  return (
    <div ref={ref} className="h-full w-full">
      {size > 0 && (
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${size}px)`,
            gap: `${gap}px`,
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          {sorted.map((p, i) => {
            const c = DIFFICULTY_COLOR[p.difficulty]
            return (
              <div
                key={p.slug || i}
                title={`${p.title} · ${p.difficulty}`}
                style={{
                  width: size,
                  height: size,
                  borderRadius: Math.max(3, size * 0.18),
                  background: c,
                  boxShadow: `0 0 ${Math.max(5, size * 0.35)}px -2px ${c}`,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
