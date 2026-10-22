'use strict'

const express     = require('express')
const Product     = require('../models/Product')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

/** GET /api/products — all products, newest first */
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    next(err)
  }
})

/** GET /api/products/:id — single product */
router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

// ── ADMIN ──────────────────────────────────────────────────────────────────────

/** POST /api/admin/products — create */
router.post('/admin/products', requireAuth, async (req, res, next) => {
  try {
    const { name, description, imageUrl, sizes } = req.body
    if (!name) return res.status(400).json({ error: 'name is required.' })
    const product = await Product.create({ name, description, imageUrl, sizes })
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/products/:id — edit */
router.put('/admin/products/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, description, imageUrl, sizes } = req.body
    if (!name) return res.status(400).json({ error: 'name is required.' })
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl, sizes },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/admin/products/:id */
router.delete('/admin/products/:id', requireAuth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json({ message: 'Product deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
