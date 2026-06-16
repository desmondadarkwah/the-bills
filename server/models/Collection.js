import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  image: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Collection', collectionSchema)