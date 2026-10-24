import React, { useState } from 'react'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import './News.css'

export default function News() {
  const { updates, categories } = useData()
  const [filter, setFilter] = useState('Tous')

  const sorted    = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date))
  const displayed = filter === 'Tous' ? sorted : sorted.filter(u => u.category === filter)

  return (
    <div className="news-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Actualités</span>
          <h1 className="page-hero__title">Dernières nouvelles</h1>
          <p className="page-hero__sub">
            Suivez les activités, les succès et les annonces de l'IPJBU – DUHINDURINGENDO.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          <div className="news__filters" role="group" aria-label="Filtrer par catégorie">
            {[{ slug: 'Tous', name: 'Tous' }, ...categories].map(({ slug, name }) => (
              <button
                key={slug}
                className={`news__filter-btn${filter === slug ? ' news__filter-btn--active' : ''}`}
                onClick={() => setFilter(slug)}
                aria-pressed={filter === slug}
              >
                {name}
              </button>
            ))}
          </div>

          {updates.length === 0 ? (
            <p className="news__loading">Chargement des actualités…</p>
          ) : (
            <div className="grid-3" aria-live="polite">
              {displayed.map(u => <UpdateCard key={u.id} {...u} />)}
            </div>
          )}

          {updates.length > 0 && displayed.length === 0 && (
            <p className="news__empty">Aucune actualité dans cette catégorie.</p>
          )}
        </div>
      </section>

    </div>
  )
}
