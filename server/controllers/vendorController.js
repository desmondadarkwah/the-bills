import Vendor from '../models/Vendor.js'
import Product from '../models/Product.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => jwt.sign({ id, role: 'vendor' }, process.env.JWT_SECRET, { expiresIn: '30d' })

// POST /api/vendors/register
export const registerVendor = async (req, res) => {
  try {
    const { shopName, email, password, phone, whatsapp, bio } = req.body
    const exists = await Vendor.findOne({ email })
    if (exists) return res.status(400).json({ error: 'An account with this email already exists.' })
    const vendor = await Vendor.create({ shopName, email, password, phone, whatsapp, bio })
    res.status(201).json({
      success: true,
      message: 'Account created. Your shop is pending admin approval.',
      vendor: { id: vendor._id, shopName: vendor.shopName, email: vendor.email, status: vendor.status },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/vendors/login
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body
    const vendor = await Vendor.findOne({ email })
    if (!vendor || !(await vendor.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' })
    if (vendor.status === 'pending')
      return res.status(403).json({ error: 'Your shop is still pending admin approval.' })
    if (vendor.status === 'rejected')
      return res.status(403).json({ error: 'Your vendor application was not approved.' })
    if (vendor.status === 'suspended')
      return res.status(403).json({ error: 'Your shop has been suspended. Contact support.' })
    res.json({
      success: true,
      token: generateToken(vendor._id),
      vendor: { id: vendor._id, shopName: vendor.shopName, email: vendor.email, logo: vendor.logo, verified: vendor.verified },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/vendors/me — vendor only
export const getVendorMe = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select('-password')
    res.json({ success: true, vendor })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/vendors/:id — public storefront
export const getVendorPublic = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password -email')
    if (!vendor || vendor.status !== 'approved') return res.status(404).json({ error: 'Shop not found.' })
    const products = await Product.find({ vendor: vendor._id, available: true }).sort({ createdAt: -1 })
    res.json({ success: true, vendor, products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── ADMIN-ONLY VENDOR MANAGEMENT ─────────────────────

// GET /api/vendors/all — admin only
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password').sort({ createdAt: -1 })
    res.json({ success: true, data: vendors })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/vendors/:id/status — admin only (approve/reject/suspend)
export const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status))
      return res.status(400).json({ error: 'Invalid status.' })
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password')
    res.json({ success: true, data: vendor })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/vendors/:id/verify — admin only
export const toggleVendorVerified = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
    vendor.verified = !vendor.verified
    await vendor.save()
    res.json({ success: true, data: vendor })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/vendors/:id — admin only
export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id)
    await Product.deleteMany({ vendor: req.params.id })
    res.json({ success: true, message: 'Vendor and their products removed.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/vendors/me/update — vendor updates own profile
export const updateVendorProfile = async (req, res) => {
  try {
    const { shopName, phone, whatsapp, bio } = req.body
    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      { shopName, phone, whatsapp, bio },
      { new: true }
    ).select('-password')
    res.json({ success: true, vendor })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/vendors/me/password — vendor changes own password
export const changeVendorPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const vendor = await Vendor.findById(req.vendor.id)
    if (!(await vendor.matchPassword(currentPassword)))
      return res.status(400).json({ error: 'Current password is incorrect.' })
    vendor.password = newPassword
    await vendor.save()
    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}