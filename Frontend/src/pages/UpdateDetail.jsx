import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import api from '../services/api'
import { useData } from '../store/DataContext'
import './UpdateDetail.css'

export default function UpdateDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { updates } = useData()

  const [update,  setUpdate]  = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (updates.length === 0) return // still loading from API
    const found = updates.find((u) => u.id === id)
    if (!found) {
      // Not in context yet — direct fetch for direct URL access
      api.get(`/api/updates/${id}`)
          .then((res) => {
            setUpdate(res.data)
            setRelated(
              updates.filter((u) => u.id !== id).slice(0, 3)
            )
            setLoading(false)
          })
          .catch(() => {
            navigate('/news', { replace: true })
          })
      return
    }
    setUpdate(found)
    setRelated(
      [...updates]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter((u) => u.id !== id)
        .slice(0, 3)
    )
    setLoading(false)
  }, [id, updates, navigate])

  if (loading) {
    return (
      <div className="ud__loading container" aria-live="polite">
        <div className="ud__spinner" aria-hidden="true" />
        Chargement de l'article…
      </div>
    )
  }
  if (error) {
    return (
      <div className="ud__loading container">
        <p>{error}</p>
        <Button to="/news" variant="outline" className="mt-2">← Retour aux actualités</Button>
      </div>
    )
  }
  if (!update) return null

  const formatted = new Date(update.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="ud">
      <div className="ud__hero">
        <img src={update.imageUrl} alt={update.title} className="ud__hero-img" />
        <div className="ud__hero-overlay" aria-hidden="true" />
        <div className="ud__hero-content container">
          {update.category && <span className="ud__category">{update.category}</span>}
          <h1 className="ud__title">{update.title}</h1>
          <time className="ud__date" dateTime={update.date}>{formatted}</time>
        </div>
      </div>

      <div className="container ud__body-wrap">
        <div className="ud__body">
          <nav aria-label="Fil d'Ariane" className="ud__breadcrumb">
            <Link to="/news">← Retour aux actualités</Link>
          </nav>
          <div className="ud__text">
            {update.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="ud__actions">
            <Button to="/news" variant="outline">← Toutes les actualités</Button>
            <Button to="/contact">Nous contacter</Button>
          </div>
        </div>

        {related.length > 0 && (
          <aside className="ud__related" aria-label="Related updates">
            <h2 className="ud__related-heading">Plus d'actualités</h2>
            <div className="ud__related-list">
              {related.map((r) => {
                const relDate = new Date(r.date).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
                return (
                  <Link key={r.id} to={`/news/${r.id}`} className="ud__related-card">
                    <img src={r.imageUrl} alt={r.title} className="ud__related-img" loading="lazy" />
                    <div className="ud__related-info">
                      <time className="ud__related-date">{relDate}</time>
                      <p className="ud__related-title">{r.title}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
