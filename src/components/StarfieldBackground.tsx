import { useEffect, useRef } from 'react'

// Deep-space backdrop: soft drifting stars that twinkle, the occasional shooting
// meteor, and two blurred nebula glows. DPR-aware, debounced resize; under
// prefers-reduced-motion it paints a single static starfield with no motion.
export default function StarfieldBackground() {
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
    let stars: { x: number; y: number; z: number; tw: number }[] = []
    let meteors: { x: number; y: number; len: number; sp: number }[] = []
    let raf = 0
    let t = 0

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(230, Math.floor((w * h) / 8500))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1.6 + 0.3, // depth → size/speed
        tw: Math.random() * 6,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        if (!reduce) {
          s.y += s.z * 0.16
          s.x += s.z * 0.05
          if (s.y > h) {
            s.y = 0
            s.x = Math.random() * w
          }
          if (s.x > w) s.x = 0
        }
        const a = reduce ? 0.7 : 0.4 + 0.6 * Math.abs(Math.sin(t * 0.04 + s.tw))
        ctx.globalAlpha = a
        ctx.fillStyle = s.z > 1.3 ? '#a5f3ff' : '#e5e7ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.z * 0.9, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (!reduce) {
        if (Math.random() < 0.055) {
          meteors.push({ x: Math.random() * w * 0.85, y: -20, len: 130 + Math.random() * 90, sp: 7 + Math.random() * 4 })
        }
        for (const m of meteors) {
          m.x += m.sp
          m.y += m.sp * 0.7
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len * 0.7)
          g.addColorStop(0, 'rgba(190,235,255,0.9)')
          g.addColorStop(1, 'rgba(190,235,255,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(m.x, m.y)
          ctx.lineTo(m.x - m.len, m.y - m.len * 0.7)
          ctx.stroke()
        }
        meteors = meteors.filter((m) => m.x < w + 140 && m.y < h + 140)
      }

      t++
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    let timer: number | undefined
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
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
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* nebula glows */}
      <div
        className="absolute -left-24 -top-32 h-[520px] w-[520px] rounded-full opacity-40 blur-[90px]"
        style={{ background: '#6d28d9' }}
      />
      <div
        className="absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full opacity-35 blur-[90px]"
        style={{ background: '#0e7490' }}
      />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  )
}
