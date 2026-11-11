import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useLang } from '../store/LangContext'
import './NavBar.css'

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const { lang, toggle: toggleLang, t } = useLang()
  const dropRef  = useRef(null)
  const location = useLocation()

  const TOP_LINKS = [
    { to: '/',        label: t('nav.home'),    end: true },
    { to: '/about',   label: t('nav.about')             },
    { to: '/gallery', label: t('nav.gallery')           },
    { to: '/contact', label: t('nav.contact')           },
  ]

  const MENU_LINKS = [
    { to: '/programmes',    label: t('nav.programmes')    },
    { to: '/partners',      label: t('nav.partners')      },
    { to: '/opportunities', label: t('nav.opportunities') },
    { to: '/news',          label: t('nav.news')          },
  ]

  useEffect(() => {
    setDropOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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

  const menuActive = MENU_LINKS.some(l =>
    location.pathname === l.to || location.pathname.startsWith(l.to + '/'))

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">

        <Link to="/" className="navbar__logo" onClick={closeAll}
          aria-label="IPJBU – DUHINDURINGENDO — accueil">
          <img src="/IpjbuLogo.jpg" alt="Logo IPJBU – DUHINDURINGENDO" className="navbar__logo-img" />
          <span className="navbar__logo-text">
            <span className="navbar__logo-short">IPJBU</span>
            <span className="navbar__logo-full">IPJBU&nbsp;–&nbsp;DUHINDURINGENDO</span>
          </span>
        </Link>

        <nav className="navbar__links" aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
          {TOP_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
              {label}
            </NavLink>
          ))}

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
              {t('nav.menu')}
              <span className="navbar__chevron" aria-hidden="true">{dropOpen ? '▲' : '▼'}</span>
            </button>

            <div id="nav-dropdown-panel" className="navbar__dropdown-panel" role="menu">
              {MENU_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} role="menuitem"
                  className={({ isActive }) =>
                    'navbar__dropdown-link' + (isActive ? ' navbar__dropdown-link--active' : '')}
                  onClick={closeAll}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__lang"
            onClick={toggleLang}
            aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <Link to="/contact" className="navbar__donate" onClick={closeAll}>
            {t('nav.donate')}
          </Link>
        </div>

        <button
          className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? (lang === 'fr' ? 'Fermer le menu' : 'Close menu') : (lang === 'fr' ? 'Ouvrir le menu' : 'Open menu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <nav id="mobile-menu"
        className={`navbar__mobile${mobileOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!mobileOpen}>
        {TOP_LINKS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => 'navbar__mobile-link' + (isActive ? ' navbar__mobile-link--active' : '')}
            onClick={closeAll}>{label}</NavLink>
        ))}

        <div className="navbar__mobile-divider" aria-hidden="true">{t('nav.menu')}</div>

        {MENU_LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              'navbar__mobile-link navbar__mobile-link--sub' + (isActive ? ' navbar__mobile-link--active' : '')}
            onClick={closeAll}>{label}</NavLink>
        ))}

        <div className="navbar__mobile-bottom">
          <button className="navbar__mobile-lang" onClick={toggleLang}
            aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}>
            {lang === 'fr' ? '🌐 EN' : '🌐 FR'}
          </button>
          <Link to="/contact" className="navbar__mobile-donate" onClick={closeAll}>
            {t('nav.donate')}
          </Link>
        </div>
      </nav>
    </header>
  )
}
