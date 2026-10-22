import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import './AdminProducts.css'

const DEFAULT_SIZES = [
  { size: '1kg',   price: '' },
  { size: '5kg',   price: '' },
  { size: '10kg',  price: '' },
  { size: '25kg',  price: '' },
  { size: '50kg',  price: '' },
  { size: '100kg', price: '' },
]

const EMPTY_FORM = {
  name:        '',
  description: '',
  imageUrl:    '',
  sizes:       DEFAULT_SIZES.map((s) => ({ ...s })),
}

function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Product name is required.'
  const badSizes = f.sizes.some((s) => !s.size.trim())
  if (badSizes) e.sizes = 'All size labels must be filled in.'
  return e
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-confirm-backdrop" role="dialog" aria-modal="true">
      <div className="adm-confirm-box">
        <h3>Confirm delete</h3>
        <p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost"  onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { products, addProduct, editProduct, deleteProduct, images } = useData()

  const [view,        setView]        = useState('list')   // 'list' | 'form'
  const [editingId,   setEditingId]   = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [touched,     setTouched]     = useState({})
  const [confirmId,   setConfirmId]   = useState(null)
  const [toast,       setToast]       = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [mediaPicker, setMediaPicker] = useState(false)

  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Open new form ──────────────────────────────────────────────────────────
  function openNew() {
    setForm(EMPTY_FORM)
    setErrors({})
    setTouched({})
    setEditingId(null)
    setView('form')
  }

  // ── Open edit form ─────────────────────────────────────────────────────────
  function openEdit(p) {
    setForm({
      name:        p.name,
      description: p.description ?? '',
      imageUrl:    p.imageUrl    ?? '',
      sizes:       (p.sizes ?? []).map((s) => ({
        size:  s.size,
        price: s.price ? String(s.price) : '',
      })),
    })
    setErrors({})
    setTouched({})
    setEditingId(p.id)
    setView('form')
  }

  // ── Field helpers ──────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  function fieldErr(name) {
    return touched[name] && errors[name] ? errors[name] : ''
  }

  // ── Sizes helpers ──────────────────────────────────────────────────────────
  function handleSizeChange(idx, field, value) {
    setForm((f) => {
      const sizes = f.sizes.map((s, i) => i === idx ? { ...s, [field]: value } : s)
      return { ...f, sizes }
    })
    if (errors.sizes) setErrors((er) => ({ ...er, sizes: '' }))
  }

  function addSize() {
    setForm((f) => ({ ...f, sizes: [...f.sizes, { size: '', price: '' }] }))
  }

  function removeSize(idx) {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== idx) }))
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    const allTouched = { name: true, sizes: true }
    setTouched(allTouched)
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Normalise: convert price string to number (0 if blank)
    const payload = {
      ...form,
      sizes: form.sizes.map((s) => ({
        size:  s.size.trim(),
        price: s.price === '' ? 0 : Number(s.price),
      })),
    }

    setSaving(true)
    try {
      if (editingId) {
        await editProduct(editingId, payload)
        showToast('success', 'Product saved.')
      } else {
        await addProduct(payload)
        showToast('success', 'Product created.')
      }
      setView('list')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    try {
      await deleteProduct(confirmId)
      showToast('success', 'Product deleted.')
      if (editingId === confirmId) setView('list')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setConfirmId(null)
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="adm-products">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">Products</h1>
              <p className="adm-page__subtitle">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="adm-btn adm-btn--primary" onClick={openNew}>
              + New product
            </button>
          </div>

          <div className="adm-card adm-table-wrap">
            {products.length === 0 ? (
              <p className="adm-products__empty">
                No products yet. Click <strong>New product</strong> to add one.
              </p>
            ) : (
              <table className="adm-table" aria-label="Products list">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Sizes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt="" className="adm-products__thumb" loading="lazy" />
                          : <div className="adm-products__thumb-placeholder">🌾</div>
                        }
                      </td>
                      <td>
                        <p className="adm-products__row-name">{p.name}</p>
                        {p.description && (
                          <p className="adm-products__row-desc">{p.description}</p>
                        )}
                      </td>
                      <td>
                        <div className="adm-products__size-pills">
                          {(p.sizes ?? []).map(({ size }) => (
                            <span key={size} className="adm-badge adm-badge--green">{size}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="adm-products__row-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm"
                            onClick={() => openEdit(p)}>Edit</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => setConfirmId(p.id)}>Delete</button>
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

      {/* ── Form view ── */}
      {view === 'form' && (
        <>
          <div className="adm-page__header">
            <div>
              <h1 className="adm-page__title">{editingId ? 'Edit Product' : 'New Product'}</h1>
              <p className="adm-page__subtitle">
                {editingId ? 'Changes are live immediately on the public Products page.' : 'Fill in the details then save.'}
              </p>
            </div>
            <button className="adm-btn adm-btn--ghost" onClick={() => setView('list')}>
              ← Back
            </button>
          </div>

          <div className="adm-products__form-grid">
            {/* ── Left: main fields ── */}
            <div className="adm-card adm-form">

              {/* Name */}
              <div className={`adm-field${fieldErr('name') ? ' adm-field--err' : ''}`}>
                <label className="adm-label" htmlFor="prod-name">
                  Product name <span className="adm-req">*</span>
                </label>
                <input
                  id="prod-name"
                  name="name"
                  className={`adm-input${fieldErr('name') ? ' adm-input--error' : ''}`}
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. White Rice"
                  aria-required="true"
                />
                {fieldErr('name') && <p className="adm-field-error">{fieldErr('name')}</p>}
              </div>

              {/* Description */}
              <div className="adm-field">
                <label className="adm-label" htmlFor="prod-desc">Description</label>
                <textarea
                  id="prod-desc"
                  name="description"
                  className="adm-textarea"
                  style={{ minHeight: 80 }}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description shown on the product card"
                />
              </div>

              {/* Sizes */}
              <div className="adm-field">
                <div className="adm-products__sizes-header">
                  <label className="adm-label">
                    Sizes &amp; Prices <span className="adm-req">*</span>
                  </label>
                  <button
                    type="button"
                    className="adm-btn adm-btn--outline adm-btn--sm"
                    onClick={addSize}
                  >
                    + Add size
                  </button>
                </div>

                {errors.sizes && touched.sizes && (
                  <p className="adm-field-error">{errors.sizes}</p>
                )}

                <p className="adm-products__sizes-hint">
                  Leave price blank or 0 to show "Contact us for pricing" on the public page.
                </p>

                <div className="adm-products__sizes-list">
                  <div className="adm-products__sizes-row adm-products__sizes-row--header">
                    <span>Size label</span>
                    <span>Price (USD)</span>
                    <span />
                  </div>
                  {form.sizes.map((s, idx) => (
                    <div key={idx} className="adm-products__sizes-row">
                      <input
                        type="text"
                        className="adm-input"
                        value={s.size}
                        onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                        placeholder="e.g. 5kg"
                        aria-label={`Size label ${idx + 1}`}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="adm-input"
                        value={s.price}
                        onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                        placeholder="0.00"
                        aria-label={`Price for size ${idx + 1}`}
                      />
                      <button
                        type="button"
                        className="adm-btn adm-btn--danger adm-btn--sm"
                        onClick={() => removeSize(idx)}
                        aria-label={`Remove size ${s.size || idx + 1}`}
                        disabled={form.sizes.length === 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: image + publish ── */}
            <div className="adm-products__sidebar">
              {/* Image */}
              <div className="adm-card adm-form">
                <h3 className="adm-products__sidebar-heading">Product photo</h3>

                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Product preview"
                    className="adm-products__preview-img"
                  />
                )}

                <div className="adm-field">
                  <label className="adm-label" htmlFor="prod-imgurl">Image URL</label>
                  <input
                    id="prod-imgurl"
                    name="imageUrl"
                    className="adm-input"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://…"
                  />
                </div>

                <p className="adm-products__or">— or pick from media library —</p>
                <button
                  type="button"
                  className="adm-btn adm-btn--outline adm-btn--sm"
                  style={{ width: '100%' }}
                  onClick={() => setMediaPicker(true)}
                >
                  Browse media
                </button>
              </div>

              {/* Save / delete */}
              <div className="adm-card adm-form">
                <h3 className="adm-products__sidebar-heading">Save</h3>
                <button
                  className="adm-btn adm-btn--primary"
                  style={{ width: '100%' }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create product'}
                </button>
                {editingId && (
                  <button
                    className="adm-btn adm-btn--danger"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => setConfirmId(editingId)}
                  >
                    Delete this product
                  </button>
                )}
                <p className="adm-products__publish-note">
                  {editingId
                    ? 'Saves to the database and updates the public Products page immediately.'
                    : 'Creates the product and adds it to the public Products page immediately.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Media picker modal ── */}
      {mediaPicker && (
        <div
          className="adm-confirm-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Pick image from media library"
          onClick={() => setMediaPicker(false)}
        >
          <div
            className="adm-products__media-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-products__media-modal-header">
              <h3>Media library</h3>
              <button
                className="adm-btn adm-btn--ghost adm-btn--sm"
                onClick={() => setMediaPicker(false)}
              >
                ✕ Close
              </button>
            </div>
            <div className="adm-products__media-grid">
              {images.map((img) => (
                <button
                  key={img.id}
                  className={`adm-products__media-thumb${form.imageUrl === img.url ? ' adm-products__media-thumb--selected' : ''}`}
                  onClick={() => {
                    setForm((f) => ({ ...f, imageUrl: img.url }))
                    setMediaPicker(false)
                  }}
                  title={img.alt}
                >
                  <img src={img.thumbnailUrl || img.url} alt={img.alt} loading="lazy" />
                </button>
              ))}
              {images.length === 0 && (
                <p style={{ gridColumn: '1/-1', color: 'var(--muted)', padding: '1rem' }}>
                  No images in the media library yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm delete ── */}
      {confirmId && (
        <ConfirmDialog
          message="This product will be permanently deleted from the database and removed from the public Products page."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
