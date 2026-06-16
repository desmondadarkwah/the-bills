import Collection from '../models/Collection.js'

// GET /api/collections — public
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ active: true }).sort({ order: 1 })
    res.json({ success: true, data: collections })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/collections/all — admin only
export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ order: 1 })
    res.json({ success: true, data: collections })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/collections — admin only
export const createCollection = async (req, res) => {
  try {
    const { name, description, active, order } = req.body
    const image = req.file ? req.file.path : ''
    const collection = await Collection.create({ name, description, image, active, order })
    res.status(201).json({ success: true, data: collection })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/collections/:id — admin only
export const updateCollection = async (req, res) => {
  try {
    const { name, description, active, order } = req.body
    const collection = await Collection.findById(req.params.id)
    if (!collection) return res.status(404).json({ error: 'Collection not found.' })
    const image = req.file ? req.file.path : collection.image
    const updated = await Collection.findByIdAndUpdate(
      req.params.id,
      { name, description, image, active, order },
      { new: true }
    )
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/collections/:id — admin only
export const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Collection deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}