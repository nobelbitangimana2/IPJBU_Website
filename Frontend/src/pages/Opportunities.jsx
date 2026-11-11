import React, { useState } from 'react'
import Button from '../components/Button'
import { useLang } from '../store/LangContext'
import './Opportunities.css'

const DOCUMENTS_FR = [
  { id: 'd1', title: "Statuts de l'association IPJBU", category: 'Juridique', description: "Document officiel des statuts de l'association approuves par l'Ordonnance Ministerielle n 530/1158 du 12/05/2025.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd2', title: "Formulaire d'adhesion",          category: 'Adhesion',  description: "Formulaire a remplir pour rejoindre l'IPJBU en tant que membre adherent, fondateur ou sympathisant.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd3', title: "Rapport d'activites annuel",     category: 'Rapport',   description: "Rapport annuel presentant les activites realisees, les beneficiaires atteints et les resultats obtenus.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd4', title: "Programme de formation agro-pastorale", category: 'Formation', description: "Presentation detaillee du programme de formation aux techniques agro-pastorales.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd5', title: "Guide de candidature partenariat", category: 'Partenariat', description: "Procedure et formulaire pour les organisations souhaitant etablir un partenariat avec l'IPJBU.", fileType: 'PDF', available: false, fileUrl: null },
]

const DOCUMENTS_EN = [
  { id: 'd1', title: "IPJBU Association statutes",   category: 'Legal',       description: "Official statutes approved by Ministerial Ordinance no. 530/1158 of 12/05/2025.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd2', title: "Membership application form",  category: 'Membership',  description: "Form to complete to join IPJBU as a member, founder or supporter.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd3', title: "Annual activity report",       category: 'Report',      description: "Annual report presenting activities carried out, beneficiaries reached and results achieved.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd4', title: "Agro-pastoral training programme", category: 'Training', description: "Detailed presentation of the agro-pastoral techniques training programme.", fileType: 'PDF', available: false, fileUrl: null },
  { id: 'd5', title: "Partnership application guide", category: 'Partnership', description: "Procedure and form for organisations wishing to establish a partnership with IPJBU.", fileType: 'PDF', available: false, fileUrl: null },
]

const JOBS_FR = [
  { id: 'j1', title: 'Formateur·trice en techniques agro-pastorales', type: 'Benevolat', location: 'Gitega, Burundi', deadline: null, description: "L'IPJBU recherche des formateurs benevoles disposant d'une experience en agriculture, elevage ou agro-ecologie.", requirements: ['Formation en agronomie, elevage ou domaine connexe', 'Experience de terrain en milieu rural burundais', 'Capacite a animer et former des groupes', 'Disponibilite reguliere'], contactEmail: null, active: true },
  { id: 'j2', title: 'Charge·e de communication et reseaux sociaux',  type: 'Benevolat', location: 'Teletravail / Gitega', deadline: null, description: "Appui a la communication externe de l'IPJBU : redaction de contenus, gestion des reseaux sociaux, mise a jour du site web.", requirements: ['Maitrise du francais (ecrit)', 'Experience en communication digitale', 'Connaissance des outils de creation graphique', 'Motivation pour la cause de la jeunesse burundaise'], contactEmail: null, active: true },
]

const JOBS_EN = [
  { id: 'j1', title: 'Agro-pastoral training facilitator', type: 'Volunteer', location: 'Gitega, Burundi', deadline: null, description: "IPJBU is looking for volunteer trainers with experience in agriculture, livestock or agro-ecology.", requirements: ['Degree in agronomy, livestock or related field', 'Field experience in rural Burundi', 'Ability to facilitate and train groups', 'Regular availability'], contactEmail: null, active: true },
  { id: 'j2', title: 'Communication & social media officer',   type: 'Volunteer', location: 'Remote / Gitega', deadline: null, description: "Support IPJBU's external communication: content writing, social media management, website updates.", requirements: ['Good written French (English a plus)', 'Digital communication experience', 'Knowledge of graphic design tools', 'Commitment to Burundian youth causes'], contactEmail: null, active: true },
]

const TYPE_COLORS = {
  'Benevolat': { bg: '#fff5ee', color: '#7a3d00' },
  'Volunteer': { bg: '#fff5ee', color: '#7a3d00' },
  'Emploi':    { bg: '#e8f0fe', color: '#1a3a8f' },
  'Job':       { bg: '#e8f0fe', color: '#1a3a8f' },
}

export default function Opportunities() {
  const { t, lang }     = useLang()
  const [docFilter, setDocFilter] = useState('all')
  const [expanded,  setExpanded]  = useState(null)

  const documents  = lang === 'fr' ? DOCUMENTS_FR : DOCUMENTS_EN
  const jobs       = lang === 'fr' ? JOBS_FR       : JOBS_EN
  const activeJobs = jobs.filter(j => j.active)

  const allLabel   = lang === 'fr' ? 'Tous' : 'All'
  const docCats    = [allLabel, ...new Set(documents.map(d => d.category))]

  const visibleDocs = docFilter === 'all' || docFilter === allLabel
    ? documents
    : documents.filter(d => d.category === docFilter)

  return (
    <div className="opp-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <h1 className="page-hero__title">{t('opp.hero.title')}</h1>
          <p className="page-hero__sub">{t('opp.hero.sub')}</p>
        </div>
      </div>

      {/* Documents */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">{t('opp.docs.label')}</span>
            <h2 className="section__title">{t('opp.docs.title')}</h2>
          </div>

          <div className="opp__filters" role="group">
            {docCats.map(cat => (
              <button key={cat}
                className={`opp__filter-btn${(docFilter === 'all' && cat === allLabel) || docFilter === cat ? ' opp__filter-btn--active' : ''}`}
                onClick={() => setDocFilter(cat === allLabel ? 'all' : cat)}
                aria-pressed={(docFilter === 'all' && cat === allLabel) || docFilter === cat}>
                {cat}
              </button>
            ))}
          </div>

          <div className="opp__doc-grid">
            {visibleDocs.map(doc => (
              <div key={doc.id} className="opp-doc-card">
                <div className="opp-doc-card__header">
                  <span className="opp-doc-card__cat">{doc.category}</span>
                  <span className="opp-doc-card__type">{doc.fileType}</span>
                </div>
                <h3 className="opp-doc-card__title">{doc.title}</h3>
                <p className="opp-doc-card__desc">{doc.description}</p>
                <div className="opp-doc-card__footer">
                  {doc.available && doc.fileUrl ? (
                    <a href={doc.fileUrl} download className="opp-doc-card__btn opp-doc-card__btn--download">
                      ⬇ {t('opp.download')}
                    </a>
                  ) : (
                    <span className="opp-doc-card__soon">📋 {t('opp.soon')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="opp__upload-note">
            <span aria-hidden="true">📤</span>
            <p>
              {lang === 'fr'
                ? "Vous souhaitez soumettre un document a l'IPJBU ? Envoyez-le via notre "
                : "Want to submit a document to IPJBU? Send it via our "}
              <a href="/contact" className="opp__upload-link">
                {lang === 'fr' ? 'formulaire de contact' : 'contact form'}
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">{t('opp.jobs.label')}</span>
            <h2 className="section__title">{t('opp.jobs.title')}</h2>
          </div>

          {activeJobs.length === 0 ? (
            <div className="opp__no-jobs">
              <span className="opp__no-jobs-icon" aria-hidden="true">📭</span>
              <h3>{lang === 'fr' ? 'Aucune offre active pour le moment' : 'No active openings at this time'}</h3>
              <p>{lang === 'fr' ? 'Revenez bientot ou envoyez une candidature spontanee.' : 'Check back soon or send a spontaneous application.'}</p>
              <Button to="/contact" variant="outline">
                {lang === 'fr' ? 'Candidature spontanee' : 'Spontaneous application'}
              </Button>
            </div>
          ) : (
            <div className="opp__job-list">
              {activeJobs.map(job => {
                const isOpen = expanded === job.id
                const badge  = TYPE_COLORS[job.type] ?? { bg: '#f5f5f5', color: '#333' }
                return (
                  <div key={job.id} className={`opp-job-card${isOpen ? ' opp-job-card--open' : ''}`}>
                    <button className="opp-job-card__head"
                      onClick={() => setExpanded(isOpen ? null : job.id)}
                      aria-expanded={isOpen} aria-controls={`job-body-${job.id}`}>
                      <div className="opp-job-card__meta">
                        <span className="opp-job-card__type" style={{ background: badge.bg, color: badge.color }}>
                          {job.type}
                        </span>
                        <h3 className="opp-job-card__title">{job.title}</h3>
                        <p className="opp-job-card__location">📍 {job.location}</p>
                      </div>
                      <span className="opp-job-card__chevron" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
                    </button>

                    <div id={`job-body-${job.id}`} className="opp-job-card__body" hidden={!isOpen}>
                      <p className="opp-job-card__desc">{job.description}</p>
                      {job.requirements.length > 0 && (
                        <>
                          <h4 className="opp-job-card__req-title">
                            {lang === 'fr' ? 'Profil recherche' : 'Profile required'}
                          </h4>
                          <ul className="opp-job-card__req-list">
                            {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </>
                      )}
                      <div className="opp-job-card__actions">
                        <Button to="/contact" size="sm">{t('opp.apply')}</Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section section--green">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            {lang === 'fr' ? 'Une question sur nos opportunites ?' : 'A question about our opportunities?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.75rem', fontSize: '1.05rem' }}>
            {lang === 'fr'
              ? "Contactez l'IPJBU pour toute demande de partenariat, candidature ou information."
              : "Contact IPJBU for any partnership enquiry, application or information request."}
          </p>
          <Button to="/contact" size="lg">{t('contactus')}</Button>
        </div>
      </section>

    </div>
  )
}
