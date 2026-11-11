import React, { useState } from 'react'
import UpdateCard from '../components/UpdateCard'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import './News.css'

export default function News() {
  const { updates, categories } = useData()
  const { t, lang } = useLang()
  const all = lang === 'fr' ? 'Tous' : 'All'
  const [filter, setFilter] = useState(all)

  // Reset filter label when language changes
  const currentFilter = filter === 'Tous' || filter === 'All' ? all : filter

  const sorted    = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date))
  const displayed = currentFilter === all
    ? sorted
    : sorted.filter(u => u.category === currentFilter)

  return (
    <div className="news-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('news.hero.label')}</span>
          <h1 className="page-hero__title">{t('news.hero.title')}</h1>
          <p className="page-hero__sub">{t('news.hero.sub')}</p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          <div className="news__filters" role="group"
            aria-label={lang === 'fr' ? 'Filtrer par catégorie' : 'Filter by category'}>
            {[{ slug: all, name: all }, ...categories].map(({ slug, name }) => (
              <button
                key={slug}
                className={`news__filter-btn${currentFilter === slug ? ' news__filter-btn--active' : ''}`}
                onClick={() => setFilter(slug)}
                aria-pressed={currentFilter === slug}
              >
                {name}
              </button>
            ))}
          </div>

          {updates.length === 0 ? (
            <p className="news__loading">{t('news.loading')}</p>
          ) : (
            <div className="grid-3" aria-live="polite">
              {displayed.map(u => <UpdateCard key={u.id} {...u} />)}
            </div>
          )}

          {updates.length > 0 && displayed.length === 0 && (
            <p className="news__empty">{t('news.empty')}</p>
          )}
        </div>
      </section>

    </div>
  )
}
