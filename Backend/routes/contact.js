'use strict'

const express     = require('express')
const { Resend }  = require('resend')
const Contact     = require('../models/Contact')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// ── Resend client (lazy — reads env at request time) ──────────────────────────
let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

/** GET /api/contact — public */
router.get('/contact', async (req, res, next) => {
  try {
    const contact = await Contact.findOne()
    res.json(contact || {})
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/contact/submit — public contact form
 * Sends via Resend HTTP API.
 * Recipient is read exclusively from the EMAIL_TO environment variable.
 */
router.post('/contact/submit', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Le nom, l\'e-mail et le message sont requis.' })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY n\'est pas défini.')
      return res.status(500).json({ error: 'Le service d\'envoi d\'e-mail n\'est pas configuré.' })
    }

    if (!process.env.EMAIL_TO) {
      console.error('EMAIL_TO n\'est pas défini.')
      return res.status(500).json({ error: 'L\'adresse de destination n\'est pas configurée.' })
    }

    const { error } = await getResend().emails.send({
      from:     'IPJBU Site Web <onboarding@resend.dev>',
      to:       [process.env.EMAIL_TO],
      replyTo:  email,
      subject:  `Nouveau message depuis le formulaire de contact – ${name}`,
      html: `
        <h2 style="color:#005f33">Nouveau message depuis le formulaire de contact de l'IPJBU</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>E-mail :</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-line;background:#f4f6f8;padding:1rem;border-radius:4px">${message}</p>
        <hr/>
        <p style="color:#666;font-size:12px">Envoyé depuis le formulaire de contact du site IPJBU – DUHINDURINGENDO.</p>
      `,
    })

    if (error) {
      console.error('Erreur Resend :', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Erreur d\'envoi d\'e-mail :', err.message)
    return res.status(500).json({ error: err.message })
  }
})

/** PUT /api/admin/contact — admin only */
router.put('/admin/contact', requireAuth, async (req, res, next) => {
  try {
    const { address, phone, email, officeHours, mapEmbedUrl, phones, socialLinks } = req.body
    const contact = await Contact.findOneAndUpdate(
      {},
      { address, phone, email, officeHours, mapEmbedUrl, phones: phones || [], socialLinks },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(contact)
  } catch (err) {
    next(err)
  }
})

module.exports = router
