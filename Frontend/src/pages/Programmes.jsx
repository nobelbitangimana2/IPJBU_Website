import React from 'react'
import Button from '../components/Button'
import { useLang } from '../store/LangContext'
import './Activities.css'

const OBJECTIVES_FR = [
  { id: 1, icon: '📚', title: 'Formation en techniques agro-pastorales', desc: 'Former les jeunes et les femmes vulnerables aux techniques agro-pastorales modernes pour ameliorer la productivite et assurer des moyens de subsistance durables.' },
  { id: 2, icon: '🌐', title: 'Echanges d\'experiences nationaux et internationaux', desc: 'Organiser des echanges d\'experiences aux niveaux national et international pour partager les bonnes pratiques agro-pastorales et renforcer les liens entre acteurs du secteur.' },
  { id: 3, icon: '🛠️', title: 'Renforcement des capacites et equipement', desc: 'Renforcer les competences en gestion des stocks et equiper les beneficiaires en materiel agro-pastoral adapte a leurs besoins et a leur contexte local.' },
  { id: 4, icon: '🏭', title: 'Micro-unites de transformation agroalimentaire', desc: 'Mettre en place des micro-unites de transformation agroalimentaire pour valoriser les productions locales, reduire les pertes post-recolte et creer de la valeur ajoutee.' },
  { id: 5, icon: '💡', title: 'Promotion des nouvelles technologies agro-pastorales', desc: "Promouvoir l'utilisation des nouvelles technologies agro-pastorales a travers le pays pour moderniser les pratiques et ameliorer les rendements." },
]

const OBJECTIVES_EN = [
  { id: 1, icon: '📚', title: 'Training in agro-pastoral techniques', desc: 'Train youth and vulnerable women in modern agro-pastoral techniques to improve productivity and ensure sustainable livelihoods.' },
  { id: 2, icon: '🌐', title: 'National and international experience exchanges', desc: 'Organise experience exchanges at national and international levels to share good agro-pastoral practices and strengthen links between sector actors.' },
  { id: 3, icon: '🛠️', title: 'Capacity building and equipment', desc: 'Strengthen stock management skills and equip beneficiaries with agro-pastoral materials adapted to their needs and local context.' },
  { id: 4, icon: '🏭', title: 'Agri-food processing micro-units', desc: 'Set up agri-food processing micro-units to add value to local production, reduce post-harvest losses and create economic opportunities.' },
  { id: 5, icon: '💡', title: 'Promotion of new agro-pastoral technologies', desc: 'Promote the use of new agro-pastoral technologies throughout the country to modernise practices and improve yields.' },
]

const STEPS_FR = [
  'Ciblage et identification des beneficiaires',
  'Formation des formateurs',
  'Renforcement des capacites en techniques agro-pastorales',
  'Implantation de points agro-pastoraux didactiques',
  'Distribution de semences selectionnees et de betail/volailles de qualite',
  'Encadrement de la population cible',
  'Initiation a la construction de stocks et a la conservation des recoltes',
  "Initiation a l'effet boule de neige pour etendre la couverture a tout le pays",
  "Identification des marches d'ecoulement",
  "Identification des sources d'approvisionnement en semences et betail de qualite",
]

const STEPS_EN = [
  'Targeting and identification of beneficiaries',
  'Training of trainers',
  'Capacity building in agro-pastoral techniques',
  'Setting up didactic agro-pastoral demonstration sites',
  'Distribution of selected seeds and quality livestock/poultry',
  'Supervision and support of the target population',
  'Introduction to stock building and harvest conservation',
  'Introduction to the snowball effect to extend coverage across the country',
  'Identification of sales markets',
  'Identification of sources of quality seeds and livestock',
]

export default function Programmes() {
  const { t, lang } = useLang()
  const objectives = lang === 'fr' ? OBJECTIVES_FR : OBJECTIVES_EN
  const steps      = lang === 'fr' ? STEPS_FR      : STEPS_EN

  return (
    <div className="activities-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <h1 className="page-hero__title">{t('prog.hero.title')}</h1>
          <p className="page-hero__sub">{t('prog.hero.sub')}</p>
        </div>
      </div>

      {/* Objectives */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">{t('prog.obj.label')}</span>
            <h2 className="section__title">{t('prog.obj.title')}</h2>
          </div>
          <div className="act__grid">
            {objectives.map(({ id, icon, title, desc }) => (
              <article key={id} className="act-card prog-obj-card">
                <div className="prog-obj-card__icon-wrap">
                  <span className="prog-obj-card__icon" aria-hidden="true">{icon}</span>
                  <span className="prog-obj-card__num">{id}</span>
                </div>
                <div className="act-card__body">
                  <h3 className="act-card__title">{title}</h3>
                  <p className="act-card__desc">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">{t('prog.how.label')}</span>
            <h2 className="section__title">{t('prog.how.title')}</h2>
            <p className="section__subtitle">{t('prog.how.sub')}</p>
          </div>
          <ol className="prog-steps">
            {steps.map((step, i) => (
              <li key={i} className="prog-step">
                <span className="prog-step__num" aria-hidden="true">{i + 1}</span>
                <span className="prog-step__text">{step}</span>
              </li>
            ))}
          </ol>
          <p className="prog-steps__note">
            {lang === 'fr'
              ? "L'IPJBU sert egalement de point de contact entre l'administration territoriale et les services du Ministere de l'Agriculture et de l'Elevage du Burundi."
              : 'IPJBU also acts as a point of contact between the territorial administration and the services of the Ministry of Agriculture and Livestock of Burundi.'}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--green">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            {t('prog.cta.title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            {t('prog.cta.sub')}
          </p>
          <Button to="/contact" size="lg">{t('prog.cta.btn')}</Button>
        </div>
      </section>

    </div>
  )
}
