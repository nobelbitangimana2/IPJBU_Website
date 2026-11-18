'use strict'

const express      = require('express')
const SiteContent  = require('../models/SiteContent')
const requireAuth  = require('../middleware/auth')

const router = express.Router()

function normalizePartners(partners) {
  return (Array.isArray(partners) ? partners : [])
    .map((partner) => typeof partner === 'string' ? { name: partner } : partner)
    .filter((partner) => partner && typeof partner.name === 'string' && partner.name.trim())
    .map((partner) => ({
      name: partner.name.trim(),
      logoUrl: typeof partner.logoUrl === 'string' ? partner.logoUrl.trim() : '',
      websiteUrl: typeof partner.websiteUrl === 'string' ? partner.websiteUrl.trim() : '',
    }))
}

function normalizeDonationMethods(methods) {
  return (Array.isArray(methods) ? methods : [])
    .filter((method) => typeof method === 'string')
    .map((method) => method.trim())
    .filter(Boolean)
}

/** GET /api/content — public */
router.get('/content', async (req, res, next) => {
  try {
    const content = await SiteContent.findOne()
    res.json(content
      ? {
        ...content.toJSON(),
        partners: normalizePartners(content.partners),
        donationMethods: normalizeDonationMethods(content.donationMethods),
      }
      : { mission: '', vision: '', partners: [], donationMethods: [] })
  } catch (err) {
    next(err)
  }
})

/** PUT /api/admin/content — admin only */
router.put('/admin/content', requireAuth, async (req, res, next) => {
  try {
    const { mission, vision, partners } = req.body
    const donationMethods = req.body.donationMethods
    if (!mission || !vision) {
      return res.status(400).json({ error: 'Both mission and vision are required.' })
    }
    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: 'Partners must be provided as a list.' })
    }
    const cleanedPartners = normalizePartners(partners)
    if (cleanedPartners.length !== partners.length) {
      return res.status(400).json({ error: 'Chaque partenaire doit avoir un nom.' })
    }
    if (donationMethods !== undefined && !Array.isArray(donationMethods)) {
      return res.status(400).json({ error: 'Donation methods must be provided as a list.' })
    }
    const cleanedDonationMethods = normalizeDonationMethods(donationMethods)
    if (donationMethods && cleanedDonationMethods.length !== donationMethods.length) {
      return res.status(400).json({ error: 'Donation methods must be text values.' })
    }
    const update = { mission, vision, partners: cleanedPartners }
    if (donationMethods !== undefined) update.donationMethods = cleanedDonationMethods
    const content = await SiteContent.findOneAndUpdate(
      {},
      update,
      { new: true, upsert: true, runValidators: true }
    )
    res.json(content)
  } catch (err) {
    next(err)
  }
})

module.exports = router
