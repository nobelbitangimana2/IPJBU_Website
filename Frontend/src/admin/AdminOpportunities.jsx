import React, { useEffect, useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminOpportunities.css'

const EMPTY_FORM = {
  title: '',
  description: '',
  type: '',
  location: '',
  deadline: '',
  applyUrl: '',
  pdfUrl: '',
  pdfFileId: '',
  published: true,
  order: '0',
}

const TYPE_SUGGESTIONS = ['Bourse', 'Formation', 'Partenariat', 'Appel à projets']

function getPdfName(url) {
  if (!url) return ''
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop()) || 'PDF'
  } catch {
    return 'PDF'
  }
}

export default function AdminOpportunities() {
  const { adminOpportunities, fetchAdminOpportunities, addOpportunity, editOpportunity, deleteOpportunity, uploadOpportunityPdf } = useData()
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const sorted = [...adminOpportunities].sort((a, b) => (
    (a.order ?? 0) - (b.order ?? 0) ||
    (a.deadline ? new Date(a.deadline).getTime() : Infinity) -
      (b.deadline ? new Date(b.deadline).getTime() : Infinity) ||
    new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  ))

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetchAdminOpportunities().catch((error) => {
      showToast('error', error.message || 'Impossible de charger les opportunités.')
    })
  }, [fetchAdminOpportunities])

  function openNew() {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setView('form')
  }

  function openEdit(opportunity) {
    setForm({
      title: opportunity.title || '',
      description: opportunity.description || '',
      type: opportunity.type || '',
      location: opportunity.location || '',
      deadline: opportunity.deadline ? new Date(opportunity.deadline).toISOString().slice(0, 10) : '',
      applyUrl: opportunity.applyUrl || '',
      pdfUrl: opportunity.pdfUrl || '',
      pdfFileId: opportunity.pdfFileId || '',
      published: opportunity.published !== false,
      order: String(opportunity.order ?? 0),
    })
    setEditingId(opportunity.id)
    setView('form')
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handlePdfUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.type !== 'application/pdf') {
      showToast('error', 'Seuls les fichiers PDF sont acceptés.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Le fichier PDF doit faire 10 Mo ou moins.')
      return
    }
    setUploading(true)
    try {
      const uploaded = await uploadOpportunityPdf(file)
      setForm((current) => ({ ...current, pdfUrl: uploaded.url, pdfFileId: uploaded.fileId }))
      showToast('success', 'PDF téléversé. Enregistrez l’opportunité pour appliquer la modification.')
    } catch (error) {
      showToast('error', error.message || 'Échec du téléversement du PDF.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      showToast('error', 'Le titre est requis.')
      return
    }
    if (/^offre d['’]emploi$/i.test(form.type.trim()) && form.published) {
      showToast('error', 'Le type « Offre d’emploi » n’est plus disponible.')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type.trim(),
      location: form.location.trim(),
      deadline: form.deadline || null,
      applyUrl: form.applyUrl.trim(),
      order: Number(form.order) || 0,
    }
    try {
      if (editingId) {
        await editOpportunity(editingId, payload)
        showToast('success', 'Opportunité enregistrée.')
      } else {
        await addOpportunity(payload)
        showToast('success', 'Opportunité créée.')
      }
      setView('list')
    } catch (error) {
      showToast('error', error.message || 'Impossible d’enregistrer cette opportunité.')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(opportunity) {
    try {
      await editOpportunity(opportunity.id, { ...opportunity, published: opportunity.published === false })
      showToast('success', opportunity.published === false ? 'Opportunité publiée.' : 'Opportunité dépubliée.')
    } catch (error) {
      showToast('error', error.message || 'Impossible de modifier la publication.')
    }
  }

  async function handleDelete(opportunity) {
    if (!window.confirm(`Supprimer « ${opportunity.title} » ?`)) return
    try {
      await deleteOpportunity(opportunity.id)
      showToast('success', 'Opportunité supprimée.')
      if (editingId === opportunity.id) setView('list')
    } catch (error) {
      showToast('error', error.message || 'Impossible de supprimer cette opportunité.')
    }
  }

  return (
    <div className="adm-opportunities">
      {toast && <div className={`adm-toast adm-toast--${toast.type}`} role="status">{toast.message}</div>}

      {view === 'list' ? (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">Opportunités</h1>
              <p className="adm-page__subtitle">{adminOpportunities.length} au total</p>
            </div>
            <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nouvelle opportunité</button>
          </div>
          <div className="adm-card adm-opportunities__list">
            {!sorted.length ? <p className="adm-opportunities__empty">Aucune opportunité pour le moment.</p> : (
              sorted.map((opportunity) => (
                <article className="adm-opportunities__row" key={opportunity.id}>
                  <div className="adm-opportunities__details">
                    <h2>{opportunity.title}</h2>
                    <p>{opportunity.type || 'Sans type'}{opportunity.location ? ` · ${opportunity.location}` : ''}</p>
                    {opportunity.pdfUrl && <a href={opportunity.pdfUrl} target="_blank" rel="noopener noreferrer">{getPdfName(opportunity.pdfUrl)}</a>}
                  </div>
                  <div className="adm-opportunities__actions">
                    <span className={`adm-badge ${opportunity.published === false ? 'adm-badge--grey' : 'adm-badge--green'}`}>
                      {opportunity.published === false ? 'Brouillon' : 'Publié'}
                    </span>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => togglePublished(opportunity)}>
                      {opportunity.published === false ? 'Publier' : 'Dépublier'}
                    </button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(opportunity)}>Modifier</button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => handleDelete(opportunity)}>Supprimer</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">{editingId ? 'Modifier l’opportunité' : 'Nouvelle opportunité'}</h1>
              <p className="adm-page__subtitle">Les champs facultatifs peuvent rester vides.</p>
            </div>
            <button className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>← Retour</button>
          </div>

          <form className="adm-card adm-form adm-opportunities__form" onSubmit={handleSave}>
            <div className="adm-opportunities__two-col">
              <div className="adm-field">
                <label className="adm-label" htmlFor="opp-title">Titre <span className="adm-req">*</span></label>
                <input id="opp-title" className="adm-input" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="opp-type">Type</label>
                <input id="opp-type" className="adm-input" name="type" list="opp-types" value={form.type} onChange={handleChange} />
                <datalist id="opp-types">
                  {TYPE_SUGGESTIONS.map((type) => <option value={type} key={type} />)}
                </datalist>
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="opp-location">Lieu</label>
                <input id="opp-location" className="adm-input" name="location" value={form.location} onChange={handleChange} />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="opp-deadline">Date limite</label>
                <input id="opp-deadline" className="adm-input" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
              </div>
              <div className="adm-field adm-opportunities__full">
                <label className="adm-label" htmlFor="opp-description">Description</label>
                <textarea id="opp-description" className="adm-textarea" name="description" rows={5} value={form.description} onChange={handleChange} />
              </div>
              <div className="adm-field adm-opportunities__full">
                <label className="adm-label" htmlFor="opp-apply-url">Lien de candidature</label>
                <input id="opp-apply-url" className="adm-input" type="url" name="applyUrl" value={form.applyUrl} onChange={handleChange} placeholder="https://…" />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="opp-order">Ordre d’affichage</label>
                <input id="opp-order" className="adm-input" type="number" name="order" value={form.order} onChange={handleChange} />
              </div>
            </div>

            <div className="adm-field">
              <span className="adm-label">Document PDF</span>
              {form.pdfUrl ? (
                <div className="adm-opportunities__pdf">
                  <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer">{getPdfName(form.pdfUrl)}</a>
                  <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setForm((current) => ({ ...current, pdfUrl: '', pdfFileId: '' }))}>Retirer le PDF</button>
                </div>
              ) : <p className="adm-opportunities__no-pdf">Aucun document PDF associé.</p>}
              <label className="adm-btn adm-btn--outline adm-btn--sm adm-opportunities__upload">
                {uploading ? 'Téléversement…' : form.pdfUrl ? 'Remplacer le PDF' : 'Téléverser un PDF'}
                <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={handlePdfUpload} />
              </label>
              <span className="adm-opportunities__hint">PDF uniquement, 10 Mo maximum.</span>
            </div>

            <div className="adm-opportunities__form-footer">
              <label className="adm-opportunities__publish">
                <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                Publier immédiatement
              </label>
              <div className="adm-opportunities__form-actions">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>Annuler</button>
                <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || uploading}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
