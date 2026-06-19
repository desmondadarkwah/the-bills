import Product from '../models/Product.js'

// GET /api/products — public
export const getProducts = async (req, res) => {
  try {
    const { category, collection } = req.query
    const filter = { available: true }
    if (category) filter.category = category
    if (collection) filter.collection = collection
    const products = await Product.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/products/all — admin only
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/products — admin only
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, collection, available, featured, order } = req.body
    const images = req.files ? req.files.map(f => f.path) : []
    const product = await Product.create({ name, description, price, category, collection, images, available, featured, order })
    res.status(201).json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/products/:id — admin only
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, collection, available, featured, order } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    const newImages = req.files ? req.files.map(f => f.path) : []
    const images = newImages.length > 0 ? newImages : product.images
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, collection, images, available, featured, order },
      { new: true }
    )
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/products/:id — admin only
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}