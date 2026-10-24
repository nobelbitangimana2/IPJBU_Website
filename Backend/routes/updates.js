'use strict'

const express     = require('express')
const Update      = require('../models/Update')
const Category    = require('../models/Category')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

/** GET /api/updates — all updates, newest first */
router.get('/updates', async (req, res, next) => {
  try {
    const updates = await Update.find().sort({ date: -1, createdAt: -1 })
    res.json(updates)
  } catch (err) {
    next(err)
  }
})

/** GET /api/updates/:id — single update */
router.get('/updates/:id', async (req, res, next) => {
  try {
    const update = await Update.findById(req.params.id)
    if (!update) return res.status(404).json({ error: 'Update not found.' })
    res.json(update)
  } catch (err) {
    next(err)
  }
})

// ── ADMIN ──────────────────────────────────────────────────────────────────────

/** POST /api/admin/updates — create */
router.post('/admin/updates', requireAuth, async (req, res, next) => {
  try {
    const { title, date, excerpt, imageUrl, category } = req.body
    if (req.body.blocks !== undefined && !Array.isArray(req.body.blocks)) {
      return res.status(400).json({ error: 'Les blocs de contenu doivent être une liste.' })
    }
    const blocks = Array.isArray(req.body.blocks) ? req.body.blocks : []
    if (blocks.some((block) => !block || !['paragraph', 'heading', 'image'].includes(block.type))) {
      return res.status(400).json({ error: 'Un ou plusieurs blocs ont un type invalide.' })
    }
    if (blocks.some((block) => (
      (block.type === 'image' && !(typeof block.imageUrl === 'string' && block.imageUrl.trim())) ||
      (block.type !== 'image' && !(typeof block.text === 'string' && block.text.trim()))
    ))) {
      return res.status(400).json({ error: 'Chaque bloc doit contenir son texte ou son image.' })
    }
    const body = blocks.length
      ? blocks.filter((block) => block.type === 'paragraph').map((block) => block.text || '').filter(Boolean).join('\n\n')
      : (typeof req.body.body === 'string' ? req.body.body : '')
    if (!title || !date || !excerpt || (!body.trim() && !blocks.length)) {
      return res.status(400).json({ error: 'title, date, excerpt, and article content are required.' })
    }
    if (!await Category.exists({ slug: category || 'général' })) {
      return res.status(400).json({ error: 'La catégorie sélectionnée est introuvable.' })
    }
    const update = await Update.create({ title, date, excerpt, body, blocks, imageUrl, category })
    res.status(201).json(update)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/updates/:id — edit */
router.put('/admin/updates/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, date, excerpt, imageUrl, category } = req.body
    if (req.body.blocks !== undefined && !Array.isArray(req.body.blocks)) {
      return res.status(400).json({ error: 'Les blocs de contenu doivent être une liste.' })
    }
    const blocks = Array.isArray(req.body.blocks) ? req.body.blocks : []
    if (blocks.some((block) => !block || !['paragraph', 'heading', 'image'].includes(block.type))) {
      return res.status(400).json({ error: 'Un ou plusieurs blocs ont un type invalide.' })
    }
    if (blocks.some((block) => (
      (block.type === 'image' && !(typeof block.imageUrl === 'string' && block.imageUrl.trim())) ||
      (block.type !== 'image' && !(typeof block.text === 'string' && block.text.trim()))
    ))) {
      return res.status(400).json({ error: 'Chaque bloc doit contenir son texte ou son image.' })
    }
    const body = blocks.length
      ? blocks.filter((block) => block.type === 'paragraph').map((block) => block.text || '').filter(Boolean).join('\n\n')
      : (typeof req.body.body === 'string' ? req.body.body : '')
    if (!title || !date || !excerpt || (!body.trim() && !blocks.length)) {
      return res.status(400).json({ error: 'title, date, excerpt, and article content are required.' })
    }
    if (!await Category.exists({ slug: category || 'général' })) {
      return res.status(400).json({ error: 'La catégorie sélectionnée est introuvable.' })
    }
    const update = await Update.findByIdAndUpdate(
      req.params.id,
      { title, date, excerpt, body, blocks, imageUrl, category },
      { new: true, runValidators: true }
    )
    if (!update) return res.status(404).json({ error: 'Update not found.' })
    res.json(update)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/admin/updates/:id */
router.delete('/admin/updates/:id', requireAuth, async (req, res, next) => {
  try {
    const update = await Update.findByIdAndDelete(req.params.id)
    if (!update) return res.status(404).json({ error: 'Update not found.' })
    res.json({ message: 'Update deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
