import { useEffect, useRef } from 'react'

export function NavyCanvas({ seed = 0 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 600, H = 800

    let s = seed + 77771
    const rnd = () => {
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
      s ^= s >>> 16
      return (s >>> 0) / 0xffffffff
    }

    // ── 1. Deep navy base — slight radial warmth toward center ──
    const base = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.72)
    base.addColorStop(0.0, '#245882')   // slightly lighter centre
    base.addColorStop(0.5, '#1e4a6e')   // mid navy
    base.addColorStop(1.0, '#152f4a')   // darker edges
    ctx.fillStyle = base
    ctx.fillRect(0, 0, W, H)

    // ── 2. Subtle top-left teal tint for depth ─────────────────
    const tl = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.9)
    tl.addColorStop(0, 'rgba(38, 100, 148, 0.35)')
    tl.addColorStop(1, 'rgba(38, 100, 148, 0)')
    ctx.fillStyle = tl; ctx.fillRect(0, 0, W, H)

    // ── 3. Bottom-right deeper shadow ─────────────────────────
    const br = ctx.createRadialGradient(W, H, 0, W, H, W * 0.95)
    br.addColorStop(0, 'rgba(10, 28, 48, 0.55)')
    br.addColorStop(1, 'rgba(10, 28, 48, 0)')
    ctx.fillStyle = br; ctx.fillRect(0, 0, W, H)

    // ── 4. Graph paper — minor grid (20px) ────────────────────
    ctx.strokeStyle = 'rgba(100, 168, 210, 0.14)'
    ctx.lineWidth = 1
    for (let x = 0; x <= W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke()
    }
    for (let y = 0; y <= H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke()
    }

    // ── 5. Graph paper — major grid (100px) ───────────────────
    ctx.strokeStyle = 'rgba(130, 195, 235, 0.22)'
    ctx.lineWidth = 1
    for (let x = 0; x <= W; x += 100) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke()
    }
    for (let y = 0; y <= H; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke()
    }

    // ── 6. Soft vignette ──────────────────────────────────────
    const vig = ctx.createRadialGradient(W / 2, H * 0.46, H * 0.08, W / 2, H * 0.46, H * 0.82)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.42)')
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H)

    // ── 7. Film grain ─────────────────────────────────────────
    const id = ctx.getImageData(0, 0, W, H)
    const d = id.data
    for (let i = 0; i < d.length; i += 4) {
      const n = (rnd() - 0.5) * 14
      d[i]     = Math.max(0, Math.min(255, d[i]     + n))
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n))
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n))
    }
    ctx.putImageData(id, 0, 0)
  }, [seed])

  return (
    <canvas
      ref={ref}
      width={600}
      height={800}
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  )
}
