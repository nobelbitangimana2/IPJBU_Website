'use strict'

const express     = require('express')
const multer      = require('multer')
const sharp       = require('sharp')
const { ImageKit } = require('@imagekit/nodejs')
const TeamMember  = require('../models/TeamMember')
const requireAuth = require('../middleware/auth')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are accepted.'))
    cb(null, true)
  },
})

let imagekit = null
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

async function deleteImageKitFiles(member) {
  const ids = [member.imagekitFileId, member.imagekitThumbFileId].filter(Boolean)
  for (const id of ids) {
    try {
      await getImageKit().files.delete(id)
    } catch (err) {
      console.warn('ImageKit team photo delete warning:', err.message)
    }
  }
}

router.get('/team', async (req, res, next) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch (err) {
    next(err)
  }
})

router.post('/admin/team/upload', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })
    const basename = `team-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const fullBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    const thumbBuffer = await sharp(req.file.buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()
    const fullUpload = await getImageKit().files.upload({
      file: fullBuffer.toString('base64'),
      fileName: `${basename}.webp`,
      folder: '/ipjbu/team',
    })
    const thumbUpload = await getImageKit().files.upload({
      file: thumbBuffer.toString('base64'),
      fileName: `${basename}_thumb.webp`,
      folder: '/ipjbu/team/thumbnails',
    })
    res.status(201).json({
      photoUrl: fullUpload.url,
      thumbnailUrl: thumbUpload.url,
      imagekitFileId: fullUpload.fileId,
      imagekitThumbFileId: thumbUpload.fileId,
    })
  } catch (err) {
    next(err)
  }
})

router.post('/admin/team', requireAuth, async (req, res, next) => {
  try {
    const { name, role, bio, photoUrl, imagekitFileId, imagekitThumbFileId } = req.body
    if (!name || !role) return res.status(400).json({ error: 'name and role are required.' })
    const order = await TeamMember.countDocuments()
    const member = await TeamMember.create({ name, role, bio, photoUrl, imagekitFileId, imagekitThumbFileId, order })
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
})

router.put('/admin/team/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, role, bio, photoUrl, imagekitFileId, imagekitThumbFileId } = req.body
    if (!name || !role) return res.status(400).json({ error: 'name and role are required.' })
    const existingMember = await TeamMember.findById(req.params.id)
    if (!existingMember) return res.status(404).json({ error: 'Team member not found.' })
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { name, role, bio, photoUrl, imagekitFileId, imagekitThumbFileId },
      { new: true, runValidators: true }
    )
    const photoChanged = existingMember.imagekitFileId !== imagekitFileId ||
      existingMember.imagekitThumbFileId !== imagekitThumbFileId
    if (photoChanged) await deleteImageKitFiles(existingMember)
    res.json(member)
  } catch (err) {
    next(err)
  }
})

router.delete('/admin/team/:id', requireAuth, async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ error: 'Team member not found.' })
    await deleteImageKitFiles(member)
    res.json({ message: 'Team member deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
