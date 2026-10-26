import React, { useState, useMemo } from 'react'
import ImageGrid from '../components/ImageGrid'
import { useData } from '../store/DataContext'
import './Gallery.css'

export default function Gallery() {
  const { images, galleryImages } = useData()
  const [active, setActive] = useState('Tous')

  const categories = useMemo(
    () => ['Tous', ...new Set(galleryImages.map((i) => i.category))],
    [galleryImages]
  )

  const displayed = active === 'Tous'
    ? galleryImages
    : galleryImages.filter((i) => i.category === active)

  return (
    <div className="gallery-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Galerie photo</span>
          <h1 className="page-hero__title">Galerie</h1>
          <p className="page-hero__sub">
            Une fenêtre visuelle sur les activités et les communautés soutenues par l'IPJBU.
            Cliquez sur une photo pour l'agrandir.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          <div className="gallery__tabs" role="tablist" aria-label="Filtrer par catégorie">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                className={`gallery__tab${active === cat ? ' gallery__tab--active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <p className="gallery__count" aria-live="polite">
            {displayed.length} {displayed.length === 1 ? 'photo' : 'photos'}
            {active !== 'Tous' ? ` · ${active}` : ''}
          </p>

          {images.length === 0 ? (
            <p className="gallery__loading">Chargement de la galerie…</p>
          ) : galleryImages.length === 0 ? (
            <p className="gallery__empty">Aucune photo dans la galerie pour le moment.</p>
          ) : (
            <ImageGrid images={displayed} columns={4} />
          )}

          {galleryImages.length > 0 && displayed.length === 0 && (
            <p className="gallery__empty">Aucune photo dans cette catégorie.</p>
          )}
        </div>
      </section>

    </div>
  )
}