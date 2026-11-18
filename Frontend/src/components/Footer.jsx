import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import Reveal from './Reveal'
import './Footer.css'

export default function Footer() {
  const year        = new Date().getFullYear()
  const { contact } = useData()
  const { t } = useLang()
  const phones      = contact?.phones ?? []

  const firstPhone = phones[0] ?? (contact?.phone ? { label: '', number: contact.phone } : null)

  const NAV_LINKS = [
    { to: '/',              label: t('nav.home')          },
    { to: '/about',         label: t('footer.about')       },
    { to: '/programmes',    label: t('nav.programmes')    },
    { to: '/partners',      label: t('nav.partners')      },
    { to: '/opportunities', label: t('nav.opportunities') },
    { to: '/gallery',       label: t('nav.gallery')       },
    { to: '/news',          label: t('nav.news')          },
    { to: '/contact',       label: t('nav.contact')       },
    { to: '/mentions-legales', label: t('footer.legalNav') },
  ]

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__main container">
        <Reveal as="div" className="footer__brand" animation="fade-up">
          <Link to="/" className="footer__logo" aria-label={t('brand.logoLabel')}>
            <img src="/IpjbuLogo.jpg" alt={t('brand.logoAlt')} className="footer__logo-img" />
            <div>
              <span className="footer__logo-name">IPJBU – DUHINDURINGENDO</span>
              <span className="footer__logo-sub">
                {t('footer.motto')}
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal as="nav" className="footer__nav" animation="fade-up" delay={90} aria-label={t('footer.navLabel')}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="footer__link">{label}</Link>
          ))}
        </Reveal>

        <Reveal as="div" className="footer__contact" animation="fade-up" delay={180}>
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
          <Link to="/donate" className="footer__donate">{t('nav.donate')}</Link>
        </Reveal>
      </div>

      <div className="footer__bottom container">
        <p>&copy; {year} <strong>IPJBU – DUHINDURINGENDO</strong>. {t('footer.rights')}</p>
        <p>{t('footer.legal')}</p>
      </div>
    </footer>
  )
}
