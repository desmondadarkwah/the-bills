import Review from '../models/Review.js'
import Product from '../models/Product.js'

// POST /api/reviews — public (submit review)
export const createReview = async (req, res) => {
  try {
    const { product, name, rating, comment } = req.body
    if (!product || !rating || !comment)
      return res.status(400).json({ error: 'Rating and Comment are required.' })
    const exists = await Product.findById(product)
    if (!exists) return res.status(404).json({ error: 'Product not found.' })
    const review = await Review.create({ product, name, rating, comment })
    res.status(201).json({ success: true, data: review })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/reviews/:productId — public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, approved: true }).sort({ createdAt: -1 })
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0
    res.json({ success: true, data: reviews, avg: Number(avg), total: reviews.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/reviews — admin only (all reviews)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product', 'name').sort({ createdAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/reviews/:id — admin only
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Review deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}