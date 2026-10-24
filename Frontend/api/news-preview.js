function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export default async function handler(req, res) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  const apiBase = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL
  if (!id || !apiBase) {
    res.status(503).send('Article preview is not configured.')
    return
  }

  try {
    const response = await fetch(`${apiBase.replace(/\/+$/, '')}/api/updates/${encodeURIComponent(id)}`)
    if (!response.ok) {
      res.status(response.status === 404 ? 404 : 502).send('Article not found.')
      return
    }
    const article = await response.json()
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const origin = `https://${host}`
    const url = `${origin}/news/${encodeURIComponent(id)}`
    const title = escapeHtml(article.title)
    const description = escapeHtml(article.excerpt)
    const image = escapeHtml(article.imageUrl || '')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    res.status(200).send(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | IPJBU – DUHINDURINGENDO</title><meta name="description" content="${description}"><meta property="og:type" content="article"><meta property="og:site_name" content="IPJBU – DUHINDURINGENDO"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:image" content="${image}"><meta property="og:url" content="${escapeHtml(url)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}"></head><body><h1>${title}</h1><p>${description}</p><a href="${escapeHtml(url)}">Lire l'article sur le site IPJBU</a></body></html>`)
  } catch (error) {
    console.error('Article preview failed:', error)
    res.status(502).send('Unable to load article preview.')
  }
}
