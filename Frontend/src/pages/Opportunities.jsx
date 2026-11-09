import React, { useState } from 'react'
import Button from '../components/Button'
import './Opportunities.css'

/* ─────────────────────────────────────────────────────────────
   OPPORTUNITÉS — IPJBU – DUHINDURINGENDO
   Two sections:
     1. Documents officiels (PDFs, forms, reports to download)
     2. Offres d'emploi / bénévolat
   Both sections are currently static placeholders.
   An admin can upload real documents & job posts via the
   admin panel (section à connecter à l'API ultérieurement).
───────────────────────────────────────────────────────────── */

/* ── Static sample documents ─────────────────────────────── */
const DOCUMENTS = [
  {
    id: 'd1',
    title: 'Statuts de l\'association IPJBU – DUHINDURINGENDO',
    category: 'Juridique',
    description: 'Document officiel des statuts de l\'association tels qu\'approuvés par l\'Ordonnance Ministérielle n° 530/1158 du 12/05/2025.',
    fileType: 'PDF',
    available: false,   // set true + add fileUrl when document is ready
    fileUrl: null,
  },
  {
    id: 'd2',
    title: 'Formulaire d\'adhésion',
    category: 'Adhésion',
    description: 'Formulaire à remplir pour rejoindre l\'IPJBU – DUHINDURINGENDO en tant que membre adhérent, fondateur ou sympathisant.',
    fileType: 'PDF',
    available: false,
    fileUrl: null,
  },
  {
    id: 'd3',
    title: 'Rapport d\'activités annuel',
    category: 'Rapport',
    description: 'Rapport annuel présentant les activités réalisées, les bénéficiaires atteints et les résultats obtenus par l\'IPJBU – DUHINDURINGENDO.',
    fileType: 'PDF',
    available: false,
    fileUrl: null,
  },
  {
    id: 'd4',
    title: 'Programme de formation agro-pastorale',
    category: 'Formation',
    description: 'Présentation détaillée du programme de formation aux techniques agro-pastorales destiné aux jeunes et femmes vulnérables.',
    fileType: 'PDF',
    available: false,
    fileUrl: null,
  },
  {
    id: 'd5',
    title: 'Guide de candidature partenariat',
    category: 'Partenariat',
    description: 'Procédure et formulaire pour les organisations souhaitant établir un partenariat avec l\'IPJBU – DUHINDURINGENDO.',
    fileType: 'PDF',
    available: false,
    fileUrl: null,
  },
]

/* ── Category filter pills ── */
const DOC_CATS = ['Tous', ...new Set(DOCUMENTS.map(d => d.category))]

/* ── Static job / volunteer listings ─────────────────────── */
const JOBS = [
  {
    id: 'j1',
    title: 'Formateur·trice en techniques agro-pastorales',
    type: 'Bénévolat',
    location: 'Gitega, Burundi',
    deadline: null,
    description: 'L\'IPJBU – DUHINDURINGENDO recherche des formateurs bénévoles disposant d\'une expérience en agriculture, élevage ou agro-écologie pour animer des sessions de formation auprès des bénéficiaires.',
    requirements: [
      'Formation en agronomie, élevage ou domaine connexe',
      'Expérience de terrain en milieu rural burundais',
      'Capacité à animer et former des groupes',
      'Disponibilité régulière',
    ],
    contactEmail: null,
    active: true,
  },
  {
    id: 'j2',
    title: 'Chargé·e de communication et réseaux sociaux',
    type: 'Bénévolat',
    location: 'Télétravail / Gitega',
    deadline: null,
    description: 'Appui à la communication externe de l\'IPJBU – DUHINDURINGENDO : rédaction de contenus, gestion des réseaux sociaux, mise à jour du site web.',
    requirements: [
      'Maîtrise du français (écrit)',
      'Expérience en communication digitale',
      'Connaissance des outils de création graphique (Canva, etc.)',
      'Motivation pour la cause de la jeunesse burundaise',
    ],
    contactEmail: null,
    active: true,
  },
  {
    id: 'j3',
    title: 'Coordinateur·trice de projet',
    type: 'Emploi',
    location: 'Gitega, Burundi',
    deadline: null,
    description: 'Sous la supervision du Comité Exécutif, le·la coordinateur·trice de projet sera responsable de la planification, du suivi et de l\'évaluation des activités de terrain de l\'IPJBU – DUHINDURINGENDO.',
    requirements: [
      'Diplôme en gestion de projet, développement rural ou équivalent',
      'Expérience en gestion de projets de développement',
      'Maîtrise du français ; le kirundi est un atout',
      'Connaissance du secteur agro-pastoral burundais',
    ],
    contactEmail: null,
    active: false,   // pas encore actif
  },
]

/* ── type badge colors ── */
const TYPE_COLORS = {
  'Bénévolat': { bg: 'var(--green-light)', color: 'var(--green-dark)' },
  'Emploi':    { bg: '#fff3dc',            color: '#7a3d00'            },
  'Stage':     { bg: '#e8f0fe',            color: '#1a3a8f'            },
}

export default function Opportunities() {
  const [docFilter, setDocFilter] = useState('Tous')
  const [expanded,  setExpanded]  = useState(null)

  const visibleDocs = docFilter === 'Tous'
    ? DOCUMENTS
    : DOCUMENTS.filter(d => d.category === docFilter)

  const activeJobs = JOBS.filter(j => j.active)

  return (
    <div className="opp-page">

      {/* ── Page hero ── */}
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <h1 className="page-hero__title">Opportunités</h1>
          <p className="page-hero__sub">
            Téléchargez nos documents officiels et découvrez les postes ouverts
            pour rejoindre l&apos;équipe de l&apos;IPJBU – DUHINDURINGENDO.
          </p>
        </div>
      </div>

      {/* ══ SECTION 1 — Documents ══════════════════════════════ */}
      <section className="section section--white" aria-label="Documents officiels">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Ressources</span>
            <h2 className="section__title">Documents officiels</h2>
            <p className="section__subtitle">
              Formulaires, rapports et documents institutionnels de
              l&apos;IPJBU – DUHINDURINGENDO disponibles en téléchargement.
            </p>
          </div>

          {/* Category filter */}
          <div className="opp__filters" role="group" aria-label="Filtrer les documents">
            {DOC_CATS.map(cat => (
              <button
                key={cat}
                className={`opp__filter-btn${docFilter === cat ? ' opp__filter-btn--active' : ''}`}
                onClick={() => setDocFilter(cat)}
                aria-pressed={docFilter === cat}
              >
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
                    <a
                      href={doc.fileUrl}
                      download
                      className="opp-doc-card__btn opp-doc-card__btn--download"
                      aria-label={`Télécharger : ${doc.title}`}
                    >
                      ⬇ Télécharger
                    </a>
                  ) : (
                    <span className="opp-doc-card__soon">
                      📋 Bientôt disponible
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload note */}
          <div className="opp__upload-note">
            <span aria-hidden="true">📤</span>
            <p>
              Vous souhaitez soumettre un document à l&apos;IPJBU – DUHINDURINGENDO&nbsp;?
              Envoyez-le directement via notre{' '}
              <a href="/contact" className="opp__upload-link">formulaire de contact</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — Offres d'emploi / bénévolat ══════════ */}
      <section className="section section--cream" aria-label="Offres d'emploi et bénévolat">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Rejoindre l&apos;équipe</span>
            <h2 className="section__title">Offres d&apos;emploi &amp; bénévolat</h2>
            <p className="section__subtitle">
              Contribuez à la mission de l&apos;IPJBU – DUHINDURINGENDO en intégrant
              notre équipe de terrain ou de gestion.
            </p>
          </div>

          {activeJobs.length === 0 ? (
            <div className="opp__no-jobs">
              <span className="opp__no-jobs-icon" aria-hidden="true">📭</span>
              <h3>Aucune offre active pour le moment</h3>
              <p>
                Revenez bientôt ou contactez-nous pour nous envoyer une candidature spontanée.
              </p>
              <Button to="/contact" variant="outline">Candidature spontanée</Button>
            </div>
          ) : (
            <div className="opp__job-list">
              {activeJobs.map(job => {
                const isOpen = expanded === job.id
                const badge  = TYPE_COLORS[job.type] ?? TYPE_COLORS['Stage']
                return (
                  <div key={job.id} className={`opp-job-card${isOpen ? ' opp-job-card--open' : ''}`}>
                    <button
                      className="opp-job-card__head"
                      onClick={() => setExpanded(isOpen ? null : job.id)}
                      aria-expanded={isOpen}
                      aria-controls={`job-body-${job.id}`}
                    >
                      <div className="opp-job-card__meta">
                        <span
                          className="opp-job-card__type"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {job.type}
                        </span>
                        <h3 className="opp-job-card__title">{job.title}</h3>
                        <p className="opp-job-card__location">
                          📍 {job.location}
                          {job.deadline && (
                            <span className="opp-job-card__deadline">
                              &nbsp;· Date limite : {job.deadline}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="opp-job-card__chevron" aria-hidden="true">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </button>

                    <div
                      id={`job-body-${job.id}`}
                      className="opp-job-card__body"
                      hidden={!isOpen}
                    >
                      <p className="opp-job-card__desc">{job.description}</p>

                      {job.requirements.length > 0 && (
                        <>
                          <h4 className="opp-job-card__req-title">Profil recherché</h4>
                          <ul className="opp-job-card__req-list">
                            {job.requirements.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      <div className="opp-job-card__actions">
                        {job.contactEmail ? (
                          <a
                            href={`mailto:${job.contactEmail}?subject=Candidature : ${encodeURIComponent(job.title)}`}
                            className="opp-job-card__apply"
                          >
                            ✉ Postuler par e-mail
                          </a>
                        ) : (
                          <Button to="/contact" size="sm">Postuler via le formulaire</Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="section section--green" aria-label="Appel à l'action">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            Une question sur nos opportunités&nbsp;?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.75rem', fontSize: '1.05rem' }}>
            Contactez l&apos;IPJBU – DUHINDURINGENDO pour toute demande de
            partenariat, candidature ou information sur nos activités.
          </p>
          <Button to="/contact" size="lg">Nous contacter</Button>
        </div>
      </section>

    </div>
  )
}
