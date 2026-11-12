import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { RESUME_URL } from '@/lib/resume'
import {
  ExternalArrowIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@/components/Icons'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'news', label: 'News' },
  { id: 'publications', label: 'Publications' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'honors', label: 'Honors' },
]

export function Header() {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const navRef = useRef(null)
  const progressRef = useRef(null)

  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const syncThemeState = () => {
      const dark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark')
      setIsDark(dark)
    }
    syncThemeState()

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches ? 'dark' : 'light', false)
        }
      } catch (err) {}
    }
    if (media.addEventListener) {
      media.addEventListener('change', onSystemChange)
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', onSystemChange)
      }
    }
  }, [])

  function applyTheme(next, persist) {
    document.documentElement.setAttribute('data-theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setIsDark(next === 'dark')
    if (persist) {
      try {
        localStorage.setItem('theme', next)
      } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }))
  }

  function toggleTheme() {
    applyTheme(isDark ? 'light' : 'dark', true)
  }

  useEffect(() => {
    let ticking = false
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 24)
      if (progressRef.current) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight
        const progress =
          max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        progressRef.current.style.transform = `scaleX(${progress})`
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    updateScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [router.asPath])

  useEffect(() => {
    if (!isHome || typeof IntersectionObserver === 'undefined') {
      setActiveSection('')
      return
    }

    const visible = {}
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible[entry.target.id] = entry.isIntersecting
        })
        let current = ''
        for (const s of SECTIONS) {
          if (visible[s.id]) {
            current = s.id
            break
          }
        }
        setActiveSection(current)
      },
      { rootMargin: '-42% 0px -50% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClickOutside)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div
        className="scroll-progress"
        ref={progressRef}
        aria-hidden="true"
      />

      <header
        ref={navRef}
        className={clsx(
          'site-nav',
          isScrolled && 'is-scrolled',
          menuOpen && 'menu-open',
          !isHome && 'always-show-brand is-scrolled'
        )}
      >
        <div className="site-nav-inner">
          <Link
            href={isHome ? '#top' : '/'}
            className="brand"
            aria-label="Héctor Carrión, back to top"
          >
            <span className="brand-mark">HC</span>
            <span className="brand-name">Héctor Carrión</span>
          </Link>

          <nav
            className="nav-links"
            id="nav-links"
            aria-label="Primary"
            onClick={(e) => {
              if (e.target.closest('a')) setMenuOpen(false)
            }}
          >
            {SECTIONS.map((section) => {
              const href = isHome ? `#${section.id}` : `/#${section.id}`
              const active = isHome && activeSection === section.id
              return (
                <Link
                  key={section.id}
                  href={href}
                  className={clsx(active && 'is-active')}
                >
                  {section.label}
                </Link>
              )
            })}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cv"
            >
              <span>CV</span>
              <ExternalArrowIcon className="h-3 w-3 opacity-70" />
            </a>
          </nav>

          <div className="nav-actions">
            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDark ? (
                <SunIcon className="h-[18px] w-[18px] text-[var(--accent)]" />
              ) : (
                <MoonIcon className="h-[18px] w-[18px]" />
              )}
            </button>

            <button
              className="icon-btn menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-links"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <XMarkIcon className="h-[18px] w-[18px]" />
              ) : (
                <MenuIcon className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
