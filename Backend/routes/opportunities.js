'use strict'

const express = require('express')
const multer = require('multer')
const { ImageKit } = require('@imagekit/nodejs')
const mongoose = require('mongoose')
const Opportunity = require('../models/Opportunity')
const requireAuth = require('../middleware/auth')

const router = express.Router()
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      return callback(new Error('Only PDF files are accepted.'))
    }
    callback(null, true)
  },
})

let imagekit
function getImageKit() {
  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    })
  }
  return imagekit
}

function isDeprecatedType(type) {
  return typeof type === 'string' && /^offre d['’]emploi$/i.test(type.trim())
}

function validateOpportunity(body, { allowDeprecated = false } = {}) {
  const errors = []
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['A valid opportunity object is required.']
  }
  if (typeof body.title !== 'string' || !body.title.trim()) errors.push('title is required.')
  for (const field of ['description', 'type', 'location', 'applyUrl', 'pdfUrl', 'pdfFileId']) {
    if (body[field] !== undefined && typeof body[field] !== 'string') {
      errors.push(`${field} must be a string.`)
    }
  }
  if (isDeprecatedType(body.type) && !allowDeprecated) {
    errors.push('Offre d’emploi opportunities cannot be published.')
  }
  if (body.deadline !== undefined && body.deadline !== null && body.deadline !== '') {
    if (typeof body.deadline !== 'string' || Number.isNaN(Date.parse(body.deadline))) {
      errors.push('deadline must be a valid date.')
    }
  }
  for (const field of ['applyUrl', 'pdfUrl']) {
    if (typeof body[field] === 'string' && body[field].trim()) {
      try {
        const url = new URL(body[field])
        if (!['http:', 'https:'].includes(url.protocol)) errors.push(`${field} must use HTTP or HTTPS.`)
      } catch {
        errors.push(`${field} must be a valid URL.`)
      }
    }
  }
  if (body.published !== undefined && typeof body.published !== 'boolean') {
    errors.push('published must be a boolean.')
  }
  if (body.order !== undefined && (!Number.isFinite(body.order) || typeof body.order !== 'number')) {
    errors.push('order must be a finite number.')
  }
  return errors
}

async function deletePdf(fileId) {
  if (fileId) await getImageKit().files.delete(fileId)
}

router.get('/opportunities', async (_req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      $or: [{ published: true }, { published: { $exists: false } }],
      type: { $not: /^\s*offre d['’]emploi\s*$/i },
    }).sort({ order: 1, deadline: 1, createdAt: 1 })
    res.json(opportunities)
  } catch (err) {
    next(err)
  }
})

router.get('/admin/opportunities', requireAuth, async (_req, res, next) => {
  try {
    const opportunities = await Opportunity.find().sort({ order: 1, deadline: 1, createdAt: 1 })
    res.json(opportunities)
  } catch (err) {
    next(err)
  }
})

function handlePdfUpload(req, res, next) {
  pdfUpload.single('pdf')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.code === 'LIMIT_FILE_SIZE' ? 'PDF files must be 10 MB or smaller.' : err.message,
      })
    }
    next()
  })
}

router.post('/admin/opportunities/upload-pdf', requireAuth, handlePdfUpload, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded.' })
    const uploaded = await getImageKit().files.upload({
      file: req.file.buffer.toString('base64'),
      fileName: req.file.originalname,
      folder: '/ipjbu/documents',
    })
    res.status(201).json({ url: uploaded.url, fileId: uploaded.fileId })
  } catch (err) {
    next(err)
  }
})

router.post('/admin/opportunities', requireAuth, async (req, res, next) => {
  try {
    const errors = validateOpportunity(req.body)
    if (errors.length) return res.status(400).json({ error: errors.join(' ') })
    const opportunity = await Opportunity.create(req.body)
    res.status(201).json(opportunity)
  } catch (err) {
    next(err)
  }
})

router.put('/admin/opportunities/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid opportunity id.' })
    }
    const errors = validateOpportunity(req.body, { allowDeprecated: req.body?.published === false })
    if (errors.length) return res.status(400).json({ error: errors.join(' ') })
    const existing = await Opportunity.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Opportunity not found.' })

    const updateData = {
      ...req.body,
      pdfUrl: req.body.pdfUrl ?? existing.pdfUrl,
      pdfFileId: req.body.pdfFileId ?? existing.pdfFileId,
    }
    if (updateData.pdfUrl !== existing.pdfUrl && updateData.pdfFileId === existing.pdfFileId) {
      updateData.pdfFileId = ''
    }
    const pdfChanged = existing.pdfFileId && (
      existing.pdfFileId !== updateData.pdfFileId || existing.pdfUrl !== updateData.pdfUrl
    )
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    if (pdfChanged) await deletePdf(existing.pdfFileId)
    res.json(opportunity)
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/opportunities/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid opportunity id.' })
    }
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id)
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' })
    await deletePdf(opportunity.pdfFileId)
    res.json({ message: 'Opportunity deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
