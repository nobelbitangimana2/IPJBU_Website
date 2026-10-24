'use strict'

const express = require('express')
const Category = require('../models/Category')
const Update = require('../models/Update')
const requireAuth = require('../middleware/auth')

const router = express.Router()

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

router.get('/categories', async (_req, res, next) => {
  try {
    res.json(await Category.find().sort({ name: 1 }))
  } catch (err) {
    next(err)
  }
})

router.post('/admin/categories', requireAuth, async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    if (!name) return res.status(400).json({ error: 'Le nom de la catégorie est requis.' })
    const slug = slugify(req.body.slug || name)
    if (!slug) return res.status(400).json({ error: 'Le nom ne permet pas de créer un identifiant valide.' })
    const category = await Category.create({ name, slug })
    res.status(201).json(category)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Cette catégorie existe déjà.' })
    next(err)
  }
})

router.put('/admin/categories/:id', requireAuth, async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    if (!name) return res.status(400).json({ error: 'Le nom de la catégorie est requis.' })
    const category = await Category.findByIdAndUpdate(
      req.params.id, { name }, { new: true, runValidators: true }
    )
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable.' })
    res.json(category)
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/categories/:id', requireAuth, async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable.' })
    const articleCount = await Update.countDocuments({ category: category.slug })
    if (articleCount) {
      return res.status(409).json({
        error: `Impossible de supprimer cette catégorie : ${articleCount} actualité(s) y sont encore associée(s).`,
      })
    }
    await category.deleteOne()
    res.json({ message: 'Catégorie supprimée.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
