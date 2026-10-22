'use strict'

const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema(
  {
    url:          { type: String, required: true },   // full-size CDN URL from ImageKit
    thumbnailUrl: { type: String, required: true },   // thumbnail CDN URL from ImageKit
    alt:          { type: String, default: '' },
    category:     {
      type: String,
      enum: ['farmland', 'farmers', 'activities', 'harvest', 'infrastructure', 'community', 'general'],
      default: 'general',
    },
    order:               { type: Number, default: 0 },
    imagekitFileId:      { type: String, default: '' }, // used for deletion
    imagekitThumbFileId: { type: String, default: '' }, // used for deletion
  },
  { timestamps: true }
)

imageSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Image', imageSchema)
