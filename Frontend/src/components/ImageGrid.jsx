import React, { useState } from 'react'
import { useLang } from '../store/LangContext'
import Reveal from './Reveal'
import './ImageGrid.css'

/**
 * Responsive photo grid with optional lightbox.
 * Props:
 *   images   – array of { id, url, alt, category }
 *   columns  – number of columns hint (default 3)
 *   limit    – max images to show (undefined = all)
 */
export default function ImageGrid({ images = [], columns = 3, limit }) {
  const { t } = useLang()
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
        aria-label={t('gallery.aria')}
      >
        {displayed.map((img, index) => (
          <Reveal key={img.id} delay={(index % columns) * 55}>
          <button
            className="img-grid__item"
            onClick={() => open(img)}
            aria-label={t('gallery.view', { photo: img.alt || img.category || 'image' })}
            role="listitem"
          >
            <img
              src={img.url}
              alt={img.alt || ''}
              className="img-grid__img"
              loading="lazy"
            />
          </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.viewer')}
          onClick={close}
          onKeyDown={handleKey}
          tabIndex={-1}
        >
          <button className="lightbox__close" onClick={close} aria-label={t('gallery.close')}>
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
