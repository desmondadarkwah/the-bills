import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  collection: { type: String, default: '' },
  images: [{ type: String }],
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null }, // null = main brand product
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)