import jwt from 'jsonwebtoken'

// protect — admin only (existing behavior, unchanged)
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Not authorized' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// protectVendor — vendor only
export const protectVendor = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Not authorized' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' })
    req.vendor = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}