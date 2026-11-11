import React, { useState, useMemo } from 'react'
import ImageGrid from '../components/ImageGrid'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import './Gallery.css'

export default function Gallery() {
  const { images, galleryImages } = useData()
  const { t, lang } = useLang()
  const all = lang === 'fr' ? 'Tous' : 'All'
  const [active, setActive] = useState(all)

  const categories = useMemo(
    () => [all, ...new Set(galleryImages.map(i => i.category))],
    [galleryImages, all]
  )

  const displayed = active === all
    ? galleryImages
    : galleryImages.filter(i => i.category === active)

  const photoWord = displayed.length === 1 ? t('gallery.photo') : t('gallery.photos')

  return (
    <div className="gallery-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('gallery.hero.label')}</span>
          <h1 className="page-hero__title">{t('gallery.hero.title')}</h1>
          <p className="page-hero__sub">{t('gallery.hero.sub')}</p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          <div className="gallery__tabs" role="tablist"
            aria-label={lang === 'fr' ? 'Filtrer par catégorie' : 'Filter by category'}>
            {categories.map(cat => (
              <button key={cat} role="tab"
                aria-selected={active === cat}
                className={`gallery__tab${active === cat ? ' gallery__tab--active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <p className="gallery__count" aria-live="polite">
            {displayed.length} {photoWord}
            {active !== all ? ` · ${active}` : ''}
          </p>

          {images.length === 0 ? (
            <p className="gallery__loading">{t('gallery.loading')}</p>
          ) : galleryImages.length === 0 ? (
            <p className="gallery__empty">{t('gallery.empty')}</p>
          ) : (
            <ImageGrid images={displayed} columns={4} />
          )}

          {galleryImages.length > 0 && displayed.length === 0 && (
            <p className="gallery__empty">{t('gallery.empty')}</p>
          )}
        </div>
      </section>

    </div>
  )
}
