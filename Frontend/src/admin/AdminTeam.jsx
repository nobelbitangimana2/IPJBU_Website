import React, { useRef, useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminTeam.css'

const EMPTY_FORM = {
  name: '', role: '', bio: '', photoUrl: '', imagekitFileId: '', imagekitThumbFileId: '',
}

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="adm-confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirmer la suppression">
      <div className="adm-confirm-box">
        <h3>Retirer le membre</h3>
        <p>Ce membre sera retiré de la page À propos publique.</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Annuler</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Retirer</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminTeam() {
  const { team, uploadTeamPhoto, addTeamMember, editTeamMember, deleteTeamMember } = useData()
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const fileInputRef = useRef(null)

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  function openNew() {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditingId(null)
    setView('form')
  }

  function openEdit(member) {
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      photoUrl: member.photoUrl || '',
      imagekitFileId: member.imagekitFileId || '',
      imagekitThumbFileId: member.imagekitThumbFileId || '',
    })
    setErrors({})
    setEditingId(member.id)
    setView('form')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const image = await uploadTeamPhoto(file)
      setForm((current) => ({
        ...current,
        photoUrl: image.photoUrl,
        imagekitFileId: image.imagekitFileId,
        imagekitThumbFileId: image.imagekitThumbFileId,
      }))
      showToast('success', 'Photo uploaded. Save the member to publish it.')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  async function handleSave() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.role.trim()) nextErrors.role = 'Role is required.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        photoUrl: form.photoUrl,
        imagekitFileId: form.imagekitFileId || '',
        imagekitThumbFileId: form.imagekitThumbFileId || '',
      }
      if (editingId) {
        await editTeamMember(editingId, payload)
        showToast('success', 'Team member updated.')
      } else {
        await addTeamMember(payload)
        showToast('success', 'Team member added.')
      }
      setView('list')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    try {
      await deleteTeamMember(confirmId)
      showToast('success', 'Team member removed.')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <div className="adm-team">
      {toast && <div className={`adm-toast adm-toast--${toast.type}`} role="status">{toast.message}</div>}

      {view === 'list' ? (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">Membres de l'équipe</h1>
              <p className="adm-page__subtitle">Gérez les personnes affichées sur la page À propos publique.</p>
            </div>
            <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Ajouter un membre</button>
          </div>

          <div className="adm-team__grid">
            {team.map((member) => (
              <article key={member.id} className="adm-card adm-team__card">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt="" className="adm-team__photo" />
                ) : (
                  <div className="adm-team__photo adm-team__photo--empty" aria-hidden="true">👤</div>
                )}
                <div className="adm-team__info">
                  <h2>{member.name}</h2>
                  <p className="adm-team__role">{member.role}</p>
                  {member.bio && <p className="adm-team__bio">{member.bio}</p>}
                  <div className="adm-team__actions">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(member)}>Modifier</button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setConfirmId(member.id)}>Retirer</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!team.length && <div className="adm-card adm-team__empty">Aucun membre d'équipe. Ajoutez le premier pour le publier.</div>}
        </>
      ) : (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">{editingId ? 'Modifier le membre' : 'Ajouter un membre'}</h1>
              <p className="adm-page__subtitle">Les modifications sont publiées sur la page À propos après enregistrement.</p>
            </div>
            <button className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>Retour à l'équipe</button>
          </div>

          <div className="adm-team__form-grid">
            <div className="adm-card adm-form">
              <div className="adm-field">
                <label className="adm-label" htmlFor="team-name">Nom complet <span className="adm-req">*</span></label>
                <input id="team-name" name="name" className={`adm-input${errors.name ? ' adm-input--error' : ''}`} value={form.name} onChange={handleChange} placeholder="ex : Jean-Pierre Niyonkuru" />
                {errors.name && <p className="adm-field-error">{errors.name}</p>}
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="team-role">Rôle <span className="adm-req">*</span></label>
                <input id="team-role" name="role" className={`adm-input${errors.role ? ' adm-input--error' : ''}`} value={form.role} onChange={handleChange} placeholder="ex : Président" />
                {errors.role && <p className="adm-field-error">{errors.role}</p>}
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="team-bio">Biographie</label>
                <textarea id="team-bio" name="bio" className="adm-textarea" value={form.bio} onChange={handleChange} placeholder="Courte biographie affichée sous le rôle du membre" />
              </div>
            </div>

            <div className="adm-card adm-form">
              <h2 className="adm-team__photo-title">Photo de profil</h2>
              {form.photoUrl ? <img src={form.photoUrl} alt="Membre sélectionné" className="adm-team__preview" /> : <div className="adm-team__preview adm-team__preview--empty">Aucune photo sélectionnée</div>}
              <button type="button" className="adm-btn adm-btn--outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? 'Téléversement…' : 'Téléverser une photo'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="adm-team__file-input" aria-label="Téléverser une photo du membre" />
              <p className="adm-team__hint">Les images sont compressées et stockées avec le service de médias.</p>
              <button className="adm-btn adm-btn--primary adm-team__save" onClick={handleSave} disabled={saving || uploading}>
                {saving ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Ajouter le membre'}
              </button>
            </div>
          </div>
        </>
      )}

      {confirmId && <ConfirmDialog onConfirm={confirmDelete} onCancel={() => setConfirmId(null)} />}
    </div>
  )
}
