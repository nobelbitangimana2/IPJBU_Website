'use strict'

const express     = require('express')
const Update      = require('../models/Update')
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
    const { title, date, excerpt, body, imageUrl, category } = req.body
    if (!title || !date || !excerpt || !body) {
      return res.status(400).json({ error: 'title, date, excerpt, and body are required.' })
    }
    const update = await Update.create({ title, date, excerpt, body, imageUrl, category })
    res.status(201).json(update)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/updates/:id — edit */
router.put('/admin/updates/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, date, excerpt, body, imageUrl, category } = req.body
    const update = await Update.findByIdAndUpdate(
      req.params.id,
      { title, date, excerpt, body, imageUrl, category },
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
