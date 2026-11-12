import { useEffect, useRef } from 'react'

/**
 * Dual-layer 3D world-model & multi-view orbit canvas:
 * The back half of the latent/sensor orbit renders behind the portrait and
 * the front half renders in front of it, while forward state-transition &
 * triangulation rays periodically fire across neighboring observers.
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
    const SPIN = 0.088
    const CAM_R = 1.3
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
    let colorA = [43, 80, 230]
    let colorB = [122, 62, 232]
    let strength = 0.9
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
    let nextEvent = 2.2
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

    const ring = []
    const RING_N = small ? 120 : 200
    for (let i = 0; i < RING_N; i++) {
      const startAngle = rand(0, Math.PI * 2)
      const startRadius = rand(1.5, 2.8)
      const a = (i / RING_N) * Math.PI * 2 + rand(-0.015, 0.015)
      ring.push({
        a,
        r: 1 + rand(-0.05, 0.05) + (Math.random() < 0.18 ? rand(-0.14, 0.14) : 0),
        y: rand(-0.04, 0.04),
        size: rand(0.95, 2.15),
        tone: 0.5 + 0.5 * Math.sin(a + 0.8),
        phase: rand(0, Math.PI * 2),
        delay: rand(0, 0.75),
        sx: Math.cos(startAngle) * startRadius,
        sy: rand(-0.9, 0.9),
        sz: Math.sin(startAngle) * startRadius,
        glow: 0,
        color: [43, 80, 230],
        proj: null,
      })
    }

    const cams = []
    const CAM_N = small ? 5 : 7
    for (let k = 0; k < CAM_N; k++) {
      cams.push({
        a: (k / CAM_N) * Math.PI * 2 + 0.3,
        appear: 0.9 + k * 0.12,
        flash: 0,
        apex: null,
      })
    }

    const field = []
    const FIELD_N = small ? 26 : 48
    for (let j = 0; j < FIELD_N; j++) {
      field.push({
        x: rand(-SPREAD, SPREAD),
        y: rand(-SPREAD * 0.55, SPREAD * 0.55),
        z: rand(-SPREAD * 0.5, SPREAD * 0.5),
        vx: rand(-0.14, 0.14),
        vy: rand(-0.09, 0.09),
        vz: rand(-0.07, 0.07),
        r: rand(1, 2.2),
        phase: rand(0, Math.PI * 2),
      })
    }

    const axes3D = [
      { x: -SPREAD * 0.7, y: -SPREAD * 0.35, z: SPREAD * 0.2 },
      { x: SPREAD * 0.75, y: SPREAD * 0.3, z: -SPREAD * 0.15 },
      { x: SPREAD * 0.2, y: -SPREAD * 0.4, z: -SPREAD * 0.3 },
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
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark')
      strength = isDark ? 1 : 0.9
      ring.forEach((p) => {
        p.color = mix(p.tone)
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
            radius * 1.14,
            Math.min(R, (ox - textEdge - 12) / (CAM_R * 1.04))
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
            0.3 *
            Math.max(0.15, Math.min(1, pr.s / 1.2)) *
            (0.7 + 0.3 * Math.sin(t * 1.2 + p.phase)),
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
          if (d < 190) {
            bctx.strokeStyle = rgba(
              colorA,
              (1 - d / 190) * 0.14 * Math.min(1, (pts[a].s + pts[b].s) / 2)
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

      const dirs = [
        [24, 0, 0, '#ef4444'],
        [0, -24, 0, '#22c55e'],
        [0, 0, 24, '#3b82f6'],
      ]
      bctx.globalAlpha = (0.18 + 0.06 * Math.sin(t * 0.5)) * strength
      for (let k = 0; k < axes3D.length; k++) {
        const o = axes3D[k]
        const po = projectField(o.x, o.y, o.z)
        bctx.lineWidth = Math.max(1, 1.4 * Math.min(1, po.s))
        for (let m = 0; m < dirs.length; m++) {
          const pe = projectField(
            o.x + dirs[m][0],
            o.y + dirs[m][1],
            o.z + dirs[m][2]
          )
          bctx.strokeStyle = dirs[m][3]
          bctx.beginPath()
          bctx.moveTo(po.x, po.y)
          bctx.lineTo(pe.x, pe.y)
          bctx.stroke()
        }
      }
      bctx.globalAlpha = 1
    }

    function drawTracks(t) {
      const q = easeOut(clamp01((t - 0.5) / 1.1))
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
            Math.cos(ang) * R * CAM_R,
            0,
            Math.sin(ang) * R * CAM_R
          )
          const cctx = cp.z > 0 ? fctx : bctx
          cctx.fillStyle = rgba(colorA, 0.22 * q)
          cctx.beginPath()
          cctx.arc(cp.x, cp.y, 0.75, 0, Math.PI * 2)
          cctx.fill()
        }
      }
      bctx.lineWidth = 1
      bctx.strokeStyle = rgba(colorA, 0.12 * q)
      bctx.stroke(backPath)
      fctx.lineWidth = 1
      fctx.strokeStyle = rgba(colorA, 0.2 * q)
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
        const twinkle = 0.75 + 0.25 * Math.sin(t * 1.6 + p.phase)
        const alpha = (0.28 + 0.62 * depth) * twinkle * q
        const size = p.size * pr.s * (0.75 + 0.5 * depth)
        const ctx = pr.z > 0 ? fctx : bctx

        ctx.fillStyle = rgba(p.color, alpha)
        ctx.beginPath()
        ctx.arc(pr.x, pr.y, size, 0, Math.PI * 2)
        ctx.fill()

        if (p.glow > 0) {
          const gr = 4 + 18 * p.glow
          const g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, gr)
          g.addColorStop(0, rgba(p.color, 0.6 * p.glow))
          g.addColorStop(1, rgba(p.color, 0))
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(pr.x, pr.y, gr, 0, Math.PI * 2)
          ctx.fill()
          if (!frozen) p.glow = Math.max(0, p.glow - dt * 0.9)
        }
      }
    }

    function drawCameras(t, dt) {
      for (let k = 0; k < cams.length; k++) {
        const cam = cams[k]
        const e = easeOut(clamp01((t - cam.appear) / 0.8))
        if (e <= 0) {
          cam.apex = null
          continue
        }
        cam.flash = Math.max(0, cam.flash - dt * 1.2)

        const ang = cam.a + spin
        const ca = Math.cos(ang)
        const sa = Math.sin(ang)
        const cx = ca * CAM_R * R
        const cz = sa * CAM_R * R
        const d = 0.17 * R * e
        const hw = 0.08 * R * e
        const hh = 0.055 * R * e
        const bx = cx - ca * d
        const bz = cz - sa * d
        const apex = project(cx, 0, cz)
        const c1 = project(bx + sa * hw, -hh, bz - ca * hw)
        const c2 = project(bx - sa * hw, -hh, bz + ca * hw)
        const c3 = project(bx - sa * hw, hh, bz + ca * hw)
        const c4 = project(bx + sa * hw, hh, bz - ca * hw)
        cam.apex = apex

        const depth = clamp01(0.5 + apex.z / (2.4 * R * CAM_R))
        const alpha = (0.25 + 0.45 * depth + 0.4 * cam.flash) * e
        const ctx = apex.z > 0 ? fctx : bctx

        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(c1.x, c1.y)
        ctx.lineTo(c2.x, c2.y)
        ctx.lineTo(c3.x, c3.y)
        ctx.lineTo(c4.x, c4.y)
        ctx.closePath()
        ctx.fillStyle = rgba(colorA, (0.06 + 0.25 * cam.flash) * e)
        ctx.fill()
        ;[c1, c2, c3, c4].forEach((c) => {
          ctx.moveTo(apex.x, apex.y)
          ctx.lineTo(c.x, c.y)
        })
        ctx.strokeStyle = rgba(colorA, alpha)
        ctx.stroke()

        ctx.fillStyle = rgba(colorA, Math.min(1, alpha + 0.2))
        ctx.beginPath()
        ctx.arc(apex.x, apex.y, 1.6 + 1.6 * cam.flash, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function updateEvents(t, dt) {
      if (t > nextEvent) {
        nextEvent = t + rand(1.2, 2)
        const p = ring[(Math.random() * ring.length) | 0]
        const nearest = cams
          .slice()
          .sort((c1, c2) => angleBetween(c1.a, p.a) - angleBetween(c2.a, p.a))
        events.push({ p, cams: [nearest[0], nearest[1]], t: 0, hit: false })
        nearest[0].flash = 1
        nearest[1].flash = 1
      }
      for (let i = events.length - 1; i >= 0; i--) {
        const ev = events[i]
        ev.t += dt
        if (!ev.hit && ev.t > 0.45) {
          ev.hit = true
          ev.p.glow = 1
        }
        if (ev.t > 1.7) events.splice(i, 1)
      }
    }

    function drawEvents() {
      events.forEach((ev) => {
        const pt = ev.p.proj
        if (!pt) return
        const grow = easeOut(clamp01(ev.t / 0.45))
        const fade = ev.t < 0.6 ? 1 : clamp01(1 - (ev.t - 0.6) / 1.1)
        const apexes = ev.cams.map((cam) => cam.apex).filter(Boolean)

        if (apexes.length === 2) {
          const lineCtx = apexes[0].z > 0 || apexes[1].z > 0 ? fctx : bctx
          lineCtx.save()
          lineCtx.setLineDash([3, 4])
          lineCtx.lineWidth = 1
          lineCtx.strokeStyle = rgba(colorA, 0.3 * fade)
          lineCtx.beginPath()
          lineCtx.moveTo(apexes[0].x, apexes[0].y)
          lineCtx.lineTo(apexes[1].x, apexes[1].y)
          lineCtx.stroke()
          lineCtx.restore()
        }

        apexes.forEach((a) => {
          const ex = a.x + (pt.x - a.x) * grow
          const ey = a.y + (pt.y - a.y) * grow
          const ctx = a.z > 0 || pt.z > 0 ? fctx : bctx
          ctx.lineWidth = 1
          ctx.strokeStyle = rgba(colorB, 0.6 * fade)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(ex, ey)
          ctx.stroke()
          if (grow < 1) {
            ctx.fillStyle = rgba(colorB, 0.95)
            ctx.beginPath()
            ctx.arc(ex, ey, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        })
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
      drawCameras(t, frozen ? 0 : dt)
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

    // Pointer tilt, spotlight, and parallax
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
