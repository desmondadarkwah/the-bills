import SiteSettings from '../models/SiteSettings.js'

// GET /api/settings — public
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) settings = await SiteSettings.create({})
    res.json({ success: true, data: settings })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/settings — admin only
export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) settings = await SiteSettings.create({})
    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      req.body,
      { new: true }
    )
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}