'use strict'

const mongoose = require('mongoose')

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['paragraph', 'heading', 'image'], required: true },
    text: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
)

const updateSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    date:     { type: String, required: true },          // stored as YYYY-MM-DD string to match frontend
    excerpt:  { type: String, required: true, trim: true },
    body:     { type: String, default: '' },
    blocks:   { type: [blockSchema], default: [] },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: 'général' },
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
