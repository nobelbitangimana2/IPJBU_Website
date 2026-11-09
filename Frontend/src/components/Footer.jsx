import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext'
import './Footer.css'

const NAV_LINKS = [
  { to: '/',              label: 'Accueil'          },
  { to: '/about',         label: 'À propos'         },
  { to: '/programmes',    label: 'Programmes'       },
  { to: '/partners',      label: 'Partenaires'      },
  { to: '/opportunities', label: 'Opportunités'     },
  { to: '/gallery',       label: 'Galerie'          },
  { to: '/news',          label: 'Actualités'       },
  { to: '/contact',       label: 'Contact'          },
  { to: '/mentions-legales', label: 'Mentions légales' },
]

export default function Footer() {
  const year        = new Date().getFullYear()
  const { contact } = useData()
  const phones      = contact?.phones ?? []

  /* First phone only in footer to keep it compact */
  const firstPhone = phones[0] ?? (contact?.phone ? { label: '', number: contact.phone } : null)

  return (
    <footer className="footer" role="contentinfo">

      {/* ── Main row ── */}
      <div className="footer__main container">

        {/* Logo + motto */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="IPJBU – DUHINDURINGENDO accueil">
            <img src="/IpjbuLogo.jpg" alt="Logo IPJBU – DUHINDURINGENDO" className="footer__logo-img" />
            <div>
              <span className="footer__logo-name">IPJBU – DUHINDURINGENDO</span>
              <span className="footer__logo-sub">
                &laquo;&nbsp;Jeunesse Burundaise, faisons la différence&nbsp;&raquo;
              </span>
            </div>
          </Link>
        </div>

        {/* Nav links — two compact columns */}
        <nav className="footer__nav" aria-label="Navigation pied de page">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="footer__link">{label}</Link>
          ))}
        </nav>

        {/* Contact + Donate */}
        <div className="footer__contact">
          {contact?.address && (
            <p className="footer__contact-line">
              📍 {contact.address.split(',').slice(0, 2).join(', ')}
            </p>
          )}
          {firstPhone && (
            <p className="footer__contact-line">
              📞{' '}
              {firstPhone.label && <span className="footer__phone-label">{firstPhone.label} : </span>}
              <a href={`tel:${firstPhone.number.replace(/\s/g, '')}`}>{firstPhone.number}</a>
            </p>
          )}
          {contact?.email && (
            <p className="footer__contact-line">
              ✉ <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          )}
          <Link to="/contact" className="footer__donate">Faire un don</Link>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom container">
        <p>&copy; {year} <strong>IPJBU – DUHINDURINGENDO</strong>. Tous droits réservés.</p>
        <p>Agréée par O.M. n°&nbsp;530/1158 du 12/05/2025</p>
      </div>

    </footer>
  )
}
