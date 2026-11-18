'use strict'

const mongoose = require('mongoose')

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    deadline: { type: Date, default: null },
    applyUrl: { type: String, default: '', trim: true },
    pdfUrl: { type: String, default: '' },
    pdfFileId: { type: String, default: '' },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

opportunitySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Opportunity', opportunitySchema)
