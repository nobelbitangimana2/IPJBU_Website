'use strict'

const express      = require('express')
const SiteContent  = require('../models/SiteContent')
const requireAuth  = require('../middleware/auth')

const router = express.Router()

/** GET /api/content — public */
router.get('/content', async (req, res, next) => {
  try {
    const content = await SiteContent.findOne()
    res.json(content || { mission: '', vision: '', partners: [] })
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/content — admin only */
router.put('/admin/content', requireAuth, async (req, res, next) => {
  try {
    const { mission, vision, partners } = req.body
    if (!mission || !vision) {
      return res.status(400).json({ error: 'Both mission and vision are required.' })
    }
    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: 'Partners must be provided as a list.' })
    }
    const cleanedPartners = partners
      .filter((partner) => typeof partner === 'string')
      .map((partner) => partner.trim())
      .filter(Boolean)
    const content = await SiteContent.findOneAndUpdate(
      {},
      { mission, vision, partners: cleanedPartners },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(content)
  } catch (err) {
    next(err)
  }
})

module.exports = router
