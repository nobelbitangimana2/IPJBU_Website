import React, { useState, useEffect } from 'react'
import { useData } from '../store/DataContext'
import './AdminContactInfo.css'

const SOCIAL_PLATFORMS = [
  { key: 'facebook',  label: 'Facebook',    placeholder: 'https://facebook.com/votrepage' },
  { key: 'twitter',   label: 'X / Twitter', placeholder: 'https://twitter.com/votrecompte' },
  { key: 'instagram', label: 'Instagram',   placeholder: 'https://instagram.com/votrecompte' },
  { key: 'linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/company/votreentreprise' },
  { key: 'youtube',   label: 'YouTube',     placeholder: 'https://youtube.com/@votrechaine' },
]

function toForm(contact) {
  return {
    address:     contact.address     ?? '',
    phone:       contact.phone       ?? '',
    email:       contact.email       ?? '',
    officeHours: contact.officeHours ?? '',
    mapEmbedUrl: contact.mapEmbedUrl ?? '',
    facebook:    contact.socialLinks?.facebook  ?? '',
    twitter:     contact.socialLinks?.twitter   ?? '',
    instagram:   contact.socialLinks?.instagram ?? '',
    linkedin:    contact.socialLinks?.linkedin  ?? '',
    youtube:     contact.socialLinks?.youtube   ?? '',
    phones:      Array.isArray(contact.phones) && contact.phones.length
      ? contact.phones
      : [{ label: '', number: '' }],
  }
}

function validate(f) {
  const e = {}
  if (!f.address.trim()) e.address = 'L\'adresse est requise.'
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'Entrez une adresse e-mail valide.'
  return e
}

export default function AdminContactInfo() {
  const { contact, saveContact } = useData()

  const [form,   setForm]   = useState(() => toForm(contact))
  const [errors, setErrors] = useState({})
  const [toast,  setToast]  = useState(null)
  const [dirty,  setDirty]  = useState(false)

  useEffect(() => {
    setForm(toForm(contact))
    setDirty(false)
  }, [contact])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setDirty(true)
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  /* Phones array helpers */
  function addPhone() {
    setForm((f) => ({ ...f, phones: [...f.phones, { label: '', number: '' }] }))
    setDirty(true)
  }

  function removePhone(idx) {
    setForm((f) => ({ ...f, phones: f.phones.filter((_, i) => i !== idx) }))
    setDirty(true)
  }

  function updatePhone(idx, field, value) {
    setForm((f) => ({
      ...f,
      phones: f.phones.map((p, i) => i === idx ? { ...p, [field]: value } : p),
    }))
    setDirty(true)
  }

  function handleSave() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    saveContact({
      address:     form.address,
      phone:       form.phone,
      email:       form.email,
      officeHours: form.officeHours,
      mapEmbedUrl: form.mapEmbedUrl,
      phones:      form.phones.filter((p) => p.number.trim()),
      socialLinks: {
        facebook:  form.facebook,
        twitter:   form.twitter,
        instagram: form.instagram,
        linkedin:  form.linkedin,
        youtube:   form.youtube,
      },
    })
      .then(() => {
        setDirty(false)
        setToast({ type: 'success', msg: 'Informations de contact enregistrées. Modifications en ligne.' })
        setTimeout(() => setToast(null), 3500)
      })
      .catch((err) => {
        setToast({ type: 'error', msg: err.message || 'Échec de la sauvegarde.' })
        setTimeout(() => setToast(null), 3500)
      })
  }

  function handleReset() {
    setForm(toForm(contact))
    setErrors({})
    setDirty(false)
  }

  function fieldErr(name) { return errors[name] ?? '' }

  return (
    <div className="adm-ci">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          ✓ {toast.msg}
        </div>
      )}

      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Informations de contact</h1>
          <p className="adm-page__subtitle">
            Affichées sur la page Contact publique et dans le pied de page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {dirty && (
            <button className="adm-btn adm-btn--ghost" onClick={handleReset}>
              Réinitialiser
            </button>
          )}
          <button className="adm-btn adm-btn--primary" onClick={handleSave}>
            Enregistrer
          </button>
        </div>
      </div>

      <div className="adm-ci__grid">
        {/* ── Coordonnées principales ── */}
        <div className="adm-card adm-form">
          <h2 className="adm-ci__section-title">
            <span aria-hidden="true">📍</span> Coordonnées
          </h2>

          {/* Adresse */}
          <div className={`adm-field${fieldErr('address') ? ' adm-field--err' : ''}`}>
            <label className="adm-label" htmlFor="ci-address">
              Adresse <span className="adm-req">*</span>
            </label>
            <textarea
              id="ci-address"
              name="address"
              className={`adm-textarea${fieldErr('address') ? ' adm-input--error' : ''}`}
              style={{ minHeight: 72 }}
              value={form.address}
              onChange={handleChange}
              placeholder="Quartier, Commune, Province, Pays"
              aria-required="true"
            />
            {fieldErr('address') && <p className="adm-field-error">{fieldErr('address')}</p>}
          </div>

          {/* URL carte */}
          <div className="adm-field">
            <label className="adm-label" htmlFor="ci-map">URL d'intégration de la carte</label>
            <input
              id="ci-map"
              name="mapEmbedUrl"
              className="adm-input"
              value={form.mapEmbedUrl}
              onChange={handleChange}
              placeholder="https://www.openstreetmap.org/export/embed.html?…"
            />
          </div>

          {/* E-mail (optionnel) */}
          <div className={`adm-field${fieldErr('email') ? ' adm-field--err' : ''}`}>
            <label className="adm-label" htmlFor="ci-email">E-mail</label>
            <input
              id="ci-email"
              name="email"
              type="email"
              className={`adm-input${fieldErr('email') ? ' adm-input--error' : ''}`}
              value={form.email}
              onChange={handleChange}
              placeholder="info@ipjbu.bi"
            />
            {fieldErr('email') && <p className="adm-field-error">{fieldErr('email')}</p>}
          </div>

          {/* Horaires */}
          <div className="adm-field">
            <label className="adm-label" htmlFor="ci-hours">Horaires d'ouverture</label>
            <input
              id="ci-hours"
              name="officeHours"
              className="adm-input"
              value={form.officeHours}
              onChange={handleChange}
              placeholder="Lundi – Vendredi, 08h00 – 17h00"
            />
          </div>

          {/* Numéros de téléphone (tableau) */}
          <div className="adm-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="adm-label" style={{ margin: 0 }}>Numéros de téléphone</label>
              <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={addPhone}>
                + Ajouter
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
              Indiquez le titre (ex : Président) et le numéro pour chaque contact.
            </p>
            {form.phones.map((ph, idx) => (
              <div key={idx} className="adm-ci__phone-row">
                <input
                  className="adm-input"
                  value={ph.label}
                  onChange={(e) => updatePhone(idx, 'label', e.target.value)}
                  placeholder="Titre (ex : Président)"
                  aria-label={`Titre du téléphone ${idx + 1}`}
                />
                <input
                  className="adm-input"
                  value={ph.number}
                  onChange={(e) => updatePhone(idx, 'number', e.target.value)}
                  placeholder="+257 00 000 000"
                  aria-label={`Numéro ${idx + 1}`}
                />
                <button
                  type="button"
                  className="adm-btn adm-btn--danger adm-btn--sm"
                  onClick={() => removePhone(idx)}
                  aria-label={`Supprimer le téléphone ${idx + 1}`}
                  disabled={form.phones.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Réseaux sociaux ── */}
        <div className="adm-card adm-form">
          <h2 className="adm-ci__section-title">
            <span aria-hidden="true">🔗</span> Réseaux sociaux
          </h2>
          <p className="adm-ci__section-hint">
            Laissez vide pour masquer une plateforme dans le pied de page et la page Contact.
          </p>

          {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
            <div className="adm-field" key={key}>
              <label className="adm-label" htmlFor={`ci-${key}`}>{label}</label>
              <input
                id={`ci-${key}`}
                name={key}
                type="url"
                className="adm-input"
                value={form[key]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Aperçu */}
      <div className="adm-card adm-ci__preview">
        <h3 className="adm-ci__preview-title">Aperçu en direct</h3>
        <div className="adm-ci__preview-grid">
          <PreviewItem label="Adresse"   value={form.address} />
          <PreviewItem label="E-mail"    value={form.email} />
          <PreviewItem label="Horaires"  value={form.officeHours} />
          <div className="adm-ci__preview-item">
            <span className="adm-ci__preview-label">Téléphones</span>
            <span className="adm-ci__preview-value">
              {form.phones.filter((p) => p.number).length > 0
                ? form.phones.filter((p) => p.number).map((p) => `${p.label ? p.label + ' : ' : ''}${p.number}`).join(' | ')
                : <em className="adm-ci__preview-empty">Non renseigné</em>
              }
            </span>
          </div>
          <div className="adm-ci__preview-social">
            <span className="adm-ci__preview-label">Réseaux sociaux</span>
            <div className="adm-ci__preview-social-pills">
              {SOCIAL_PLATFORMS.filter((p) => form[p.key]).map((p) => (
                <span key={p.key} className="adm-ci__preview-pill">{p.label}</span>
              ))}
              {SOCIAL_PLATFORMS.every((p) => !form[p.key]) && (
                <em className="adm-ci__preview-empty">Aucun renseigné</em>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewItem({ label, value }) {
  return (
    <div className="adm-ci__preview-item">
      <span className="adm-ci__preview-label">{label}</span>
      <span className="adm-ci__preview-value">
        {value || <em className="adm-ci__preview-empty">Non renseigné</em>}
      </span>
    </div>
  )
}
