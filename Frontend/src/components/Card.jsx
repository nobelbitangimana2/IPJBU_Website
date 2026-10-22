import React from 'react'
import './Card.css'

/**
 * Generic card container.
 * Props:
 *   image       – img src URL
 *   imageAlt    – alt text
 *   badge       – small label (e.g. category)
 *   title
 *   subtitle    – secondary line below title
 *   body        – paragraph text / children slot
 *   footer      – bottom area (e.g. buttons)
 *   horizontal  – layout card side-by-side (image left, content right)
 *   className
 */
export default function Card({
  image,
  imageAlt = '',
  badge,
  title,
  subtitle,
  body,
  footer,
  horizontal = false,
  className = '',
  children,
}) {
  return (
    <article className={`card${horizontal ? ' card--horizontal' : ''} ${className}`}>
      {image && (
        <div className="card__img-wrap">
          <img src={image} alt={imageAlt} className="card__img" loading="lazy" />
          {badge && <span className="card__badge">{badge}</span>}
        </div>
      )}
      <div className="card__body">
        {title    && <h3 className="card__title">{title}</h3>}
        {subtitle && <p  className="card__subtitle">{subtitle}</p>}
        {body     && <p  className="card__text">{body}</p>}
        {children}
        {footer   && <div className="card__footer">{footer}</div>}
      </div>
    </article>
  )
}
