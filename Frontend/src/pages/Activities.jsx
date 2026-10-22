import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import { getActivities, getActivityCategories } from '../data/activities'
import './Activities.css'

const STATUS_LABEL = { active: 'Active', upcoming: 'Upcoming', completed: 'Completed' }

export default function Activities() {
  const [activities,   setActivities]   = useState([])
  const [categories,   setCategories]   = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    getActivities().then(setActivities)
    getActivityCategories().then(cats => setCategories(['All', ...cats]))
  }, [])

  const filtered = activeFilter === 'All'
    ? activities
    : activities.filter(a => a.category === activeFilter)

  return (
    <div className="activities-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">What we do</span>
          <h1 className="page-hero__title">Activities &amp; Projects</h1>
          <p className="page-hero__sub">
            From crop production and irrigation to training and market access — explore
            the programmes driving change on the ground.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          {/* Filters */}
          <div className="act__filters" role="group" aria-label="Filter by category">
            {categories.map(cat => (
              <button
                key={cat}
                className={`act__filter-btn${activeFilter === cat ? ' act__filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(cat)}
                aria-pressed={activeFilter === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="act__grid">
            {filtered.map(a => (
              <article key={a.id} className="act-card">
                <div className="act-card__img-wrap">
                  <img src={a.imageUrl} alt={a.title} className="act-card__img" loading="lazy" />
                  <span className={`act-card__status act-card__status--${a.status}`}>
                    {STATUS_LABEL[a.status] || a.status}
                  </span>
                </div>
                <div className="act-card__body">
                  <span className="act-card__cat">{a.category}</span>
                  <h3 className="act-card__title">{a.title}</h3>
                  <p className="act-card__desc">{a.description}</p>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="act__empty">No activities in this category.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--cream">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom:'0.75rem' }}>
            Interested in supporting our work?
          </h2>
          <p style={{ color:'var(--text-light)', marginBottom:'1.5rem', fontSize:'1rem' }}>
            Get in touch to learn how you can support our programmes.
          </p>
          <Button to="/contact" size="lg">Nous contacter</Button>
        </div>
      </section>

    </div>
  )
}
