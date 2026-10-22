'use strict'

const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema(
  {
    size:  { type: String, required: true, trim: true }, // e.g. "1kg", "5kg"
    price: { type: Number, default: 0 },                 // 0 = "Contact us for pricing"
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl:    { type: String, default: '' },
    sizes:       { type: [sizeSchema], default: () => [
      { size: '1kg',   price: 0 },
      { size: '5kg',   price: 0 },
      { size: '10kg',  price: 0 },
      { size: '25kg',  price: 0 },
      { size: '50kg',  price: 0 },
      { size: '100kg', price: 0 },
    ]},
  },
  { timestamps: true }
)

productSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Product', productSchema)
