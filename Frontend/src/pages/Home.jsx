import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button     from '../components/Button'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import './Home.css'

/* TODO: replace with authorised photos supplied by the association via the admin media panel */
const FALLBACK_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80', alt: 'Champs agro-pastoraux' },
  { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80', alt: 'Travail agricole'      },
  { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80', alt: 'Recolte'               },
]
const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&q=80'

export default function Home() {
  const { updates, content, galleryImages } = useData()
  const { t } = useLang()
  const [slide, setSlide] = useState(0)

  const slides = galleryImages.length
    ? galleryImages.slice(0, 5).map(i => ({ url: i.url, alt: i.alt || 'Photo IPJBU' }))
    : FALLBACK_SLIDES

  const valuesPhoto = galleryImages[5] ?? galleryImages[0]

  useEffect(() => {
    setSlide(0)
    const id = setInterval(() => setSlide(s => (s + 1) % slides.length), 5500)
    return () => clearInterval(id)
  }, [slides.length])

  const latest = [...updates]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero" aria-label="Banniere principale">
        {slides.map((s, i) => (
          <img
            key={s.url}
            src={s.url}
            alt={s.alt}
            className={`hero__bg${i === slide ? ' hero__bg--active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i !== slide}
          />
        ))}
        <div className="hero__overlay" aria-hidden="true" />

        <div className="hero__content container">
          <p className="hero__eyebrow">{t('home.eyebrow')}</p>
          <h1 className="hero__title">
            {t('home.title').split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
            ))}
          </h1>
          <p className="hero__sub">{t('home.subtitle')}</p>
          <div className="hero__actions">
            <Button to="/programmes" size="lg">{t('home.cta.programmes')}</Button>
            <Button to="/about" size="lg" variant="outline-white">{t('home.cta.about')}</Button>
          </div>
        </div>

        <div className="hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot${i === slide ? ' hero__dot--active' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Diapositive ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="features section--white">
        <div className="container">
          <div className="features__grid">
            {[
              { icon: '🌱', color: 'var(--green-dark)', panel: 'var(--green-light)', tk: 'feat.1.title', dk: 'feat.1.desc', ck: 'feat.1.cta' },
              { icon: '🛠️', color: 'var(--orange)',     panel: '#fff3dc',            tk: 'feat.2.title', dk: 'feat.2.desc', ck: 'feat.2.cta' },
              { icon: '🏭', color: 'var(--green-dark)', panel: 'var(--green-light)', tk: 'feat.3.title', dk: 'feat.3.desc', ck: 'feat.3.cta' },
            ].map(({ icon, color, panel, tk, dk, ck }) => (
              <div key={tk} className="feat-card" style={{ background: panel }}>
                <div className="feat-card__icon" style={{ background: color }}>
                  <span aria-hidden="true">{icon}</span>
                </div>
                <h3 className="feat-card__title">{t(tk)}</h3>
                <p className="feat-card__desc">{t(dk)}</p>
                <Link to="/programmes" className="feat-card__link" style={{ color }}>
                  {t(ck)} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="commitment section--cream">
        <div className="container">
          <div className="commitment__top">
            <div className="commitment__text">
              <span className="section__label">{t('home.values.label')}</span>
              <h2 className="section__title">
                {t('home.values.title').split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                ))}
              </h2>
              <p className="commitment__intro">{t('home.values.intro')}</p>
              <Button to="/about" variant="outline">{t('home.values.cta')}</Button>
            </div>
            <div className="commitment__photo-wrap">
              <img
                src={valuesPhoto?.url ?? FALLBACK_PHOTO}
                alt={valuesPhoto?.alt || 'Activite IPJBU'}
                className="commitment__photo"
                loading="lazy"
              />
            </div>
          </div>

          <div className="commitment__values">
            {[
              { icon: '🤝', tk: 'val.integrity.title',  dk: 'val.integrity.desc'  },
              { icon: '📊', tk: 'val.account.title',    dk: 'val.account.desc'    },
              { icon: '🌍', tk: 'val.solidarity.title', dk: 'val.solidarity.desc' },
              { icon: '💚', tk: 'val.empathy.title',    dk: 'val.empathy.desc'    },
            ].map(({ icon, tk, dk }) => (
              <div key={tk} className="val-item">
                <span className="val-item__icon" aria-hidden="true">{icon}</span>
                <div>
                  <p className="val-item__title">{t(tk)}</p>
                  <p className="val-item__desc">{t(dk)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTUALITES */}
      {latest.length > 0 && (
        <section className="updates-section section--green">
          <div className="container">
            <div className="updates-section__header">
              <div>
                <span className="section__label">{t('home.news.label')}</span>
                <h2 className="section__title">{t('home.news.title')}</h2>
              </div>
              <Button to="/news" variant="outline-white" size="sm">{t('home.news.cta')}</Button>
            </div>
            <div className="grid-3">
              {latest.map(u => <UpdateCard key={u.id} {...u} dark />)}
            </div>
          </div>
        </section>
      )}

      {/* PARTENAIRES */}
      {(content.partners || []).length > 0 && (
        <section className="home-partners section--cream">
          <div className="container">
            <div className="home-partners__header">
              <span className="section__label">{t('home.partners.label')}</span>
              <h2 className="section__title">{t('home.partners.title')}</h2>
            </div>
            <div className="home-partners__grid">
              {content.partners.map((entry, index) => {
                const partner = typeof entry === 'string' ? { name: entry } : entry
                const inner = partner.logoUrl
                  ? <img src={partner.logoUrl} alt={partner.name} loading="lazy" />
                  : <span>{partner.name}</span>
                return partner.websiteUrl ? (
                  <a key={`${partner.name}-${index}`} href={partner.websiteUrl}
                    target="_blank" rel="noopener noreferrer" className="home-partners__item">
                    {inner}
                  </a>
                ) : (
                  <div key={`${partner.name}-${index}`} className="home-partners__item">{inner}</div>
                )
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
