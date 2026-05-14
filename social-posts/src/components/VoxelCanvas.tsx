import { useEffect, useRef } from 'react'

export function VoxelCanvas({ seed = 0 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 600, H = 800

    let s = seed + 99991
    const rnd = () => {
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
      s ^= s >>> 16
      return (s >>> 0) / 0xffffffff
    }

    // ── 1. Sky ────────────────────────────────────────────
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.30)
    sky.addColorStop(0.0, '#8da887')
    sky.addColorStop(0.55, '#688061')
    sky.addColorStop(1.0, '#4e7248')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H * 0.30)

    // ── 2. Forest base gradient ───────────────────────────
    const forest = ctx.createLinearGradient(0, H * 0.30, 0, H)
    forest.addColorStop(0.0, '#3e6e35')
    forest.addColorStop(0.28, '#285824')
    forest.addColorStop(0.62, '#183c18')
    forest.addColorStop(1.0, '#0b1e09')
    ctx.fillStyle = forest
    ctx.fillRect(0, H * 0.30, W, H)

    // ── 3. Draw voxel trees ───────────────────────────────
    const drawTree = (cx: number, baseY: number, bs: number, trunkH: number, layers: number, hex: string, alpha: number) => {
      const a = Math.floor(alpha * 255).toString(16).padStart(2, '0')
      ctx.fillStyle = hex + a

      // trunk
      ctx.fillRect(Math.round(cx - bs * 0.5), Math.round(baseY - trunkH * bs), bs, trunkH * bs)

      // canopy blocks — stepped pyramid
      for (let l = 0; l < layers; l++) {
        const lw = (layers - l + 1) * bs
        const ly = baseY - trunkH * bs - (l + 1) * bs
        ctx.fillRect(Math.round(cx - lw / 2), Math.round(ly), lw, bs)
      }
    }

    // Far distant trees (horizon, pale)
    const farXs = [20, 62, 108, 158, 206, 252, 300, 348, 396, 444, 490, 538, 582]
    for (const tx of farXs) {
      drawTree(tx + (rnd() - 0.5) * 20, H * 0.325, 4, Math.floor(rnd() * 3) + 3, 3, '#72a866', 0.65 + rnd() * 0.2)
    }

    // Mid-ground trees
    const midXs = [15, 58, 105, 155, 205, 255, 300, 348, 398, 448, 496, 544, 592]
    for (const tx of midXs) {
      drawTree(tx + (rnd() - 0.5) * 28, H * 0.50, 7, Math.floor(rnd() * 3) + 4, 4, '#3d7a34', 0.75 + rnd() * 0.2)
    }

    // Near foreground trees (large, dark)
    const nearXs = [12, 90, 192, 300, 408, 508, 590]
    for (const tx of nearXs) {
      drawTree(tx + (rnd() - 0.5) * 18, H * 0.68, 12, Math.floor(rnd() * 4) + 5, 5, '#1a5218', 0.85 + rnd() * 0.14)
    }

    // ── 4. Ground ─────────────────────────────────────────
    const ground = ctx.createLinearGradient(0, H * 0.58, 0, H)
    ground.addColorStop(0.0, 'rgba(8, 26, 6, 0)')
    ground.addColorStop(0.2, 'rgba(8, 26, 6, 0.75)')
    ground.addColorStop(1.0, 'rgba(4, 12, 3, 1.0)')
    ctx.fillStyle = ground
    ctx.fillRect(0, H * 0.58, W, H)

    // ── 5. Atmospheric haze at horizon ────────────────────
    const haze = ctx.createLinearGradient(0, H * 0.18, 0, H * 0.40)
    haze.addColorStop(0, 'rgba(158, 198, 148, 0.38)')
    haze.addColorStop(1, 'rgba(100, 158, 88, 0)')
    ctx.fillStyle = haze
    ctx.fillRect(0, H * 0.18, W, H * 0.22)

    // ── 6. Graph paper — minor grid (20px) ────────────────
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.052)'
    ctx.lineWidth = 1
    for (let x = 0; x <= W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y <= H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // ── 7. Graph paper — major grid (100px) ───────────────
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)'
    for (let x = 0; x <= W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y <= H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // ── 8. Vignette ───────────────────────────────────────
    const vig = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.12, W / 2, H * 0.48, H * 0.78)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.58)')
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H)

    // ── 9. Film grain ─────────────────────────────────────
    const id = ctx.getImageData(0, 0, W, H)
    const data = id.data
    for (let i = 0; i < data.length; i += 4) {
      const n = (rnd() - 0.5) * 16
      data[i]     = Math.max(0, Math.min(255, data[i]     + n))
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n))
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
