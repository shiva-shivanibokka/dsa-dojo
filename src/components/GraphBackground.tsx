import { useEffect, useRef } from 'react'

// A living graph: glowing nodes drift across the canvas and draw edges to nearby
// neighbours (like graph traversal) — the DSA-themed answer to Build Log's
// circuit board. DPR-aware, debounced resize, static single frame under
// prefers-reduced-motion.
export default function GraphBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let nodes: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = []
    let raf = 0
    const LINK = 168

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(70, Math.floor((w * h) / 24000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 2.2,
        hue: Math.random() < 0.5 ? 190 : 265, // cyan-ish or purple-ish
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        if (!reduce) {
          a.x += a.vx
          a.y += a.vy
          if (a.x < 0 || a.x > w) a.vx *= -1
          if (a.y < 0 || a.y > h) a.vy *= -1
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            const o = 0.16 * (1 - d / LINK)
            ctx.strokeStyle = `rgba(140,120,255,${o})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.hue === 190 ? 'rgba(120,225,255,0.9)' : 'rgba(178,150,255,0.9)'
        ctx.shadowColor = n.hue === 190 ? '#5eead4' : '#a78bfa'
        ctx.shadowBlur = 9
        ctx.fill()
        ctx.shadowBlur = 0
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    let t: number | undefined
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        build()
        if (reduce) draw()
      }, 150)
    }

    build()
    draw()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10" />
}
