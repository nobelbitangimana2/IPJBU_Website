import React, { useState, useEffect, useCallback } from 'react'
import './Slideshow.css'

/**
 * Auto-rotating full-bleed photo slideshow.
 * Props:
 *   slides  – [{ imageUrl, imageAlt }]
 *   interval – ms between auto-advances (default 5000)
 *   children – overlay content (tagline, CTA, etc.)
 */
export default function Slideshow({ slides = [], interval = 5000, children }) {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  )
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const goTo = (i) => setCurrent(i)

  useEffect(() => {
    if (paused || slides.length < 2) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [next, interval, paused, slides.length])

  if (!slides.length) return null

  return (
    <div
      className="slideshow"
      role="region"
      aria-label="Hero slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slideshow__slide${i === current ? ' slideshow__slide--active' : ''}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.imageUrl}
            alt={slide.imageAlt || ''}
            className="slideshow__img"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Dark overlay for text legibility */}
          <div className="slideshow__overlay" aria-hidden="true" />
        </div>
      ))}

      {/* Overlay content */}
      <div className="slideshow__content">
        {children}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            className="slideshow__arrow slideshow__arrow--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="slideshow__arrow slideshow__arrow--next"
            onClick={next}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dots */}
          <div className="slideshow__dots" role="tablist" aria-label="Slide indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`slideshow__dot${i === current ? ' slideshow__dot--active' : ''}`}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
