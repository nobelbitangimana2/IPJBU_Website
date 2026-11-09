import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './NavBar.css'

/* ── Always-visible top-level links ── */
const TOP_LINKS = [
  { to: '/',       label: 'Accueil', end: true },
  { to: '/about',  label: 'À propos'           },
  { to: '/gallery',label: 'Galerie'            },
  { to: '/contact',label: 'Contact'            },
]

/* ── Links that live INSIDE the "Menu" dropdown ── */
const MENU_LINKS = [
  { to: '/programmes',    label: 'Programmes'   },
  { to: '/partners',      label: 'Partenaires'  },
  { to: '/opportunities', label: 'Opportunités' },
  { to: '/news',          label: 'Actualités'   },
]

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const dropRef  = useRef(null)
  const location = useLocation()

  /* Close dropdown when route changes */
  useEffect(() => {
    setDropOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  /* Scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropOpen) return
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [dropOpen])

  const closeAll = () => { setMobileOpen(false); setDropOpen(false) }

  /* Is any dropdown link currently active? */
  const menuActive = MENU_LINKS.some(l => location.pathname === l.to ||
    location.pathname.startsWith(l.to + '/'))

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">

        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo" onClick={closeAll}
          aria-label="IPJBU – DUHINDURINGENDO — accueil">
          <img
            src="/IpjbuLogo.jpg"
            alt="Logo IPJBU – DUHINDURINGENDO"
            className="navbar__logo-img"
          />
          <span className="navbar__logo-text">
            <span className="navbar__logo-short">IPJBU</span>
            <span className="navbar__logo-full">IPJBU&nbsp;–&nbsp;DUHINDURINGENDO</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="navbar__links" aria-label="Navigation principale">

          {TOP_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
              {label}
            </NavLink>
          ))}

          {/* ── "Menu" dropdown ── */}
          <div
            className={`navbar__dropdown${dropOpen ? ' navbar__dropdown--open' : ''}${menuActive ? ' navbar__dropdown--active' : ''}`}
            ref={dropRef}
          >
            <button
              className={`navbar__link navbar__menu-btn${menuActive ? ' navbar__link--active' : ''}`}
              onClick={() => setDropOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={dropOpen}
              aria-controls="nav-dropdown-panel"
            >
              Menu
              <span className="navbar__chevron" aria-hidden="true">
                {dropOpen ? '▲' : '▼'}
              </span>
            </button>

            <div
              id="nav-dropdown-panel"
              className="navbar__dropdown-panel"
              role="menu"
              aria-label="Sous-menu"
            >
              {MENU_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  role="menuitem"
                  className={({ isActive }) =>
                    'navbar__dropdown-link' + (isActive ? ' navbar__dropdown-link--active' : '')
                  }
                  onClick={closeAll}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

        </nav>

        {/* ── Donate CTA ── */}
        <div className="navbar__actions">
          <Link to="/contact" className="navbar__donate" onClick={closeAll}>
            Faire un don
          </Link>
        </div>

        {/* ── Hamburger ── */}
        <button
          className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <nav
        id="mobile-menu"
        className={`navbar__mobile${mobileOpen ? ' navbar__mobile--open' : ''}`}
        aria-label="Navigation mobile"
        aria-hidden={!mobileOpen}
      >
        {TOP_LINKS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              'navbar__mobile-link' + (isActive ? ' navbar__mobile-link--active' : '')}
            onClick={closeAll}>
            {label}
          </NavLink>
        ))}

        {/* Divider + dropdown items flat in mobile */}
        <div className="navbar__mobile-divider" aria-hidden="true">Menu</div>

        {MENU_LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              'navbar__mobile-link navbar__mobile-link--sub' + (isActive ? ' navbar__mobile-link--active' : '')}
            onClick={closeAll}>
            {label}
          </NavLink>
        ))}

        <Link to="/contact" className="navbar__mobile-donate" onClick={closeAll}>
          Faire un don
        </Link>
      </nav>
    </header>
  )
}
