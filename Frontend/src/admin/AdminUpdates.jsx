import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminUpdates.css'

const EMPTY_FORM = {
  title: '', date: new Date().toISOString().slice(0, 10),
  excerpt: '', body: '', blocks: [], imageUrl: '', category: 'général',
}

function validate(f) {
  const e = {}
  if (!f.title.trim())   e.title   = 'Le titre est requis.'
  if (!f.date)           e.date    = 'La date est requise.'
  if (!f.excerpt.trim()) e.excerpt = 'Le résumé est requis.'
  if (!f.body.trim() && !f.blocks.length) e.body = 'Ajoutez au moins un bloc de contenu.'
  if (f.blocks.some((block) => (
    block.type === 'image' ? !(block.imageUrl || '').trim() : !(block.text || '').trim()
  ))) e.body = 'Complétez ou supprimez les blocs vides.'
  return e
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-confirm-backdrop" role="dialog" aria-modal="true">
      <div className="adm-confirm-box">
        <h3>Confirmer la suppression</h3><p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost"  onClick={onCancel}>Annuler</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUpdates() {
  const { updates, categories, addUpdate, editUpdate, deleteUpdate, images, addImage } = useData()

  const [view,        setView]        = useState('list')
  const [editingId,   setEditingId]   = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [touched,     setTouched]     = useState({})
  const [confirmId,   setConfirmId]   = useState(null)
  const [toast,       setToast]       = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [mediaPicker, setMediaPicker] = useState(false)
  const [uploadingBlock, setUploadingBlock] = useState(null)

  const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date))

  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  function openNew() {
    setForm({ ...EMPTY_FORM, blocks: [], category: categories[0]?.slug || 'général' })
    setErrors({}); setTouched({}); setEditingId(null); setView('form')
  }

  function openEdit(u) {
    const blocks = u.blocks?.length
      ? u.blocks.map((block) => ({ ...block }))
      : (u.body || '').split('\n\n').filter(Boolean).map((text) => ({ type: 'paragraph', text, imageUrl: '', alt: '', caption: '' }))
    setForm({
      title: u.title, date: u.date, excerpt: u.excerpt, body: u.body || '', blocks,
      imageUrl: u.imageUrl ?? '', category: u.category ?? 'général',
    })
    setErrors({}); setTouched({}); setEditingId(u.id); setView('form')
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  function handleBlur(e) { setTouched((t) => ({ ...t, [e.target.name]: true })) }
  function fieldErr(n)   { return touched[n] && errors[n] ? errors[n] : '' }

  function updateBlocks(blocks) {
    const body = blocks
      .filter((block) => block.type === 'paragraph')
      .map((block) => block.text || '')
      .filter(Boolean)
      .join('\n\n')
    setForm((current) => ({ ...current, blocks, body }))
    if (errors.body && blocks.length) setErrors((current) => ({ ...current, body: '' }))
  }

  function addBlock(type) {
    const blank = { type, text: '', imageUrl: '', alt: '', caption: '' }
    updateBlocks([...form.blocks, blank])
  }

  function editBlock(index, patch) {
    updateBlocks(form.blocks.map((block, i) => i === index ? { ...block, ...patch } : block))
  }

  function moveBlock(index, offset) {
    const target = index + offset
    if (target < 0 || target >= form.blocks.length) return
    const blocks = [...form.blocks]
    ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
    updateBlocks(blocks)
  }

  async function uploadBlockImage(index, file) {
    if (!file) return
    setUploadingBlock(index)
    try {
      const image = await addImage(file, 'updates', form.blocks[index].alt)
      editBlock(index, { imageUrl: image.url })
    } catch (err) {
      showToast('error', err.message || 'Échec du téléversement de l’image.')
    } finally {
      setUploadingBlock(null)
    }
  }

  async function handlePublish() {
    const allTouched = Object.fromEntries(['title','date','excerpt','body'].map((k) => [k, true]))
    setTouched(allTouched)
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      if (editingId) {
        await editUpdate(editingId, form)
        showToast('success', 'Update saved.')
      } else {
        await addUpdate(form)
        showToast('success', 'Update published.')
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
      await deleteUpdate(confirmId)
      showToast('success', 'Update deleted.')
      if (editingId === confirmId) setView('list')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <div className="adm-updates">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* ── List ── */}
      {view === 'list' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">Actualités</h1>
              <p className="adm-page__subtitle">{updates.length} au total</p>
            </div>
            <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nouvelle actualité</button>
          </div>
          <div className="adm-card adm-table-wrap">
            {sorted.length === 0 ? (
              <p className="adm-updates__empty">Aucune actualité.</p>
            ) : (
              <table className="adm-table" aria-label="Updates list">
                <thead><tr><th>Image</th><th>Titre</th><th>Catégorie</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {sorted.map((u) => (
                    <tr key={u.id}>
                      <td>{u.imageUrl && <img src={u.imageUrl} alt="" className="adm-updates__thumb" loading="lazy" />}</td>
                      <td>
                        <p className="adm-updates__row-title">{u.title}</p>
                        <p className="adm-updates__row-excerpt">{u.excerpt}</p>
                      </td>
                      <td><span className="adm-badge adm-badge--green">{u.category}</span></td>
                      <td className="adm-updates__date-cell">
                        {new Date(u.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                      <td>
                        <div className="adm-updates__actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(u)}>Modifier</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setConfirmId(u.id)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── Form ── */}
      {view === 'form' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">{editingId ? 'Modifier l\'actualité' : 'Nouvelle actualité'}</h1>
              <p className="adm-page__subtitle">{editingId ? 'Les modifications sont publiées immédiatement.' : 'Remplissez les champs requis puis publiez.'}</p>
            </div>
            <button className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>← Retour</button>
          </div>

          <div className="adm-updates__form-grid">
            <div className="adm-card adm-form">
              {/* Title */}
              <div className={`adm-field${fieldErr('title') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-title">Titre <span className="adm-req">*</span></label>
                <input id="upd-title" name="title" className={`adm-input${fieldErr('title') ? ' adm-input--error' : ''}`} value={form.title} onChange={handleChange} onBlur={handleBlur} placeholder="Titre de l'actualité" aria-required="true" />
                {fieldErr('title') && <p className="adm-field-error">{fieldErr('title')}</p>}
              </div>

              {/* Date + Category */}
              <div className="adm-updates__two-col">
                <div className={`adm-field${fieldErr('date') ? ' adm-field--err' : ''}`}>
                  <label className="adm-label" htmlFor="upd-date">Date <span className="adm-req">*</span></label>                  <input id="upd-date" name="date" type="date" className={`adm-input${fieldErr('date') ? ' adm-input--error':''}`} value={form.date} onChange={handleChange} onBlur={handleBlur} aria-required="true" />
                  {fieldErr('date') && <p className="adm-field-error">{fieldErr('date')}</p>}
                </div>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="upd-cat">Catégorie</label>
                  <select id="upd-cat" name="category" className="adm-select" value={form.category} onChange={handleChange}>
                    {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div className={`adm-field${fieldErr('excerpt') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="upd-excerpt">Résumé <span className="adm-req">*</span></label>
                <textarea id="upd-excerpt" name="excerpt" className={`adm-textarea${fieldErr('excerpt') ? ' adm-input--error':''}`} style={{ minHeight: 72 }} value={form.excerpt} onChange={handleChange} onBlur={handleBlur} placeholder="Texte d'aperçu court" aria-required="true" />
                {fieldErr('excerpt') && <p className="adm-field-error">{fieldErr('excerpt')}</p>}
              </div>

              {/* Block editor */}
              <div className={`adm-field${fieldErr('body') ? ' adm-field--err' : ''}`}>
                <span className="adm-label">Contenu de l’article <span className="adm-req">*</span></span>
                <div className="adm-updates__blocks">
                  {form.blocks.map((block, index) => (
                    <article className="adm-updates__block" key={`${block.type}-${index}`}>
                      <div className="adm-updates__block-header">
                        <strong>{block.type === 'paragraph' ? 'Paragraphe' : block.type === 'heading' ? 'Intertitre' : 'Image'} {index + 1}</strong>
                        <div className="adm-updates__block-actions">
                          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label="Monter le bloc">↑</button>
                          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => moveBlock(index, 1)} disabled={index === form.blocks.length - 1} aria-label="Descendre le bloc">↓</button>
                          <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => updateBlocks(form.blocks.filter((_, i) => i !== index))}>Supprimer</button>
                        </div>
                      </div>
                      {block.type === 'paragraph' && (
                        <textarea className="adm-textarea" value={block.text} rows={5}
                          onChange={(event) => editBlock(index, { text: event.target.value })}
                          placeholder="Écrivez votre paragraphe…" aria-label={`Paragraphe ${index + 1}`} />
                      )}
                      {block.type === 'heading' && (
                        <input className="adm-input" value={block.text}
                          onChange={(event) => editBlock(index, { text: event.target.value })}
                          placeholder="Texte de l’intertitre" aria-label={`Intertitre ${index + 1}`} />
                      )}
                      {block.type === 'image' && (
                        <div className="adm-updates__block-image-fields">
                          {block.imageUrl && <img src={block.imageUrl} alt={block.alt} className="adm-updates__block-image-preview" />}
                          <input className="adm-input" type="url" value={block.imageUrl}
                            onChange={(event) => editBlock(index, { imageUrl: event.target.value })}
                            placeholder="URL de l’image" aria-label={`URL de l’image ${index + 1}`} />
                          <label className="adm-btn adm-btn--outline adm-btn--sm adm-updates__block-upload">
                            {uploadingBlock === index ? 'Téléversement…' : 'Téléverser une image'}
                            <input type="file" accept="image/*" disabled={uploadingBlock === index}
                              onChange={(event) => {
                                uploadBlockImage(index, event.target.files?.[0])
                                event.target.value = ''
                              }} />
                          </label>
                          <input className="adm-input" value={block.alt}
                            onChange={(event) => editBlock(index, { alt: event.target.value })}
                            placeholder="Texte alternatif" aria-label={`Texte alternatif ${index + 1}`} />
                          <input className="adm-input" value={block.caption}
                            onChange={(event) => editBlock(index, { caption: event.target.value })}
                            placeholder="Légende (facultative)" aria-label={`Légende ${index + 1}`} />
                        </div>
                      )}
                    </article>
                  ))}
                  <div className="adm-updates__add-blocks">
                    <button type="button" className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => addBlock('paragraph')}>+ Paragraphe</button>
                    <button type="button" className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => addBlock('heading')}>+ Intertitre</button>
                    <button type="button" className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => addBlock('image')}>+ Image</button>
                  </div>
                </div>
                {fieldErr('body') && <p className="adm-field-error">{fieldErr('body')}</p>}
              </div>

              <div className="adm-updates__live-preview">
                <h3>Aperçu de l’article</h3>
                {form.blocks.map((block, index) => {
                  if (block.type === 'heading') return <h4 key={index}>{block.text || 'Intertitre'}</h4>
                  if (block.type === 'image') return block.imageUrl
                    ? <figure key={index}><img src={block.imageUrl} alt={block.alt} /><figcaption>{block.caption || block.alt}</figcaption></figure>
                    : <p key={index}>Image à ajouter</p>
                  return <p key={index}>{block.text || 'Votre paragraphe apparaîtra ici.'}</p>
                })}
                {!form.blocks.length && <p className="adm-content__empty">Ajoutez des blocs pour prévisualiser l’article.</p>}
              </div>
            </div>

            {/* Sidebar */}
            <div className="adm-updates__sidebar">
              <div className="adm-card adm-form">
                <h3 className="adm-updates__sidebar-heading">Image à la une</h3>
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="adm-updates__preview-img" />}
                <div className="adm-field">
                  <label className="adm-label" htmlFor="upd-imgurl">URL de l'image</label>
                  <input id="upd-imgurl" name="imageUrl" className="adm-input" value={form.imageUrl} onChange={handleChange} placeholder="https://…" />
                </div>
                <p className="adm-updates__or">— ou choisir depuis la bibliothèque —</p>
                <button type="button" className="adm-btn adm-btn--outline adm-btn--sm" style={{ width:'100%' }} onClick={() => setMediaPicker(true)}>Parcourir les médias</button>
              </div>

              <div className="adm-card adm-form">
                <h3 className="adm-updates__sidebar-heading">Publication</h3>
                <button className="adm-btn adm-btn--primary" style={{ width:'100%' }} onClick={handlePublish} disabled={saving}>
                  {saving ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Publier l\'actualité'}
                </button>
                {editingId && (
                  <button className="adm-btn adm-btn--danger" style={{ width:'100%', marginTop:'0.5rem' }} onClick={() => setConfirmId(editingId)}>Supprimer</button>
                )}
                <p className="adm-updates__publish-note">
                  {editingId ? 'Enregistre dans la base de données et met à jour la page publique.' : 'Crée un nouvel article et l\'ajoute à la page Actualités.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Media picker modal */}
      {mediaPicker && (
        <div className="adm-confirm-backdrop" role="dialog" aria-modal="true" aria-label="Choisir une image" onClick={() => setMediaPicker(false)}>
          <div className="adm-updates__media-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-updates__media-modal-header">
              <h3>Bibliothèque de médias</h3>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setMediaPicker(false)}>✕ Fermer</button>
            </div>
            <div className="adm-updates__media-picker-grid">
              {images.map((img) => (
                <button key={img.id} className={`adm-updates__media-thumb${form.imageUrl === img.url ? ' adm-updates__media-thumb--selected' : ''}`}
                  onClick={() => { setForm((f) => ({ ...f, imageUrl: img.url })); setMediaPicker(false) }} title={img.alt}>
                  <img src={img.thumbnailUrl || img.url} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Cette actualité sera définitivement supprimée de la base de données et retirée du site public."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
