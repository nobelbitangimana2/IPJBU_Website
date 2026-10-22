'use strict'

const express     = require('express')
const multer      = require('multer')
const sharp       = require('sharp')
const { ImageKit }  = require('@imagekit/nodejs')
const Image       = require('../models/Image')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── ImageKit client (lazy — reads env vars at request time, not module load) ──
let _imagekit = null
function getImageKit() {
  if (!_imagekit) {
    _imagekit = new ImageKit({
      publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    })
  }
  return _imagekit
}

// ── Multer — memory storage so Sharp can process before upload ─────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are accepted.'))
    }
    cb(null, true)
  },
})

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/media
 * Returns all images sorted by order then createdAt.
 * URLs are already absolute (stored as ImageKit CDN URLs).
 */
router.get('/media', async (req, res, next) => {
  try {
    const images = await Image.find().sort({ order: 1, createdAt: -1 })
    res.json(images)
  } catch (err) {
    next(err)
  }
})

// ── ADMIN ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/media/upload
 * Field: `image` (single file), body: { category, alt }
 *
 * Pipeline:
 *  1. Multer reads file into memory buffer
 *  2. Sharp → resize to max 1600px → WebP quality 82  (full size)
 *  3. Sharp → resize to max 400px  → WebP quality 75  (thumbnail)
 *  4. Upload both buffers to ImageKit
 *  5. Save returned CDN URLs to MongoDB
 */
router.post('/admin/media/upload', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

    const basename = `${Date.now()}-${Math.random().toString(36).slice(2)}`

    // Process full-size
    const fullBuffer = await sharp(req.file.buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    // Process thumbnail
    const thumbBuffer = await sharp(req.file.buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()

    // Upload full-size to ImageKit (buffer must be base64 encoded)
    const fullUpload = await getImageKit().files.upload({
      file:     fullBuffer.toString('base64'),
      fileName: `${basename}.webp`,
      folder:   '/ipjbu/media',
    })

    // Upload thumbnail to ImageKit
    const thumbUpload = await getImageKit().files.upload({
      file:     thumbBuffer.toString('base64'),
      fileName: `${basename}_thumb.webp`,
      folder:   '/ipjbu/thumbnails',
    })

    const image = await Image.create({
      url:          fullUpload.url,
      thumbnailUrl: thumbUpload.url,
      alt:          req.body.alt      || '',
      category:     req.body.category || 'general',
      order:        0,
      // Store ImageKit file IDs for deletion later
      imagekitFileId:      fullUpload.fileId,
      imagekitThumbFileId: thumbUpload.fileId,
    })

    res.status(201).json(image)
  } catch (err) {
    console.error('Upload error:', err.message, err.stack)
    next(err)
  }
})

/**
 * PATCH /api/admin/media/:id
 * Body: { alt, category, order }
 */
router.patch('/admin/media/:id', requireAuth, async (req, res, next) => {
  try {
    const allowed = {}
    if (req.body.alt      !== undefined) allowed.alt      = req.body.alt
    if (req.body.category !== undefined) allowed.category = req.body.category
    if (req.body.order    !== undefined) allowed.order    = req.body.order

    const image = await Image.findByIdAndUpdate(req.params.id, allowed, { new: true })
    if (!image) return res.status(404).json({ error: 'Image not found.' })
    res.json(image)
  } catch (err) {
    next(err)
  }
})

/**
 * PUT /api/admin/media/reorder
 * Body: { ids } — ordered array of image IDs
 */
router.put('/admin/media/reorder', requireAuth, async (req, res, next) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids)) return res.status(400).json({ error: '`ids` array required.' })

    const ops = ids.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { order: idx } },
    }))
    await Image.bulkWrite(ops)
    res.json({ message: 'Order updated.' })
  } catch (err) {
    next(err)
  }
})

/**
 * DELETE /api/admin/media/:id
 * Deletes from ImageKit and removes the DB record.
 */
router.delete('/admin/media/:id', requireAuth, async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id)
    if (!image) return res.status(404).json({ error: 'Image not found.' })

    // Delete from ImageKit (ignore errors if already gone)
    const deleteIds = [image.imagekitFileId, image.imagekitThumbFileId].filter(Boolean)
    if (deleteIds.length) {
      try {
        for (const fileId of deleteIds) {
          await getImageKit().files.delete(fileId)
        }
      } catch (e) {
        console.warn('ImageKit delete warning:', e.message)
      }
    }

    res.json({ message: 'Image deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
