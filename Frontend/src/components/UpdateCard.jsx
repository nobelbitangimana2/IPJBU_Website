import React from 'react'
import { Link } from 'react-router-dom'
import './UpdateCard.css'

/**
 * Card for news/update items.
 * Props: { id, title, date, excerpt, imageUrl, category, dark }
 * dark=true  → white card with white background (used on green sections)
 * dark=false → standard bordered card
 */
export default function UpdateCard({ id, title, date, excerpt, imageUrl, category, dark = false }) {
  const formatted = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <article className={`ucard${dark ? ' ucard--dark' : ''}`}>
      <Link to={`/news/${id}`} className="ucard__img-link" tabIndex="-1" aria-hidden="true">
        <div className="ucard__img-wrap">
          <img src={imageUrl} alt={title} className="ucard__img" loading="lazy" />
          {category && <span className="ucard__badge">{category}</span>}
        </div>
      </Link>
      <div className="ucard__body">
        <time className="ucard__date" dateTime={date}>{formatted}</time>
        <h3 className="ucard__title">
          <Link to={`/news/${id}`} className="ucard__title-link">{title}</Link>
        </h3>
        <p className="ucard__excerpt">{excerpt}</p>
        <Link to={`/news/${id}`} className="ucard__more" aria-label={`Read more: ${title}`}>
          Read more →
        </Link>
      </div>
    </article>
  )
}
