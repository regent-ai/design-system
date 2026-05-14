import { useEffect, useRef } from 'react'

export function GrecoCanvas({ seed = 0 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 600, H = 800

    // Seeded rng so background is stable across re-renders
    let s = seed + 12345
    const rnd = () => {
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
      s ^= s >>> 16
      return (s >>> 0) / 0xffffffff
    }

    // ── 1. Stone base gradient ─────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0.0, '#0b0812')
    bg.addColorStop(0.4, '#130c1c')
    bg.addColorStop(0.75, '#1b0f16')
    bg.addColorStop(1.0, '#221205')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // ── 2. Dome / sky glow (top) ──────────────────────────
    const dome = ctx.createRadialGradient(W / 2, -60, 0, W / 2, -60, 560)
    dome.addColorStop(0.0, 'rgba(115, 38, 235, 0.95)')
    dome.addColorStop(0.45, 'rgba(80, 18, 170, 0.4)')
    dome.addColorStop(1.0, 'rgba(40, 0, 100, 0)')
    ctx.fillStyle = dome
    ctx.fillRect(0, 0, W, H)

    // ── 3. Columns ────────────────────────────────────────
    const colXs = [55, 148, 252, 356, 460, 548]
    const colW = 28

    for (const cx of colXs) {
      const x = cx - colW / 2

      // Marble column body
      const cg = ctx.createLinearGradient(x, 0, x + colW, 0)
      cg.addColorStop(0.00, 'rgba(28, 22, 48, 0.98)')
      cg.addColorStop(0.06, 'rgba(190, 170, 220, 0.55)')
      cg.addColorStop(0.22, 'rgba(115, 95, 148, 0.68)')
      cg.addColorStop(0.55, 'rgba(82, 65, 108, 0.62)')
      cg.addColorStop(0.88, 'rgba(52, 40, 78, 0.78)')
      cg.addColorStop(1.00, 'rgba(28, 20, 50, 0.98)')
      ctx.fillStyle = cg
      ctx.fillRect(x, 0, colW, H)

      // Subtle fluting lines
      ctx.strokeStyle = 'rgba(210, 190, 255, 0.09)'
      ctx.lineWidth = 0.6
      for (let fl = 1; fl <= 3; fl++) {
        const fx = x + (colW / 4) * fl
        ctx.beginPath(); ctx.moveTo(fx, 0); ctx.lineTo(fx, H); ctx.stroke()
      }

      // Capital
      const cap = ctx.createLinearGradient(0, 0, 0, 55)
      cap.addColorStop(0, 'rgba(160, 138, 200, 0.55)')
      cap.addColorStop(1, 'rgba(95, 75, 130, 0.25)')
      ctx.fillStyle = cap
      ctx.fillRect(x - 12, 0, colW + 24, 28)
      ctx.fillRect(x - 6, 28, colW + 12, 14)

      // Base
      ctx.fillStyle = 'rgba(140, 118, 175, 0.32)'
      ctx.fillRect(x - 9, H - 55, colW + 18, 18)
      ctx.fillRect(x - 14, H - 37, colW + 28, 37)

      // Bioluminescent vine glows on the column
      for (let g = 0; g < 9; g++) {
        const gy = (H / 9) * g + rnd() * (H / 9) * 0.6
        const gx = cx + (rnd() - 0.5) * 22
        const gr = 9 + rnd() * 14
        const gc = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr)
        gc.addColorStop(0, 'rgba(38, 230, 148, 0.65)')
        gc.addColorStop(0.5, 'rgba(38, 230, 148, 0.18)')
        gc.addColorStop(1, 'rgba(38, 230, 148, 0)')
        ctx.fillStyle = gc
        ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2)
      }
    }

    // ── 4. Entablature beam ───────────────────────────────
    const ent = ctx.createLinearGradient(0, 0, 0, 70)
    ent.addColorStop(0, 'rgba(115, 90, 160, 0.68)')
    ent.addColorStop(1, 'rgba(65, 48, 100, 0.28)')
    ctx.fillStyle = ent
    ctx.fillRect(0, 0, W, 58)

    // ── 5. Bio-lab side glows ─────────────────────────────
    const bioL = ctx.createRadialGradient(-40, H * 0.52, 0, -40, H * 0.52, 370)
    bioL.addColorStop(0, 'rgba(28, 215, 142, 0.30)')
    bioL.addColorStop(1, 'rgba(28, 215, 142, 0)')
    ctx.fillStyle = bioL; ctx.fillRect(0, 0, W, H)

    const bioR = ctx.createRadialGradient(W + 40, H * 0.38, 0, W + 40, H * 0.38, 330)
    bioR.addColorStop(0, 'rgba(28, 190, 248, 0.22)')
    bioR.addColorStop(1, 'rgba(28, 190, 248, 0)')
    ctx.fillStyle = bioR; ctx.fillRect(0, 0, W, H)

    // ── 6. Warm amber floor ───────────────────────────────
    const floor = ctx.createRadialGradient(W / 2, H + 130, 0, W / 2, H + 130, 580)
    floor.addColorStop(0.0, 'rgba(218, 158, 32, 0.58)')
    floor.addColorStop(0.55, 'rgba(192, 112, 24, 0.22)')
    floor.addColorStop(1.0, 'rgba(140, 70, 8, 0)')
    ctx.fillStyle = floor; ctx.fillRect(0, H * 0.55, W, H)

    // ── 7. Central atmospheric perspective depth ───────────
    const center = ctx.createRadialGradient(W / 2, H * 0.28, 0, W / 2, H * 0.28, 220)
    center.addColorStop(0, 'rgba(185, 145, 255, 0.13)')
    center.addColorStop(1, 'rgba(185, 145, 255, 0)')
    ctx.fillStyle = center; ctx.fillRect(0, 0, W, H * 0.65)

    // ── 8. Vignette ───────────────────────────────────────
    const vig = ctx.createRadialGradient(W / 2, H * 0.44, H * 0.1, W / 2, H * 0.44, H * 0.88)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.7)')
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H)

    // ── 9. Film grain ─────────────────────────────────────
    const id = ctx.getImageData(0, 0, W, H)
    const d = id.data
    for (let i = 0; i < d.length; i += 4) {
      const n = (rnd() - 0.5) * 20
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
