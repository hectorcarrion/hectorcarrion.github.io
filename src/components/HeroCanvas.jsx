import { useEffect, useRef } from 'react'

/**
 * Dual-layer 3D Multimodal World-Modeling Canvas:
 * - Back half of the orbit renders behind the portrait; front half renders in front.
 * - Six unmistakable 3D scientific objects orbit the outer ring (zero camera frustums):
 *     1. 3D Wireframe World Globe (world models & spatial state)
 *     2. 3D Rotating DNA Double Helix (genomics & multi-omic health)
 *     3. Rounded Biomarker / ECG Pulse Capsule (longitudinal physiology)
 *     4. 3D Molecular Bond Ring with Atom Nodes (blood biomarkers & therapeutics)
 *     5. 3D Lorenz / Phase-Space Infinity Attractor (latent dynamics over time)
 *     6. Concentric Biological Cell & Nucleus (cellular & tissue repair dynamics)
 * - Periodically, modalities encode observations into a latent state z_t on the
 *   inner ring and trigger a branched forward horizon rollout (dashed baseline
 *   vs. botanical-green optimal intervention trajectory with future waypoints).
 */
export function HeroCanvas({ heroRef, portraitRef, ledeRef }) {
  const backRef = useRef(null)
  const frontRef = useRef(null)

  useEffect(() => {
    const back = backRef.current
    const front = frontRef.current
    const hero = heroRef.current
    if (!back || !front || !hero || !back.getContext) return

    const bctx = back.getContext('2d')
    const fctx = front.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const small = window.innerWidth < 700

    const FOCAL = 900
    const TILT = 0.54
    const ROLL = -0.1
    const SPIN = 0.078
    const MOD_R = 1.34
    const SPREAD = 520
    const cosT = Math.cos(TILT)
    const sinT = Math.sin(TILT)
    const cosR = Math.cos(ROLL)
    const sinR = Math.sin(ROLL)

    let w = 0
    let h = 0
    let ox = 0
    let oy = 0
    let R = 200
    let fcx = 0
    let fcy = 0
    let fieldScale = 1
    let colorA = [176, 90, 54] // Function terracotta
    let colorB = [76, 154, 98] // Function botanical green
    let colorM = [110, 106, 99] // Warm muted neutral
    let strength = 0.94
    let tiltX = 0
    let tiltY = 0
    let targetX = 0
    let targetY = 0
    let pointerIn = false
    let cosX = 1
    let sinX = 0
    let cosY = 1
    let sinY = 0
    let running = false
    let started = false
    let inView = true
    let rafId = 0
    let t0 = performance.now()
    let lastT = t0
    let spin = 0
    let nextEvent = 1.8
    const events = []

    const rand = (a, b) => a + Math.random() * (b - a)
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const rgba = (c, a) =>
      `rgba(${c[0]},${c[1]},${c[2]},${clamp01(a * strength).toFixed(3)})`
    const mix = (t) =>
      [0, 1, 2].map((i) => Math.round(colorA[i] + (colorB[i] - colorA[i]) * t))
    const wrap = (v, limit) => (v < -limit ? limit : v > limit ? -limit : v)
    const angleBetween = (a, b) => {
      const d = Math.abs(a - b) % (Math.PI * 2)
      return d > Math.PI ? Math.PI * 2 - d : d
    }

    // Inner latent state manifold particles
    const ring = []
    const RING_N = small ? 120 : 196
    for (let i = 0; i < RING_N; i++) {
      const startAngle = rand(0, Math.PI * 2)
      const startRadius = rand(1.5, 2.7)
      const a = (i / RING_N) * Math.PI * 2 + rand(-0.015, 0.015)
      ring.push({
        a,
        r:
          1 +
          rand(-0.045, 0.045) +
          (Math.random() < 0.16 ? rand(-0.12, 0.12) : 0),
        y: rand(-0.038, 0.038),
        size: rand(0.95, 2.15),
        tone: 0.35 + 0.45 * Math.sin(a * 2 + 0.6),
        phase: rand(0, Math.PI * 2),
        delay: rand(0, 0.75),
        sx: Math.cos(startAngle) * startRadius,
        sy: rand(-0.85, 0.85),
        sz: Math.sin(startAngle) * startRadius,
        glow: 0,
        color: [176, 90, 54],
        proj: null,
      })
    }

    const MODALITY_TYPES = [
      'globe',    // 3D wireframe world sphere
      'helix',    // 3D rotating DNA double helix
      'vital',    // Rounded ECG / biomarker pulse capsule
      'molecule', // 3D chemical / biomarker bond ring with atom nodes
      'attractor',// 3D phase-space figure-8 dynamical trajectory
      'cell',     // Biological cell bilayer + nucleus + receptors
    ]
    const modalities = MODALITY_TYPES.map((kind, k) => ({
      kind,
      a: (k / MODALITY_TYPES.length) * Math.PI * 2 + 0.25,
      appear: 0.8 + k * 0.12,
      flash: 0,
      center: null,
    }))

    // Sparse background latent state cloud
    const field = []
    const FIELD_N = small ? 24 : 42
    for (let j = 0; j < FIELD_N; j++) {
      field.push({
        x: rand(-SPREAD, SPREAD),
        y: rand(-SPREAD * 0.55, SPREAD * 0.55),
        z: rand(-SPREAD * 0.5, SPREAD * 0.5),
        vx: rand(-0.13, 0.13),
        vy: rand(-0.08, 0.08),
        vz: rand(-0.06, 0.06),
        r: rand(1, 2.1),
        phase: rand(0, Math.PI * 2),
      })
    }

    // Background counterfactual branching curves (smooth Bézier forks, zero sharp triads)
    const rolloutMotifs = [
      { x: -SPREAD * 0.66, y: -SPREAD * 0.32, z: SPREAD * 0.18, s: 1 },
      { x: SPREAD * 0.72, y: SPREAD * 0.28, z: -SPREAD * 0.14, s: -1 },
      { x: SPREAD * 0.18, y: -SPREAD * 0.38, z: -SPREAD * 0.28, s: 1 },
    ]

    function parseRgb(value, fallback) {
      const parts = String(value)
        .split(',')
        .map((s) => parseFloat(s))
      return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
        ? parts
        : fallback
    }

    function readTheme() {
      const style = getComputedStyle(document.documentElement)
      colorA = parseRgb(style.getPropertyValue('--canvas-rgb'), colorA)
      colorB = parseRgb(style.getPropertyValue('--canvas-rgb-2'), colorB)
      colorM = parseRgb(style.getPropertyValue('--canvas-muted-rgb'), colorM)
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark')
      strength = isDark ? 1 : 0.94
      ring.forEach((p) => {
        p.color = mix(clamp01(p.tone))
      })
    }

    function offsetIn(el, ancestor) {
      let x = 0
      let y = 0
      let cur = el
      while (cur && cur !== ancestor) {
        x += cur.offsetLeft
        y += cur.offsetTop
        cur = cur.offsetParent
      }
      return { x, y }
    }

    function layout() {
      w = hero.clientWidth
      h = hero.clientHeight
      ;[back, front].forEach((c) => {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      })
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const portrait = portraitRef.current
      const lede = ledeRef.current
      if (portrait && portrait.offsetWidth) {
        const pos = offsetIn(portrait, hero)
        const radius = portrait.offsetWidth / 2
        ox = pos.x + radius
        oy = pos.y + radius
        R = radius * 1.38
        if (lede && w > 980) {
          const lp = offsetIn(lede, hero)
          const textEdge = lp.x + lede.offsetWidth
          R = Math.max(
            radius * 1.15,
            Math.min(R, (ox - textEdge - 14) / (MOD_R * 1.08))
          )
          hero.style.setProperty('--text-edge', `${Math.round(textEdge)}px`)
        } else {
          hero.style.removeProperty('--text-edge')
        }
      } else {
        ox = w * 0.7
        oy = h * 0.45
        R = 200
      }

      const wide = w > 980
      fcx = wide ? w * 0.7 : w * 0.5
      fcy = wide ? h * 0.44 : h * 0.3
      fieldScale = Math.max(0.5, Math.min(1, w / 1300))
      if (!running) draw(performance.now(), true)
    }

    function project(lx, ly, lz) {
      const y1 = ly * cosT + lz * sinT
      const z1 = -ly * sinT + lz * cosT
      const x2 = lx * cosR - y1 * sinR
      const y2 = lx * sinR + y1 * cosR
      const x3 = x2 * cosY + z1 * sinY
      const z3 = -x2 * sinY + z1 * cosY
      const y4 = y2 * cosX - z3 * sinX
      const z4 = y2 * sinX + z3 * cosX
      const s = FOCAL / Math.max(120, FOCAL - z4)
      return { x: ox + x3 * s, y: oy + y4 * s, z: z4, s }
    }

    function projectField(x, y, z) {
      const x1 = x * cosY + z * sinY
      const z1 = -x * sinY + z * cosY
      const y1 = y * cosX - z1 * sinX
      const z2 = y * sinX + z1 * cosX
      const s = FOCAL / Math.max(50, FOCAL + z2)
      return { x: fcx + x1 * s * fieldScale, y: fcy + y1 * s * fieldScale, s }
    }

    function drawField(t, frozen) {
      const pts = []
      for (let i = 0; i < field.length; i++) {
        const p = field[i]
        if (!frozen) {
          p.x = wrap(p.x + p.vx, SPREAD)
          p.y = wrap(p.y + p.vy, SPREAD * 0.55)
          p.z = wrap(p.z + p.vz, SPREAD * 0.5)
        }
        const pr = projectField(p.x, p.y, p.z)
        pts.push({
          x: pr.x,
          y: pr.y,
          s: pr.s,
          r: p.r * pr.s * 0.8 * Math.max(0.75, fieldScale),
          a:
            0.26 *
            Math.max(0.15, Math.min(1, pr.s / 1.2)) *
            (0.7 + 0.3 * Math.sin(t * 1.1 + p.phase)),
          x3: p.x,
          y3: p.y,
          z3: p.z,
        })
      }

      bctx.lineWidth = 0.7
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const dx = pts[a].x3 - pts[b].x3
          const dy = pts[a].y3 - pts[b].y3
          const dz = pts[a].z3 - pts[b].z3
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (d < 180) {
            bctx.strokeStyle = rgba(
              colorA,
              (1 - d / 180) * 0.12 * Math.min(1, (pts[a].s + pts[b].s) / 2)
            )
            bctx.beginPath()
            bctx.moveTo(pts[a].x, pts[a].y)
            bctx.lineTo(pts[b].x, pts[b].y)
            bctx.stroke()
          }
        }
      }

      for (let c = 0; c < pts.length; c++) {
        if (pts[c].r < 0.4) continue
        bctx.fillStyle = rgba(colorA, pts[c].a)
        bctx.beginPath()
        bctx.arc(pts[c].x, pts[c].y, pts[c].r, 0, Math.PI * 2)
        bctx.fill()
      }

      // Smooth curved horizon-forecast forks in background
      const motifAlpha = 0.22 + 0.05 * Math.sin(t * 0.6)
      for (let k = 0; k < rolloutMotifs.length; k++) {
        const m = rolloutMotifs[k]
        const p0 = projectField(m.x - 28 * m.s, m.y + 3, m.z)
        const p1 = projectField(m.x, m.y, m.z)
        const pOpt = projectField(m.x + 30 * m.s, m.y - 14, m.z + 8)
        const pBase = projectField(m.x + 28 * m.s, m.y + 13, m.z - 6)

        bctx.lineWidth = 1.15
        bctx.strokeStyle = rgba(colorA, motifAlpha)
        bctx.beginPath()
        bctx.moveTo(p0.x, p0.y)
        bctx.quadraticCurveTo(
          (p0.x + p1.x) / 2,
          p1.y,
          p1.x,
          p1.y
        )
        bctx.stroke()

        bctx.strokeStyle = rgba(colorB, motifAlpha * 1.2)
        bctx.beginPath()
        bctx.moveTo(p1.x, p1.y)
        bctx.quadraticCurveTo(
          p1.x + (pOpt.x - p1.x) * 0.45,
          p1.y,
          pOpt.x,
          pOpt.y
        )
        bctx.stroke()

        bctx.save()
        bctx.setLineDash([2.5, 3])
        bctx.strokeStyle = rgba(colorM, motifAlpha * 0.9)
        bctx.beginPath()
        bctx.moveTo(p1.x, p1.y)
        bctx.quadraticCurveTo(
          p1.x + (pBase.x - p1.x) * 0.45,
          p1.y,
          pBase.x,
          pBase.y
        )
        bctx.stroke()
        bctx.restore()

        ;[
          [p0, colorA],
          [p1, colorA],
          [pOpt, colorB],
        ].forEach(([pt, col]) => {
          bctx.fillStyle = rgba(col, motifAlpha * 1.35)
          bctx.beginPath()
          bctx.arc(pt.x, pt.y, 1.9, 0, Math.PI * 2)
          bctx.fill()
        })
      }
    }

    function drawTracks(t) {
      const q = easeOut(clamp01((t - 0.45) / 1.1))
      if (q <= 0) return
      const steps = 144
      let prev = null
      const backPath = new Path2D()
      const frontPath = new Path2D()
      for (let i = 0; i <= steps; i++) {
        const ang = (i / steps) * Math.PI * 2
        const p = project(Math.cos(ang) * R, 0, Math.sin(ang) * R)
        if (prev) {
          const path = (p.z + prev.z) / 2 > 0 ? frontPath : backPath
          path.moveTo(prev.x, prev.y)
          path.lineTo(p.x, p.y)
        }
        prev = p

        if (i % 2 === 0) {
          const cp = project(
            Math.cos(ang) * R * MOD_R,
            0,
            Math.sin(ang) * R * MOD_R
          )
          const cctx = cp.z > 0 ? fctx : bctx
          cctx.fillStyle = rgba(colorA, 0.21 * q)
          cctx.beginPath()
          cctx.arc(cp.x, cp.y, 0.75, 0, Math.PI * 2)
          cctx.fill()
        }
      }
      bctx.lineWidth = 1
      bctx.strokeStyle = rgba(colorA, 0.13 * q)
      bctx.stroke(backPath)
      fctx.lineWidth = 1
      fctx.strokeStyle = rgba(colorA, 0.22 * q)
      fctx.stroke(frontPath)
    }

    function drawRing(t, dt, frozen) {
      const cs = Math.cos(spin)
      const sn = Math.sin(spin)
      for (let i = 0; i < ring.length; i++) {
        const p = ring[i]
        const ang = p.a + spin
        let lx = Math.cos(ang) * p.r * R
        let ly = p.y * R
        let lz = Math.sin(ang) * p.r * R
        const q = easeOut(clamp01((t - p.delay) / 1.5))
        if (q < 1) {
          const sx = (p.sx * cs - p.sz * sn) * R
          const sz = (p.sx * sn + p.sz * cs) * R
          const sy = p.sy * R
          lx = sx + (lx - sx) * q
          ly = sy + (ly - sy) * q
          lz = sz + (lz - sz) * q
        }
        const pr = project(lx, ly, lz)
        p.proj = pr

        const depth = clamp01(0.5 + pr.z / (2.4 * R))
        const twinkle = 0.75 + 0.25 * Math.sin(t * 1.5 + p.phase)
        const alpha = (0.26 + 0.62 * depth) * twinkle * q
        const size = p.size * pr.s * (0.75 + 0.5 * depth)
        const ctx = pr.z > 0 ? fctx : bctx

        ctx.fillStyle = rgba(p.color, alpha)
        ctx.beginPath()
        ctx.arc(pr.x, pr.y, size, 0, Math.PI * 2)
        ctx.fill()

        if (p.glow > 0) {
          const gr = 4 + 17 * p.glow
          const g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, gr)
          g.addColorStop(0, rgba(colorB, 0.65 * p.glow))
          g.addColorStop(1, rgba(colorB, 0))
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(pr.x, pr.y, gr, 0, Math.PI * 2)
          ctx.fill()
          if (!frozen) p.glow = Math.max(0, p.glow - dt * 0.85)
        }
      }
    }

    function makeLocalProjector(cx, cz, ca, sa, scale) {
      return (uTan, vUp, wRad) =>
        project(
          cx + (-sa * uTan + ca * wRad) * scale,
          vUp * scale,
          cz + (ca * uTan + sa * wRad) * scale
        )
    }

    function drawModalities(t, dt) {
      for (let k = 0; k < modalities.length; k++) {
        const mod = modalities[k]
        const e = easeOut(clamp01((t - mod.appear) / 0.85))
        if (e <= 0) {
          mod.center = null
          continue
        }
        mod.flash = Math.max(0, mod.flash - dt * 1.1)

        const ang = mod.a + spin
        const ca = Math.cos(ang)
        const sa = Math.sin(ang)
        const cx = ca * MOD_R * R
        const cz = sa * MOD_R * R
        const center = project(cx, 0, cz)
        mod.center = center

        const depth = clamp01(0.5 + center.z / (2.4 * R * MOD_R))
        const alpha = (0.34 + 0.48 * depth + 0.36 * mod.flash) * e
        const ctx = center.z > 0 ? fctx : bctx
        const sc = 0.132 * R * e
        const lp = makeLocalProjector(cx, cz, ca, sa, sc)

        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        if (mod.kind === 'globe') {
          // 1. 3D Wireframe World Sphere (World Modeling & Spatial State)
          const rG = 0.88 * center.s * sc
          ctx.lineWidth = 1.2
          ctx.fillStyle = rgba(colorA, (0.06 + 0.16 * mod.flash) * e)
          ctx.strokeStyle = rgba(colorA, alpha)
          ctx.beginPath()
          ctx.arc(center.x, center.y, rG, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          // Rotating 3D meridians + equator
          const SEG = 22
          const rot = t * 0.55
          ;[0, Math.PI / 2].forEach((mOff, idx) => {
            ctx.lineWidth = 1.0
            ctx.strokeStyle = rgba(idx === 1 ? colorB : colorA, alpha * 0.82)
            ctx.beginPath()
            for (let s = 0; s <= SEG; s++) {
              const th = (s / SEG) * Math.PI * 2
              const xL = Math.sin(th) * Math.cos(rot + mOff) * 0.88
              const yL = Math.cos(th) * 0.88
              const zL = Math.sin(th) * Math.sin(rot + mOff) * 0.88
              const pt = lp(xL, yL, zL)
              if (s === 0) ctx.moveTo(pt.x, pt.y)
              else ctx.lineTo(pt.x, pt.y)
            }
            ctx.stroke()
          })
          // Equator
          ctx.lineWidth = 1.05
          ctx.strokeStyle = rgba(colorB, alpha * 0.9)
          ctx.beginPath()
          for (let s = 0; s <= SEG; s++) {
            const th = (s / SEG) * Math.PI * 2
            const pt = lp(Math.cos(th) * 0.88, 0, Math.sin(th) * 0.88)
            if (s === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
          }
          ctx.stroke()
        } else if (mod.kind === 'helix') {
          // 2. 3D Rotating DNA Double Helix (Genomics & Multi-omic Health)
          const N = 12
          const sA = []
          const sB = []
          for (let i = 0; i <= N; i++) {
            const f = (i / N) * 2 - 1
            const phi = f * 2.8 + t * 1.35
            const rH = 0.58
            sA.push(lp(Math.cos(phi) * rH, f * 1.18, Math.sin(phi) * rH))
            sB.push(
              lp(
                Math.cos(phi + Math.PI) * rH,
                f * 1.18,
                Math.sin(phi + Math.PI) * rH
              )
            )
          }
          ctx.lineWidth = 1.0
          ctx.strokeStyle = rgba(colorB, alpha * 0.78)
          ctx.beginPath()
          for (let i = 1; i < N; i += 2) {
            ctx.moveTo(sA[i].x, sA[i].y)
            ctx.lineTo(sB[i].x, sB[i].y)
          }
          ctx.stroke()

          ;[
            [sA, colorA],
            [sB, colorB],
          ].forEach(([pts, col]) => {
            ctx.lineWidth = 1.4
            ctx.strokeStyle = rgba(col, alpha)
            ctx.beginPath()
            pts.forEach((pt, idx) =>
              idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
            )
            ctx.stroke()
          })
        } else if (mod.kind === 'vital') {
          // 3. Rounded Biomarker / ECG Pulse Capsule (Longitudinal Physiology)
          const pw = 1.25 * sc * center.s
          const ph = 0.68 * sc * center.s
          ctx.lineWidth = 1.15
          ctx.fillStyle = rgba(colorA, (0.06 + 0.16 * mod.flash) * e)
          ctx.strokeStyle = rgba(colorA, alpha * 0.75)
          ctx.beginPath()
          if (ctx.roundRect) {
            ctx.roundRect(center.x - pw, center.y - ph, pw * 2, ph * 2, ph)
          } else {
            ctx.arc(center.x, center.y, pw * 0.85, 0, Math.PI * 2)
          }
          ctx.fill()
          ctx.stroke()

          const wave = [
            [-0.86, 0],
            [-0.48, 0],
            [-0.34, -0.22],
            [-0.2, 0],
            [-0.08, 0.22],
            [0.05, -0.72],
            [0.19, 0.45],
            [0.32, 0],
            [0.52, -0.25],
            [0.68, 0],
            [0.86, 0],
          ]
          ctx.lineWidth = 1.5
          ctx.strokeStyle = rgba(colorB, Math.min(1, alpha * 1.18))
          ctx.beginPath()
          wave.forEach(([u, v], idx) => {
            const xw = center.x + u * pw
            const yw = center.y + v * ph
            if (idx === 0) ctx.moveTo(xw, yw)
            else ctx.lineTo(xw, yw)
          })
          ctx.stroke()

          const prog = (t * 0.65) % 1
          const segF = prog * (wave.length - 1)
          const idx0 = Math.floor(segF)
          const idx1 = Math.min(wave.length - 1, idx0 + 1)
          const frac = segF - idx0
          const pu = wave[idx0][0] + (wave[idx1][0] - wave[idx0][0]) * frac
          const pv = wave[idx0][1] + (wave[idx1][1] - wave[idx0][1]) * frac
          ctx.fillStyle = rgba(colorB, Math.min(1, alpha + 0.3))
          ctx.beginPath()
          ctx.arc(
            center.x + pu * pw,
            center.y + pv * ph,
            2.2 + mod.flash,
            0,
            Math.PI * 2
          )
          ctx.fill()
        } else if (mod.kind === 'molecule') {
          // 4. 3D Molecular / Biomarker Ring with Atom Nodes
          const rot = t * 0.5
          const atoms = []
          for (let i = 0; i < 6; i++) {
            const th = (i / 6) * Math.PI * 2 + rot
            const u = Math.cos(th) * 0.85
            const v = Math.sin(th) * 0.85 * Math.cos(0.45)
            const wCoord = Math.sin(th) * 0.85 * Math.sin(0.45)
            atoms.push(lp(u, v, wCoord))
          }
          // Side chain atom
          const sideAtom = lp(
            Math.cos(rot) * 1.32,
            Math.sin(rot) * 1.32 * Math.cos(0.45),
            Math.sin(rot) * 1.32 * Math.sin(0.45)
          )

          ctx.lineWidth = 1.2
          ctx.strokeStyle = rgba(colorA, alpha * 0.9)
          ctx.beginPath()
          atoms.forEach((pt, idx) =>
            idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
          )
          ctx.closePath()
          ctx.moveTo(atoms[0].x, atoms[0].y)
          ctx.lineTo(sideAtom.x, sideAtom.y)
          ctx.stroke()

          atoms.forEach((pt, idx) => {
            ctx.fillStyle = rgba(idx % 2 === 0 ? colorA : colorB, Math.min(1, alpha + 0.18))
            ctx.beginPath()
            ctx.arc(pt.x, pt.y, 2.2 * center.s, 0, Math.PI * 2)
            ctx.fill()
          })
          ctx.fillStyle = rgba(colorB, Math.min(1, alpha + 0.25))
          ctx.beginPath()
          ctx.arc(sideAtom.x, sideAtom.y, 2.6 * center.s, 0, Math.PI * 2)
          ctx.fill()
        } else if (mod.kind === 'attractor') {
          // 5. 3D Phase-Space Infinity / Lorenz Attractor (Latent State Dynamics)
          const SEG = 32
          const pts = []
          const rot = t * 0.45
          for (let s = 0; s <= SEG; s++) {
            const th = (s / SEG) * Math.PI * 2
            const denom = 1 + Math.sin(th) * Math.sin(th)
            const u = (1.18 * Math.cos(th)) / denom
            const v = (1.05 * Math.sin(th) * Math.cos(th)) / denom
            const wCoord = 0.42 * Math.sin(th * 2 + rot)
            pts.push(lp(u, v, wCoord))
          }
          ctx.lineWidth = 1.4
          ctx.strokeStyle = rgba(colorA, alpha)
          ctx.beginPath()
          pts.forEach((pt, idx) =>
            idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
          )
          ctx.stroke()

          // Orbiting state particle along the phase attractor
          const idx = Math.floor(((t * 0.55) % 1) * SEG)
          const statePt = pts[idx]
          ctx.fillStyle = rgba(colorB, Math.min(1, alpha + 0.3))
          ctx.beginPath()
          ctx.arc(statePt.x, statePt.y, 2.5 + mod.flash, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 6. Biological Cell Bilayer + Nucleus + Surface Receptors
          const rOuter = 0.88 * sc * center.s
          const rNucleus = 0.36 * sc * center.s

          ctx.lineWidth = 1.25
          ctx.fillStyle = rgba(colorB, (0.07 + 0.16 * mod.flash) * e)
          ctx.strokeStyle = rgba(colorA, alpha * 0.92)
          ctx.beginPath()
          ctx.arc(center.x, center.y, rOuter, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          ctx.save()
          ctx.setLineDash([2.5, 2.5])
          ctx.lineWidth = 0.95
          ctx.strokeStyle = rgba(colorB, alpha * 0.78)
          ctx.beginPath()
          ctx.arc(center.x, center.y, rOuter * 0.72, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()

          // Nucleus
          ctx.fillStyle = rgba(colorB, Math.min(1, alpha + 0.22))
          ctx.beginPath()
          ctx.arc(
            center.x + Math.cos(t * 0.9) * rOuter * 0.1,
            center.y + Math.sin(t * 0.9) * rOuter * 0.1,
            rNucleus,
            0,
            Math.PI * 2
          )
          ctx.fill()

          // 3 membrane receptor nodes
          for (let m = 0; m < 3; m++) {
            const th = (m / 3) * Math.PI * 2 + t * 0.4
            const rx = center.x + Math.cos(th) * (rOuter + 2.5)
            const ry = center.y + Math.sin(th) * (rOuter + 2.5)
            ctx.fillStyle = rgba(colorA, Math.min(1, alpha + 0.2))
            ctx.beginPath()
            ctx.arc(rx, ry, 1.8, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        ctx.restore()
      }
    }

    function updateEvents(t, dt) {
      if (t > nextEvent) {
        nextEvent = t + rand(1.5, 2.35)
        const p = ring[(Math.random() * ring.length) | 0]
        const nearest = modalities
          .slice()
          .sort((m1, m2) => angleBetween(m1.a, p.a) - angleBetween(m2.a, p.a))
        events.push({
          p,
          mods: [nearest[0], nearest[1]],
          t: 0,
          hit: false,
          horizon: rand(0.48, 0.68),
        })
        nearest[0].flash = 1
        nearest[1].flash = 1
      }
      for (let i = events.length - 1; i >= 0; i--) {
        const ev = events[i]
        ev.t += dt
        if (!ev.hit && ev.t > 0.4) {
          ev.hit = true
          ev.p.glow = 1
        }
        if (ev.t > 2.3) events.splice(i, 1)
      }
    }

    function drawEvents() {
      events.forEach((ev) => {
        const pt = ev.p.proj
        if (!pt) return
        const encGrow = easeOut(clamp01(ev.t / 0.4))
        const fade = ev.t < 1.2 ? 1 : clamp01(1 - (ev.t - 1.2) / 1.1)
        const centers = ev.mods.map((m) => m.center).filter(Boolean)

        centers.forEach((c) => {
          const ex = c.x + (pt.x - c.x) * encGrow
          const ey = c.y + (pt.y - c.y) * encGrow
          const ctx = c.z > 0 || pt.z > 0 ? fctx : bctx
          ctx.lineWidth = 1.05
          ctx.strokeStyle = rgba(colorA, 0.5 * fade)
          ctx.beginPath()
          ctx.moveTo(c.x, c.y)
          ctx.lineTo(ex, ey)
          ctx.stroke()

          if (encGrow < 1) {
            ctx.fillStyle = rgba(colorA, 0.95)
            ctx.beginPath()
            ctx.arc(ex, ey, 2.1, 0, Math.PI * 2)
            ctx.fill()
          }
        })

        if (ev.t > 0.38) {
          const rollGrow = easeOut(clamp01((ev.t - 0.38) / 0.8))
          const baseAng = ev.p.a + spin
          const baseR = ev.p.r * R
          const baseY = ev.p.y * R
          const STEPS = 18
          const activeSteps = Math.max(2, Math.round(STEPS * rollGrow))

          let prevOpt = null
          let prevBase = null
          for (let s = 0; s <= activeSteps; s++) {
            const frac = s / STEPS
            const ang = baseAng + frac * ev.horizon

            const optR = baseR + Math.sin(frac * Math.PI) * (0.075 * R)
            const optY = baseY - frac * (0.095 * R)
            const pOpt = project(Math.cos(ang) * optR, optY, Math.sin(ang) * optR)

            const cfR = baseR + frac * frac * (0.17 * R)
            const cfY = baseY + frac * (0.11 * R)
            const pBase = project(Math.cos(ang) * cfR, cfY, Math.sin(ang) * cfR)

            if (prevOpt) {
              const ctxOpt = (pOpt.z + prevOpt.z) / 2 > 0 ? fctx : bctx
              ctxOpt.lineWidth = 1.65
              ctxOpt.strokeStyle = rgba(colorB, 0.82 * fade)
              ctxOpt.beginPath()
              ctxOpt.moveTo(prevOpt.x, prevOpt.y)
              ctxOpt.lineTo(pOpt.x, pOpt.y)
              ctxOpt.stroke()
            }

            if (prevBase && s % 2 === 1) {
              const ctxBase = (pBase.z + prevBase.z) / 2 > 0 ? fctx : bctx
              ctxBase.lineWidth = 1.05
              ctxBase.strokeStyle = rgba(colorM, 0.44 * fade)
              ctxBase.beginPath()
              ctxBase.moveTo(prevBase.x, prevBase.y)
              ctxBase.lineTo(pBase.x, pBase.y)
              ctxBase.stroke()
            }

            if (s > 0 && s % 6 === 0) {
              const wctx = pOpt.z > 0 ? fctx : bctx
              wctx.fillStyle = rgba(colorB, 0.94 * fade)
              wctx.beginPath()
              wctx.arc(pOpt.x, pOpt.y, 2.3, 0, Math.PI * 2)
              wctx.fill()
            }

            prevOpt = pOpt
            prevBase = pBase
          }
        }
      })
    }

    function draw(now, frozen) {
      const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000))
      lastT = now
      const t = reducedMotion.matches ? 10 : (now - t0) / 1000

      if (!frozen) {
        spin += SPIN * dt
        if (!pointerIn) {
          targetY = Math.sin(t * 0.15) * 0.08
          targetX = Math.cos(t * 0.12) * 0.05
        }
        const ease = pointerIn ? 0.06 : 0.03
        tiltY += (targetY - tiltY) * ease
        tiltX += (targetX - tiltX) * ease
      }
      cosX = Math.cos(tiltX)
      sinX = Math.sin(tiltX)
      cosY = Math.cos(tiltY)
      sinY = Math.sin(tiltY)

      bctx.clearRect(0, 0, w, h)
      fctx.clearRect(0, 0, w, h)

      drawField(t, frozen)
      drawTracks(t)
      drawRing(t, dt, frozen)
      drawModalities(t, frozen ? 0 : dt)
      if (!frozen && !reducedMotion.matches) updateEvents(t, dt)
      drawEvents()
    }

    function loop(now) {
      if (!running) return
      draw(now, false)
      rafId = requestAnimationFrame(loop)
    }

    function start() {
      if (running || reducedMotion.matches) return
      running = true
      lastT = performance.now()
      if (!started) {
        started = true
        t0 = lastT
      }
      rafId = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      cancelAnimationFrame(rafId)
    }

    let ptrFrame = 0
    let px = 0
    let py = 0
    const clampVal = (v) => Math.max(-1, Math.min(1, v))

    const applyPointer = () => {
      ptrFrame = 0
      const hr = hero.getBoundingClientRect()
      hero.classList.add('has-pointer')
      hero.style.setProperty('--spot-x', `${(px - hr.left).toFixed(0)}px`)
      hero.style.setProperty('--spot-y', `${(py - hr.top).toFixed(0)}px`)

      const ringEl = portraitRef.current
      if (!ringEl) return
      const rr = ringEl.getBoundingClientRect()
      const dx = (px - (rr.left + rr.width / 2)) / (rr.width / 2)
      const dy = (py - (rr.top + rr.height / 2)) / (rr.height / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const k = 1 / Math.max(1, dist / 1.5)
      ringEl.style.setProperty('--tilt-y', `${(clampVal(dx) * 10 * k).toFixed(2)}deg`)
      ringEl.style.setProperty('--tilt-x', `${(-clampVal(dy) * 10 * k).toFixed(2)}deg`)
      ringEl.style.setProperty('--glare-x', `${(50 + clampVal(dx) * 35).toFixed(1)}%`)
      ringEl.style.setProperty('--glare-y', `${(50 + clampVal(dy) * 35).toFixed(1)}%`)
      ringEl.style.setProperty('--glare-o', dist < 1.5 ? '1' : '0')
    }

    const onPointerMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      const rect = hero.getBoundingClientRect()
      targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5
      targetX = ((e.clientY - rect.top) / rect.height - 0.5) * -0.3
      pointerIn = true
      px = e.clientX
      py = e.clientY
      if (!ptrFrame && !reducedMotion.matches) {
        ptrFrame = requestAnimationFrame(applyPointer)
      }
    }

    const onPointerLeave = () => {
      pointerIn = false
      hero.classList.remove('has-pointer')
      const ringEl = portraitRef.current
      if (ringEl) {
        ringEl.style.setProperty('--tilt-x', '0deg')
        ringEl.style.setProperty('--tilt-y', '0deg')
        ringEl.style.setProperty('--glare-o', '0')
      }
    }

    hero.addEventListener('pointermove', onPointerMove)
    hero.addEventListener('pointerleave', onPointerLeave)

    readTheme()
    layout()

    let ro = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(layout)
      ro.observe(hero)
    } else {
      window.addEventListener('resize', layout)
    }

    const onThemeChange = () => {
      readTheme()
      if (!running) draw(performance.now(), true)
    }
    document.addEventListener('themechange', onThemeChange)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (inView) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    let io = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting
        if (inView && !document.hidden) start()
        else stop()
      })
      io.observe(hero)
    } else {
      start()
    }

    return () => {
      stop()
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('themechange', onThemeChange)
      document.removeEventListener('visibilitychange', onVisibility)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', layout)
      if (io) io.disconnect()
    }
  }, [heroRef, portraitRef, ledeRef])

  return (
    <>
      <canvas className="hero-canvas" ref={backRef} aria-hidden="true" />
      <canvas
        className="hero-canvas hero-canvas--front"
        ref={frontRef}
        aria-hidden="true"
      />
    </>
  )
}
