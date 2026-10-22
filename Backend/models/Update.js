'use strict'

const mongoose = require('mongoose')

const updateSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    date:     { type: String, required: true },          // stored as YYYY-MM-DD string to match frontend
    excerpt:  { type: String, required: true, trim: true },
    body:     { type: String, required: true },
    imageUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['agriculture', 'formation', 'partenariats', 'communauté', 'infrastructure', 'général',
             // backward compat with old English values:
             'training', 'partnerships', 'community', 'general'],
      default: 'général',
    },
  },
  { timestamps: true }
)

// Virtual `id` field that mirrors `_id` as a plain string
updateSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Update', updateSchema)
