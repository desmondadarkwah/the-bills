import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '30d' })

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required.' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'An account with this email already exists.' })
    const user = await User.create({ name, email, password })
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, wishlist: user.wishlist },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).populate('wishlist')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' })
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, wishlist: user.wishlist },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/users/me
export const getUserMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('wishlist')
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/users/wishlist/add
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist')
    res.json({ success: true, wishlist: user.wishlist })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/users/wishlist/remove
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist')
    res.json({ success: true, wishlist: user.wishlist })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/users/wishlist/sync — merges localStorage wishlist into DB on login
export const syncWishlist = async (req, res) => {
  try {
    const { productIds } = req.body
    if (!productIds?.length) {
      const user = await User.findById(req.user.id).populate('wishlist')
      return res.json({ success: true, wishlist: user.wishlist })
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: { $each: productIds } } },
      { new: true }
    ).populate('wishlist')
    res.json({ success: true, wishlist: user.wishlist })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/users/all — admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/users/:id — admin only
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}