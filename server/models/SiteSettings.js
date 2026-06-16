import mongoose from 'mongoose'

const siteSettingsSchema = new mongoose.Schema({
  brandName: { type: String, default: 'The Bills' },
  tagline: { type: String, default: 'Crafted for the world, rooted in tradition.' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  about: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('SiteSettings', siteSettingsSchema)