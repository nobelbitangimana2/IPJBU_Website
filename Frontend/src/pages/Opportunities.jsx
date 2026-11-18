import React from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../store/DataContext'
import Reveal from '../components/Reveal'
import './Opportunities.css'

function isDeprecatedType(type) {
  return typeof type === 'string' && /^offre d['’]emploi$/i.test(type.trim())
}

function pdfDownloadUrl(url) {
  if (!url || !url.includes('imagekit.io')) return url
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('ik-attachment', 'true')
    return parsed.toString()
  } catch {
    return url
  }
}

export default function Opportunities() {
  const { t, i18n } = useTranslation()
  const { opportunities } = useData()
  const visibleOpportunities = opportunities.filter((item) => !isDeprecatedType(item.type))
  const firstPdf = visibleOpportunities.find((item) => item.pdfUrl)
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-GB'

  function formatDeadline(value) {
    return new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="opp-page">
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <div className="opp__hero-row">
            <div>
              <h1 className="page-hero__title">{t('opp.hero.title')}</h1>
              <p className="page-hero__sub">{t('opp.hero.sub')}</p>
            </div>
            {firstPdf && (
              <a
                href={pdfDownloadUrl(firstPdf.pdfUrl)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="opp__download-button opp__download-button--hero"
              >
                <span aria-hidden="true">↓</span>
                {t('opp.pdf.download')}
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          {!visibleOpportunities.length ? (
            <div className="opp__empty">
              <span className="opp__empty-icon" aria-hidden="true">✦</span>
              <h2>{t('opp.empty.title')}</h2>
              <p>{t('opp.empty.description')}</p>
            </div>
          ) : (
            <div className="opp__grid">
              {visibleOpportunities.map((opportunity, index) => (
                <Reveal key={opportunity.id || `${opportunity.title}-${index}`} as="article" className="opp__card" delay={index * 55}>
                  <div className="opp__card-top">
                    {opportunity.type && <span className="opp__type">{opportunity.type}</span>}
                    {opportunity.deadline && (
                      <time className="opp__deadline" dateTime={new Date(opportunity.deadline).toISOString()}>
                        {t('opp.deadline')}: {formatDeadline(opportunity.deadline)}
                      </time>
                    )}
                  </div>
                  <h2 className="opp__title">{opportunity.title}</h2>
                  {opportunity.location && <p className="opp__location">{t('opp.location')}: {opportunity.location}</p>}
                  {opportunity.description && <p className="opp__description">{opportunity.description}</p>}
                  {(opportunity.applyUrl || opportunity.pdfUrl) && (
                    <div className="opp__actions">
                      {opportunity.applyUrl && (
                        <a className="opp__action opp__action--apply" href={opportunity.applyUrl} target="_blank" rel="noopener noreferrer">
                          {t('opp.apply')}
                        </a>
                      )}
                      {opportunity.pdfUrl && (
                        <a className="opp__action opp__action--pdf" href={pdfDownloadUrl(opportunity.pdfUrl)} download target="_blank" rel="noopener noreferrer">
                          {t('opp.pdf.download')}
                        </a>
                      )}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
