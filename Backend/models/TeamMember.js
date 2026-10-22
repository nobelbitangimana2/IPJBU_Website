'use strict'

const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    role:     { type: String, required: true, trim: true },
    bio:      { type: String, default: '', trim: true },
    photoUrl: { type: String, default: '' },
    imagekitFileId:      { type: String, default: '' },
    imagekitThumbFileId: { type: String, default: '' },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
)

teamMemberSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('TeamMember', teamMemberSchema)
