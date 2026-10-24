import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminCategories.css'

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useData()
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleAdd(event) {
    event.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await addCategory({ name: name.trim() })
      setName('')
      showToast('success', 'Catégorie ajoutée.')
    } catch (err) {
      showToast('error', err.message || 'Impossible d’ajouter la catégorie.')
    } finally {
      setSaving(false)
    }
  }

  async function handleRename(category) {
    if (!editingName.trim()) return
    setSaving(true)
    try {
      await updateCategory(category.id, { name: editingName.trim() })
      setEditingId(null)
      showToast('success', 'Catégorie renommée.')
    } catch (err) {
      showToast('error', err.message || 'Impossible de renommer la catégorie.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) return
    try {
      await deleteCategory(category.id)
      showToast('success', 'Catégorie supprimée.')
    } catch (err) {
      showToast('error', err.message || 'Impossible de supprimer la catégorie.')
    }
  }

  return (
    <div className="adm-categories">
      {toast && <div className={`adm-toast adm-toast--${toast.type}`} role="status">{toast.message}</div>}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Catégories</h1>
          <p className="adm-page__subtitle">Gérez les catégories des actualités.</p>
        </div>
      </div>

      <form className="adm-card adm-form adm-categories__add" onSubmit={handleAdd}>
        <div className="adm-field">
          <label htmlFor="category-name" className="adm-label">Nom de la catégorie</label>
          <input
            id="category-name"
            className="adm-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex. Agriculture"
            required
          />
        </div>
        <button className="adm-btn adm-btn--primary" disabled={saving}>Ajouter</button>
      </form>

      <div className="adm-card adm-categories__list">
        {!categories.length && <p className="adm-categories__empty">Aucune catégorie disponible.</p>}
        {categories.map((category) => (
          <div className="adm-categories__row" key={category.id}>
            {editingId === category.id ? (
              <>
                <input
                  className="adm-input"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  aria-label={`Nom de ${category.name}`}
                />
                <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => handleRename(category)} disabled={saving}>Enregistrer</button>
                <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setEditingId(null)}>Annuler</button>
              </>
            ) : (
              <>
                <span className="adm-categories__name">{category.name}</span>
                <span className="adm-categories__slug">{category.slug}</span>
                <div className="adm-categories__actions">
                  <button
                    className="adm-btn adm-btn--ghost adm-btn--sm"
                    onClick={() => { setEditingId(category.id); setEditingName(category.name) }}
                  >Renommer</button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => handleDelete(category)}>Supprimer</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
