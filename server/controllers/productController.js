import Product from '../models/Product.js'

// GET /api/products — public (available only)
export const getProducts = async (req, res) => {
  try {
    const { category, collection } = req.query
    const filter = { available: true }
    if (category) filter.category = category
    if (collection) filter.collection = collection
    const products = await Product.find(filter).sort({ order: 1, createdAt: -1 }).populate('vendor', 'shopName logo verified status')
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/products/all — admin only (sees everything)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 }).populate('vendor', 'shopName logo')
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/products/mine — vendor only (sees only their own)
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.vendor.id }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/products — admin (no vendor field = main brand product)
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

// POST /api/products/vendor — vendor only (auto-tags with vendor id)
export const createVendorProduct = async (req, res) => {
  try {
    const { name, description, price, category, collection, available, order } = req.body
    const images = req.files ? req.files.map(f => f.path) : []
    const product = await Product.create({
      name, description, price, category, collection, images, available, order,
      vendor: req.vendor.id,
      featured: false, // vendors cannot self-feature
    })
    res.status(201).json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/products/:id — admin only (can edit ANY product)
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

// PUT /api/products/vendor/:id — vendor only (can ONLY edit their own)
export const updateVendorProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    if (!product.vendor || product.vendor.toString() !== req.vendor.id)
      return res.status(403).json({ error: 'You can only edit your own products.' })

    const { name, description, price, category, collection, available, order } = req.body
    const newImages = req.files ? req.files.map(f => f.path) : []
    const images = newImages.length > 0 ? newImages : product.images
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, collection, images, available, order },
      { new: true }
    )
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/products/:id — admin only (can delete ANY product)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/products/vendor/:id — vendor only (can ONLY delete their own)
export const deleteVendorProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    if (!product.vendor || product.vendor.toString() !== req.vendor.id)
      return res.status(403).json({ error: 'You can only delete your own products.' })
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/products/:id/view — public (track product view)
export const trackProductView = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/products/:id/click — public (track WhatsApp/DM click)
export const trackProductClick = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}