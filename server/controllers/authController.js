import Admin from '../models/Admin.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// POST /api/auth/setup — Create first admin
export const setupAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne()
    if (exists) return res.status(400).json({ error: 'Admin already exists.' })
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' })
    const admin = await Admin.create({ email, password })
    res.status(201).json({ success: true, token: generateToken(admin._id), admin: { id: admin._id, email: admin.email } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/auth/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' })
    res.json({ success: true, token: generateToken(admin._id), admin: { id: admin._id, email: admin.email } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password')
    res.json({ success: true, admin })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const admin = await Admin.findById(req.admin.id)
    if (!(await admin.matchPassword(currentPassword)))
      return res.status(400).json({ error: 'Current password is incorrect.' })
    admin.password = newPassword
    await admin.save()
    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/auth/add-admin
export const addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const exists = await Admin.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Admin with this email already exists.' })
    const admin = await Admin.create({ email, password })
    res.status(201).json({ success: true, admin: { id: admin._id, email: admin.email } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/auth/admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 })
    res.json({ success: true, data: admins })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/auth/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    if (req.admin.id === req.params.id)
      return res.status(400).json({ error: 'You cannot delete yourself.' })
    await Admin.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Admin removed.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}