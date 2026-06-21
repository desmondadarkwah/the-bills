import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const vendorSchema = new mongoose.Schema({
  shopName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  bio: { type: String, default: '' },
  logo: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  verified: { type: Boolean, default: false },
}, { timestamps: true })

vendorSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

vendorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('Vendor', vendorSchema)