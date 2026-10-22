import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext'
import './Footer.css'

const QUICK_LINKS = [
  { to: '/',            label: 'Accueil'     },
  { to: '/about',       label: 'À propos'    },
  { to: '/programmes',  label: 'Programmes'  },
  { to: '/gallery',     label: 'Galerie'     },
  { to: '/news',        label: 'Actualités'  },
  { to: '/contact',     label: 'Contact'     },
  { to: '/mentions-legales', label: 'Mentions légales' },
]

const SOCIAL_PATHS = {
  facebook:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  twitter:   'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-6.29-1.43 4.52 4.52 0 0 0-1.54 4.76C7.69 7.48 4.07 5.64 1.64 2.9a4.63 4.63 0 0 0-.61 2.32c0 1.6.82 3.02 2.06 3.85a4.5 4.5 0 0 1-2.05-.57v.06c0 2.24 1.59 4.1 3.7 4.53a4.6 4.6 0 0 1-2.04.08c.57 1.8 2.24 3.1 4.22 3.13A9.05 9.05 0 0 1 0 19.54 12.77 12.77 0 0 0 6.92 21.5c8.3 0 12.84-6.88 12.84-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 22 5.92a9 9 0 0 1-2.6.71A4.52 4.52 0 0 0 21.46 3',
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z',
  linkedin:  'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  youtube:   'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95C1 8.12 1 12 1 12s0 3.88.46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95C23 15.88 23 12 23 12s0-3.88-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
}

export default function Footer() {
  const year         = new Date().getFullYear()
  const { contact }  = useData()
  const socialLinks  = contact?.socialLinks ?? {}
  const phones       = contact?.phones ?? []
  const addressLines = contact?.address
    ? contact.address.split(',').map(l => l.trim()).filter(Boolean)
    : []

  // Only show social icons for platforms with a URL
  const activeSocials = Object.entries(socialLinks).filter(([, url]) => url)

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top container">

        {/* Brand col */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="IPJBU – DUHINDURINGENDO Accueil">
            <img src="/IpjbuLogo.jpg" alt="Logo IPJBU – DUHINDURINGENDO" className="footer__logo-img" />
            <span>IPJBU</span>
          </Link>
          <p className="footer__tagline">
            Initiative pour l'Autopromotion Socio-économique de la Jeunesse au Burundi.
          </p>
          {activeSocials.length > 0 && (
            <div className="footer__social" aria-label="Réseaux sociaux">
              {activeSocials.map(([platform, url]) =>
                SOCIAL_PATHS[platform] ? (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                    aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    className="footer__social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={SOCIAL_PATHS[platform]} />
                    </svg>
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="footer__col">
          <h4 className="footer__heading">Liens rapides</h4>
          <ul className="footer__links">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}><Link to={to} className="footer__link">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__heading">Contact</h4>
          <address className="footer__address">
            {addressLines.length > 0
              ? addressLines.map((line, i) => <p key={i}>{line}</p>)
              : contact?.address && <p>{contact.address}</p>
            }
            {/* phones array (new format) */}
            {phones.length > 0 && phones.map(({ label, number }) => (
              <p key={number}>
                {label && <span className="footer__phone-label">{label} : </span>}
                <a href={`tel:${(number || '').replace(/\s/g, '')}`}>{number}</a>
              </p>
            ))}
            {/* legacy phone field (backward compat) */}
            {phones.length === 0 && contact?.phone && (
              <p><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></p>
            )}
            {contact?.email && (
              <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            )}
            {contact?.officeHours && (
              <p className="footer__hours">{contact.officeHours}</p>
            )}
          </address>
        </div>

      </div>

      <div className="footer__bottom container">
        <p>&copy; {year} IPJBU – DUHINDURINGENDO. Tous droits réservés.</p>
        <p>Association agréée par Ordonnance Ministérielle n° 530/1158 du 12/05/2025</p>
      </div>
    </footer>
  )
}
