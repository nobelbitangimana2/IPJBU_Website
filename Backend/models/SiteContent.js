'use strict'

const mongoose = require('mongoose')

// Single-document collection — one record holds all editable site text
const siteContentSchema = new mongoose.Schema(
  {
    mission: {
      type: String,
      default: 'Promouvoir l\'autopromotion de la jeunesse et des femmes vulnérables par le développement agro-pastoral durable.',
    },
    vision: {
      type: String,
      default: 'Une jeunesse autonome, solidaire et actrice du développement socio-économique du Burundi.',
    },
    partners: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
)

siteContentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('SiteContent', siteContentSchema)
