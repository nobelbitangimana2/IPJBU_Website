'use strict'

const mongoose = require('mongoose')

// Only one document ever exists; routes use findOne / findOneAndUpdate with upsert
const contactSchema = new mongoose.Schema(
  {
    address:     { type: String, default: '' },
    phone:       { type: String, default: '' }, // kept for backward compatibility
    email:       { type: String, default: '' },
    officeHours: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    // New: array of labelled phone numbers
    phones: {
      type: [
        {
          label:  { type: String, default: '' },
          number: { type: String, default: '' },
        },
      ],
      default: [],
    },
    socialLinks: {
      facebook:  { type: String, default: '' },
      twitter:   { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin:  { type: String, default: '' },
      youtube:   { type: String, default: '' },
    },
  },
  { timestamps: true }
)

contactSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Contact', contactSchema)
