import React, { useState } from 'react'
import './ImageGrid.css'

/**
 * Responsive photo grid with optional lightbox.
 * Props:
 *   images   – array of { id, url, alt, category }
 *   columns  – number of columns hint (default 3)
 *   limit    – max images to show (undefined = all)
 */
export default function ImageGrid({ images = [], columns = 3, limit }) {
  const [lightbox, setLightbox] = useState(null) // { url, alt }
  const displayed = limit ? images.slice(0, limit) : images

  const open  = (img) => setLightbox(img)
  const close = ()    => setLightbox(null)

  const handleKey = (e) => {
    if (e.key === 'Escape') close()
  }

  return (
    <>
      <div
        className="img-grid"
        style={{ '--img-grid-cols': columns }}
        role="list"
        aria-label="Photo gallery"
      >
        {displayed.map((img) => (
          <button
            key={img.id}
            className="img-grid__item"
            onClick={() => open(img)}
            aria-label={`View photo: ${img.alt || img.category || 'image'}`}
            role="listitem"
          >
            <img
              src={img.url}
              alt={img.alt || ''}
              className="img-grid__img"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
          onKeyDown={handleKey}
          tabIndex={-1}
        >
          <button className="lightbox__close" onClick={close} aria-label="Close photo viewer">
            ✕
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.alt || ''}
            className="lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.alt && (
            <p className="lightbox__caption" onClick={(e) => e.stopPropagation()}>
              {lightbox.alt}
            </p>
          )}
        </div>
      )}
    </>
  )
}
