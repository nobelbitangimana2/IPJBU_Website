import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import api from '../services/api'
import { useData } from '../store/DataContext'
import './UpdateDetail.css'

export default function UpdateDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { updates, contact } = useData()

  const [update,  setUpdate]  = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const shareUrl = `${window.location.origin}/news/${id}`

  useEffect(() => {
    if (!update) return undefined

    // Social crawlers do not run this JavaScript; Vercel's crawler rewrite serves OG HTML.
    const originalTitle = document.title
    const previous = []
    const setMeta = (key, value, attribute = 'property') => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
      const created = !element
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      previous.push({ element, created, content: element.getAttribute('content') })
      element.setAttribute('content', value)
    }

    document.title = `${update.title} | IPJBU – DUHINDURINGENDO`
    setMeta('description', update.excerpt, 'name')
    setMeta('og:type', 'article')
    setMeta('og:title', update.title)
    setMeta('og:description', update.excerpt)
    setMeta('og:image', update.imageUrl || '')
    setMeta('og:url', shareUrl)
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', update.title, 'name')
    setMeta('twitter:description', update.excerpt, 'name')
    setMeta('twitter:image', update.imageUrl || '', 'name')

    return () => {
      document.title = originalTitle
      previous.forEach(({ element, created, content }) => {
        if (created) element.remove()
        else if (content === null) element.removeAttribute('content')
        else element.setAttribute('content', content)
      })
    }
  }, [update, shareUrl])

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const input = document.createElement('textarea')
        input.value = shareUrl
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        const copied = document.execCommand('copy')
        input.remove()
        if (!copied) throw new Error('Copie non disponible dans ce navigateur.')
      }
      setShareMessage('Lien copié')
      setTimeout(() => setShareMessage(''), 2500)
    } catch (err) {
      setShareMessage(err.message || 'Impossible de copier le lien.')
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: update.title, text: update.excerpt, url: shareUrl })
    } catch (err) {
      if (err.name !== 'AbortError') setShareMessage('Le partage a échoué.')
    }
  }

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
            {update.blocks?.length
              ? update.blocks.map((block, index) => {
                if (block.type === 'heading') return <h2 className="ud__content-heading" key={index}>{block.text}</h2>
                if (block.type === 'image') {
                  return (
                    <figure className="ud__figure" key={index}>
                      <img src={block.imageUrl} alt={block.alt || ''} loading="lazy" />
                      {block.caption && <figcaption>{block.caption}</figcaption>}
                    </figure>
                  )
                }
                return <p key={index}>{block.text}</p>
              })
              : (update.body || '').split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <section className="ud__share" aria-label="Partager cet article">
            <h2 className="ud__share-title">Partager</h2>
            <div className="ud__share-links">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${update.title} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(update.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">X / Twitter</a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <button type="button" onClick={copyLink}>Copier le lien</button>
              {typeof navigator !== 'undefined' && navigator.share && (
                <button type="button" onClick={nativeShare}>Partager…</button>
              )}
            </div>
            {shareMessage && <p className="ud__share-message" role="status">{shareMessage}</p>}
            {contact?.socialLinks?.facebook && (
              <a className="ud__facebook-follow" href={contact.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                Suivez-nous sur Facebook
              </a>
            )}
          </section>
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
