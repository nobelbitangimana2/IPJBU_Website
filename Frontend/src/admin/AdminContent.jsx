import React, { useState, useEffect } from 'react'
import { useData } from '../store/DataContext'
import './AdminContent.css'

export default function AdminContent() {
  const { content, saveContent } = useData()

  const [mission, setMission] = useState(content.mission)
  const [vision,  setVision]  = useState(content.vision)
  const [partners, setPartners] = useState(content.partners || [])
  const [errors,  setErrors]  = useState({})
  const [toast,   setToast]   = useState(null)
  const [dirty,   setDirty]   = useState(false)

  // Keep local state in sync if context resets (e.g. future SSR hydration)
  useEffect(() => {
    setMission(content.mission)
    setVision(content.vision)
    setPartners(content.partners || [])
    setDirty(false)
  }, [content.mission, content.vision, content.partners])

  function handleChange(field, value) {
    if (field === 'mission') { setMission(value) }
    else                     { setVision(value)  }
    setDirty(true)
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!mission.trim()) e.mission = 'Le texte de la mission est requis.'
    if (!vision.trim())  e.vision  = 'Le texte de la vision est requis.'
    if (partners.some((partner) => !partner.trim())) e.partners = 'Les noms de partenaires ne peuvent pas être vides.'
    return e
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    saveContent({ mission, vision, partners: partners.map((partner) => partner.trim()) })
      .then(() => {
        setDirty(false)
        setToast({ type: 'success', msg: 'Mission et Vision enregistrées. Les modifications sont en ligne.' })
        setTimeout(() => setToast(null), 3500)
      })
      .catch((err) => {
        setToast({ type: 'error', msg: err.message || 'Save failed.' })
        setTimeout(() => setToast(null), 3500)
      })
  }

  function handleReset() {
    setMission(content.mission)
    setVision(content.vision)
    setPartners(content.partners || [])
    setErrors({})
    setDirty(false)
  }

  function updatePartner(index, value) {
    setPartners((current) => current.map((partner, i) => i === index ? value : partner))
    setDirty(true)
    if (errors.partners) setErrors((current) => ({ ...current, partners: '' }))
  }

  function addPartner() {
    setPartners((current) => [...current, ''])
    setDirty(true)
  }

  function removePartner(index) {
    setPartners((current) => current.filter((_, i) => i !== index))
    setDirty(true)
  }

  return (
    <div className="adm-content">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          ✓ {toast.msg}
        </div>
      )}

      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Contenu du site</h1>          <p className="adm-page__subtitle">
            Textes Mission et Vision affichés sur les pages Accueil et À propos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {dirty && (
            <button className="adm-btn adm-btn--ghost" onClick={handleReset}>
              Reset
            </button>
          )}
          <button
            className="adm-btn adm-btn--primary"
            onClick={handleSave}
          >
            Save changes
          </button>
        </div>
      </div>

      <div className="adm-content__grid">
        {/* Mission */}
        <div className="adm-card adm-form">
          <div className="adm-content__field-header">
            <span className="adm-content__icon" aria-hidden="true">🎯</span>
            <div>
              <h2 className="adm-content__field-title">Mission</h2>
              <p className="adm-content__field-hint">
                Décrit ce que fait l'IPJBU et qui elle sert.
                Affiché sur les pages Accueil et À propos.
              </p>
            </div>
          </div>
          <div className={`adm-field${errors.mission ? ' adm-field--err' : ''}`}>
            <label htmlFor="content-mission" className="adm-label">
              Texte de la mission <span className="adm-req">*</span>
            </label>
            <textarea
              id="content-mission"
              className={`adm-textarea${errors.mission ? ' adm-input--error' : ''}`}
              style={{ minHeight: 160 }}
              value={mission}
              onChange={(e) => handleChange('mission', e.target.value)}
              aria-required="true"
              aria-describedby={errors.mission ? 'mission-err' : undefined}
            />
            {errors.mission && (
              <p id="mission-err" className="adm-field-error">{errors.mission}</p>
            )}
            <p className="adm-content__char-count">{mission.length} characters</p>
          </div>
        </div>

        {/* Vision */}
        <div className="adm-card adm-form">
          <div className="adm-content__field-header">
            <span className="adm-content__icon" aria-hidden="true">🌍</span>
            <div>
              <h2 className="adm-content__field-title">Vision</h2>
              <p className="adm-content__field-hint">
                Décrit l'avenir vers lequel l'IPJBU tend.
                Affiché sur les pages Accueil et À propos avec la Mission.
              </p>
            </div>
          </div>
          <div className={`adm-field${errors.vision ? ' adm-field--err' : ''}`}>
            <label htmlFor="content-vision" className="adm-label">
              Texte de la vision <span className="adm-req">*</span>
            </label>
            <textarea
              id="content-vision"
              className={`adm-textarea${errors.vision ? ' adm-input--error' : ''}`}
              style={{ minHeight: 160 }}
              value={vision}
              onChange={(e) => handleChange('vision', e.target.value)}
              aria-required="true"
              aria-describedby={errors.vision ? 'vision-err' : undefined}
            />
            {errors.vision && (
              <p id="vision-err" className="adm-field-error">{errors.vision}</p>
            )}
            <p className="adm-content__char-count">{vision.length} characters</p>
          </div>
        </div>
      </div>

      <div className="adm-card adm-form adm-content__partners">
        <div className="adm-content__field-header">
          <span className="adm-content__icon" aria-hidden="true">🤝</span>
          <div>
            <h2 className="adm-content__field-title">Partenaires</h2>
            <p className="adm-content__field-hint">
              Gérez les organisations affichées dans la section Partenaires de la page À propos.
            </p>
          </div>
          <button type="button" className="adm-btn adm-btn--ghost adm-content__add-partner" onClick={addPartner}>
            + Ajouter un partenaire
          </button>
        </div>

        <div className="adm-content__partners-list">
          {partners.map((partner, index) => (
            <div key={index} className={`adm-content__partner-row${errors.partners ? ' adm-field--err' : ''}`}>
              <label htmlFor={`content-partner-${index}`} className="adm-sr-only">Partenaire {index + 1}</label>
              <input
                id={`content-partner-${index}`}
                className="adm-input"
                value={partner}
                onChange={(event) => updatePartner(index, event.target.value)}
                placeholder="Nom de l'organisation partenaire"
              />
              <button
                type="button"
                className="adm-btn adm-btn--danger adm-content__remove-partner"
                onClick={() => removePartner(index)}
                aria-label={`Supprimer le partenaire ${index + 1}`}
              >
                Supprimer
              </button>
            </div>
          ))}
          {!partners.length && <p className="adm-content__empty">Aucun partenaire ajouté.</p>}
        </div>
        {errors.partners && <p className="adm-field-error">{errors.partners}</p>}
      </div>

      {/* Live preview */}
      <div className="adm-card adm-content__preview">
        <h3 className="adm-content__preview-title">Aperçu en direct</h3>
        <div className="adm-content__preview-grid">
          <div className="adm-content__preview-block">
            <span className="adm-content__preview-label">Mission</span>
            <p>{mission || <em className="adm-content__preview-empty">Vide</em>}</p>
          </div>
          <div className="adm-content__preview-block">
            <span className="adm-content__preview-label">Vision</span>
            <p>{vision || <em className="adm-content__preview-empty">Vide</em>}</p>
          </div>
          <div className="adm-content__preview-block">
            <span className="adm-content__preview-label">Partenaires</span>
            <p>{partners.length ? partners.join(' · ') : <em className="adm-content__preview-empty">Aucun ajouté</em>}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
