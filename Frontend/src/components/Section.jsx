import React from 'react'
import './Section.css'

/**
 * Section wrapper.
 * Props:
 *   label      – small uppercase eyebrow text
 *   title      – main heading
 *   subtitle   – subheading paragraph
 *   tinted     – use tinted green-light background
 *   dark       – use dark (black) background
 *   centered   – center-align the header (default true)
 *   id         – section id for anchor links
 *   children
 */
export default function Section({
  label,
  title,
  subtitle,
  tinted = false,
  dark = false,
  centered = true,
  id,
  children,
  className = '',
}) {
  const cls = [
    'section',
    tinted ? 'section--tinted' : '',
    dark   ? 'section--dark'   : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={cls} id={id} aria-labelledby={id ? `${id}-heading` : undefined}>
      <div className="container">
        {(label || title || subtitle) && (
          <div className={`section__header${centered ? '' : ' section__header--left'}`}>
            {label    && <span className="section__label">{label}</span>}
            {title    && <h2 className="section__title" id={id ? `${id}-heading` : undefined}>{title}</h2>}
            {subtitle && <p  className="section__subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
