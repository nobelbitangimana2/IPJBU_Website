/**
 * DataContext — real API-backed data store.
 *
 * All state is fetched from the Express backend on mount.
 * Admin writes call the API then refresh the relevant slice of state.
 *
 * The public site reads from this context so admin changes are
 * immediately reflected without a page reload.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import api from '../services/api'
import { GALLERY_CATEGORIES } from '../data/galleryCategories'

const DataContext = createContext(null)

// ── Fallback defaults (shown while loading or if API unreachable) ─────────────
const DEFAULT_CONTENT = {
  mission: 'Promouvoir l\'autopromotion de la jeunesse et des femmes vulnérables par le développement agro-pastoral durable.',
  vision: 'Une jeunesse autonome, solidaire et actrice du développement socio-économique du Burundi.',
  partners: [],
}
const DEFAULT_CONTACT = {
  address: '', phone: '', email: '', officeHours: '',
  phones: [],
  socialLinks: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
  mapEmbedUrl: '',
}

function normalizePartner(partner) {
  return typeof partner === 'string' ? { name: partner, logoUrl: '', websiteUrl: '' } : {
    name: partner?.name || '',
    logoUrl: partner?.logoUrl || '',
    websiteUrl: partner?.websiteUrl || '',
  }
}

export function DataProvider({ children }) {
  const [images,   setImages]   = useState([])
  const [updates,  setUpdates]  = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [team,     setTeam]     = useState([])
  const [content,  setContent]  = useState(DEFAULT_CONTENT)
  const [contact,  setContact]  = useState(DEFAULT_CONTACT)

  // Public gallery / Home images: only whitelisted categories.
  // Article images ('updates'), partner logos ('partners'), etc. are excluded by default.
  const galleryImages = useMemo(
    () => images.filter((img) => GALLERY_CATEGORIES.includes(img.category)),
    [images]
  )

  // ── Initial load ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [imgsRes, updsRes, prodsRes, teamRes, contRes, ctctRes, catsRes] = await Promise.allSettled([
        api.get('/api/media'),
        api.get('/api/updates'),
        api.get('/api/products'),
        api.get('/api/team'),
        api.get('/api/content'),
        api.get('/api/contact'),
        api.get('/api/categories'),
      ])
      if (imgsRes.status  === 'fulfilled') setImages(imgsRes.value.data)
      if (updsRes.status  === 'fulfilled') setUpdates(updsRes.value.data)
      if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value.data)
      if (teamRes.status  === 'fulfilled') setTeam(teamRes.value.data)
      if (contRes.status  === 'fulfilled') {
        const loadedContent = contRes.value.data || DEFAULT_CONTENT
        setContent({ ...loadedContent, partners: (loadedContent.partners || []).map(normalizePartner) })
      }
      if (ctctRes.status  === 'fulfilled') setContact(ctctRes.value.data || DEFAULT_CONTACT)
      if (catsRes.status === 'fulfilled') setCategories(catsRes.value.data)
    } catch (err) {
      console.error('DataContext initial load error:', err)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Image actions ─────────────────────────────────────────────────────────────

  /** Upload a File object. Returns the new image record. */
  async function addImage(file, category = 'general', alt = '') {
    const fd = new FormData()
    fd.append('image', file)
    fd.append('category', category)
    fd.append('alt', alt)
    const res = await api.post('/api/admin/media/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    setImages((prev) => [...prev, res.data])
    return res.data
  }

  async function uploadTeamPhoto(file) {
    const fd = new FormData()
    fd.append('image', file)
    const res = await api.post('/api/admin/team/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  }

  async function deleteImage(id) {
    await api.delete(`/api/admin/media/${id}`)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function updateImage(id, patch) {
    const res = await api.patch(`/api/admin/media/${id}`, patch)
    setImages((prev) => prev.map((img) => (img.id === id ? res.data : img)))
  }

  /** Reorder within a category — optimistic update + server sync */
  async function reorderImages(category, fromIndex, toIndex) {
    setImages((prev) => {
      const inCat  = prev.filter((i) => i.category === category)
      const moved  = [...inCat]
      const [item] = moved.splice(fromIndex, 1)
      moved.splice(toIndex, 0, item)
      let catCursor = 0
      return prev.map((img) => img.category === category ? moved[catCursor++] : img)
    })
    // Persist new order
    const ordered = images
      .filter((i) => i.category === category)
    const newOrder = [...ordered]
    const [item]   = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, item)
    await api.put('/api/admin/media/reorder', { ids: newOrder.map((i) => i.id) })
  }

  // ── Update actions ────────────────────────────────────────────────────────────

  async function addUpdate(updateData) {
    const res = await api.post('/api/admin/updates', updateData)
    setUpdates((prev) => [res.data, ...prev])
    return res.data
  }

  async function editUpdate(id, patch) {
    const res = await api.put(`/api/admin/updates/${id}`, patch)
    setUpdates((prev) => prev.map((u) => (u.id === id ? res.data : u)))
    return res.data
  }

  async function deleteUpdate(id) {
    await api.delete(`/api/admin/updates/${id}`)
    setUpdates((prev) => prev.filter((u) => u.id !== id))
  }

  async function addCategory(data) {
    const res = await api.post('/api/admin/categories', data)
    setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name, 'fr')))
    return res.data
  }

  async function updateCategory(id, data) {
    const res = await api.put(`/api/admin/categories/${id}`, data)
    setCategories((prev) => prev.map((category) => category.id === id ? res.data : category)
      .sort((a, b) => a.name.localeCompare(b.name, 'fr')))
    return res.data
  }

  async function deleteCategory(id) {
    await api.delete(`/api/admin/categories/${id}`)
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }

  // ── Content actions ───────────────────────────────────────────────────────────

  async function saveContent(patch) {
    const res = await api.put('/api/admin/content', {
      ...patch,
      partners: (patch.partners || []).map(normalizePartner),
    })
    const saved = { ...res.data, partners: (res.data.partners || []).map(normalizePartner) }
    setContent(saved)
    return saved
  }

  // ── Contact actions ───────────────────────────────────────────────────────────

  async function saveContact(patch) {
    const res = await api.put('/api/admin/contact', patch)
    setContact(res.data)
    return res.data
  }

  // ── Product actions ───────────────────────────────────────────────────────────

  async function addProduct(data) {
    const res = await api.post('/api/admin/products', data)
    setProducts((prev) => [res.data, ...prev])
    return res.data
  }

  async function editProduct(id, data) {
    const res = await api.put(`/api/admin/products/${id}`, data)
    setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)))
    return res.data
  }

  async function deleteProduct(id) {
    await api.delete(`/api/admin/products/${id}`)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // ── Team actions ─────────────────────────────────────────────────────────────

  async function addTeamMember(data) {
    const res = await api.post('/api/admin/team', data)
    setTeam((prev) => [...prev, res.data])
    return res.data
  }

  async function editTeamMember(id, data) {
    const res = await api.put(`/api/admin/team/${id}`, data)
    setTeam((prev) => prev.map((member) => (member.id === id ? res.data : member)))
    return res.data
  }

  async function deleteTeamMember(id) {
    await api.delete(`/api/admin/team/${id}`)
    setTeam((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <DataContext.Provider value={{
      // State
      images, galleryImages, updates, categories, products, team, content, contact,
      // Image actions
      addImage, deleteImage, updateImage, reorderImages,
      uploadTeamPhoto,
      // Update actions
      addUpdate, editUpdate, deleteUpdate,
      addCategory, updateCategory, deleteCategory,
      // Product actions
      addProduct, editProduct, deleteProduct,
      // Team actions
      addTeamMember, editTeamMember, deleteTeamMember,
      // Content actions
      saveContent,
      // Contact actions
      saveContact,
      // Manual refresh
      refreshAll: fetchAll,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}