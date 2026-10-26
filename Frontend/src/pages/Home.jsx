import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button     from '../components/Button'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import './Home.css'

/* ── Fallbacks, used only if the media library has no gallery images ── */
const FALLBACK_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    alt: 'Champs agro-pastoraux au lever du soleil',
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
    alt: 'Jeune agriculteur travaillant dans un champ',
  },
  {
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80',
    alt: 'Récolte agro-pastorale',
  },
]
const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&q=80'

/* ── Responsive image sizes via ImageKit URL transformations (no effect on other hosts) ── */
const IK_HOST = 'ik.imagekit.io'

function resized(url, width) {
  if (!url || !url.includes(IK_HOST)) return url
  return `${url}${url.includes('?') ? '&' : '?'}tr=w-${width}`
}

function heroSrcSet(url) {
  if (!url || !url.includes(IK_HOST)) return undefined
  return [640, 1024, 1600].map((w) => `${resized(url, w)} ${w}w`).join(', ')
}

/* ── Feature cards ── */
const FEATURES = [
  {
    icon: '🌱',
    color: '#008a4a',
    panel: 'var(--green-light)',
    title: 'Formation agro-pastorale',
    desc:  'Nous formons les jeunes et les femmes vulnérables aux techniques agro-pastorales modernes pour renforcer leur autonomie et améliorer leur productivité.',
    link:  '/programmes',
    label: 'Nos programmes',
  },
  {
    icon: '🛠️',
    color: '#c26f00',
    panel: '#fff3dc',
    title: 'Équipement et intrants',
    desc:  'Distribution de semences sélectionnées et de bétail/volailles de qualité, accompagnée du renforcement des capacités en gestion des stocks et en conservation des récoltes.',
    link:  '/programmes',
    label: 'En savoir plus',
  },
  {
    icon: '🏭',
    color: '#008a4a',
    panel: 'var(--green-light)',
    title: 'Transformation agroalimentaire',
    desc:  'Mise en place de micro-unités de transformation agroalimentaire pour valoriser les productions locales et créer de la valeur ajoutée au sein des communautés.',
    link:  '/programmes',
    label: 'En savoir plus',
  },
]

/* ── Valeurs ── */
const VALUES = [
  { icon: '🤝', title: 'Intégrité',      desc: 'Nous agissons avec honnêteté et transparence dans toutes nos actions et engagements.' },
  { icon: '📊', title: 'Redevabilité',   desc: 'Nous rendons compte de nos résultats aux bénéficiaires, partenaires et à la communauté.' },
  { icon: '🌍', title: 'Solidarité',     desc: 'Nous unissons les forces des jeunes et des femmes pour un développement collectif et durable.' },
  { icon: '💚', title: 'Empathie',       desc: 'Nous plaçons au centre de notre action les besoins réels des orphelins et des personnes vulnérables.' },
]

export default function Home() {
  const { updates, content, galleryImages } = useData()
  const [slide, setSlide] = useState(0)

  // Hero: first 5 gallery images from the media library, else fallbacks
  const slides = galleryImages.length
    ? galleryImages.slice(0, 5).map((i) => ({ url: i.url, alt: i.alt || 'Photo IPJBU' }))
    : FALLBACK_SLIDES

  // Photo for the "Nos valeurs" section: the 6th gallery image, else the first
  const valuesPhoto = galleryImages[5] ?? galleryImages[0]

  useEffect(() => {
    setSlide(0)
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5500)
    return () => clearInterval(id)
  }, [slides.length])

  const latest = [...updates]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  return (
    <div className="home">

      {/* ══ HERO ══ */}
      <section className="hero" aria-label="Bannière principale">
        {slides.map((s, i) => (
          <img
            key={s.url}
            src={resized(s.url, 1600)}
            srcSet={heroSrcSet(s.url)}
            sizes="100vw"
            alt={s.alt}
            className={`hero__bg${i === slide ? ' hero__bg--active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            aria-hidden={i !== slide}
          />
        ))}
        <div className="hero__overlay" aria-hidden="true" />

        <div className="hero__content container">
          <p className="hero__eyebrow">Organisation de la société civile burundaise</p>
          <h1 className="hero__title">
            Jeunesse Burundaise,<br />
            faisons la différence
          </h1>
          <p className="hero__sub">
            Lutter contre la pauvreté par le développement agro-pastoral à travers
            des actions concrètes de formation et de soutien aux jeunes, aux orphelins
            et aux femmes vulnérables.
          </p>
          <div className="hero__actions">
            <Button to="/programmes" size="lg">Nos programmes</Button>
            <Button to="/about" size="lg" variant="outline-white">À propos</Button>
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

      {/* ══ FEATURE CARDS ══ */}
      <section className="features section--white" aria-label="Ce que nous faisons">
        <div className="container">
          <div className="features__grid">
            {FEATURES.map(({ icon, color, panel, title, desc, link, label }) => (
              <div key={title} className="feat-card" style={{ background: panel }}>
                <div className="feat-card__icon" style={{ background: color }}>
                  <span aria-hidden="true">{icon}</span>
                </div>
                <h3 className="feat-card__title">{title}</h3>
                <p className="feat-card__desc">{desc}</p>
                <Link to={link} className="feat-card__link" style={{ color: color }}>
                  {label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALEURS ══ */}
      <section className="commitment section--cream" aria-label="Nos valeurs">
        <div className="container">
          <div className="commitment__top">
            <div className="commitment__text">
              <span className="section__label">Nos valeurs</span>
              <h2 className="section__title">Ce qui guide<br />notre action</h2>
              <p className="commitment__intro">
                L'IPJBU – DUHINDURINGENDO fonde son action sur quatre valeurs fondamentales
                qui orientent chaque décision, de la formation sur le terrain aux partenariats stratégiques.
              </p>
              <Button to="/about" variant="outline">En savoir plus</Button>
            </div>
            <div className="commitment__photo-wrap">
              <img
                src={valuesPhoto?.url ?? FALLBACK_PHOTO}
                alt={valuesPhoto?.alt || 'Bénéficiaires de l’IPJBU'}
                className="commitment__photo"
                loading="lazy"
              />
            </div>
          </div>

          <div className="commitment__values">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="val-item">
                <span className="val-item__icon" aria-hidden="true">{icon}</span>
                <div>
                  <p className="val-item__title">{title}</p>
                  <p className="val-item__desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DERNIÈRES ACTUALITÉS ══ */}
      {latest.length > 0 && (
        <section className="updates-section section--green" aria-label="Dernières actualités">
          <div className="container">
            <div className="updates-section__header">
              <div>
                <span className="section__label">Actualités</span>
                <h2 className="section__title">Dernières nouvelles</h2>
              </div>
              <Button to="/news" variant="outline-white" size="sm">Toutes les actualités</Button>
            </div>
            <div className="grid-3">
              {latest.map(u => <UpdateCard key={u.id} {...u} dark />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ PARTENAIRES ══ */}
      {(content.partners || []).length > 0 && (
        <section className="home-partners section--cream" aria-label="Nos partenaires">
          <div className="container">
            <div className="home-partners__header">
              <span className="section__label">Ils nous accompagnent</span>
              <h2 className="section__title">Nos partenaires</h2>
            </div>
            <div className="home-partners__grid">
              {content.partners.map((entry, index) => {
                const partner = typeof entry === 'string' ? { name: entry } : entry
                const inner = partner.logoUrl
                  ? <img src={partner.logoUrl} alt={partner.name} loading="lazy" />
                  : <span>{partner.name}</span>
                return partner.websiteUrl ? (
                  <a key={`${partner.name}-${index}`} href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="home-partners__item">
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