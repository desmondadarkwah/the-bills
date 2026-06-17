import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

import { setupAdmin, loginAdmin, getMe, changePassword, addAdmin, getAdmins, deleteAdmin } from '../controllers/authController.js'
import { getProducts, getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { getCollections, getAllCollections, createCollection, updateCollection, deleteCollection } from '../controllers/collectionController.js'
import { getSettings, updateSettings } from '../controllers/settingsController.js'

const router = express.Router()

// console.log('setupAdmin type:', typeof setupAdmin)
// ─── HEALTH ───────────────────────────────────────────
router.get('/health', (req, res) => res.json({ message: 'The Bills server is running ✅' }))

// ─── AUTH ─────────────────────────────────────────────
router.post('/auth/setup', setupAdmin)
router.post('/auth/login', loginAdmin)
router.get('/auth/me', protect, getMe)
router.put('/auth/change-password', protect, changePassword)
router.post('/auth/add-admin', protect, addAdmin)
router.get('/auth/admins', protect, getAdmins)
router.delete('/auth/admins/:id', protect, deleteAdmin)

// ─── PRODUCTS ─────────────────────────────────────────
router.get('/products', getProducts)
router.get('/products/all', protect, getAllProducts)
router.post('/products', protect, upload.array('images', 5), createProduct)
router.put('/products/:id', protect, upload.array('images', 5), updateProduct)
router.delete('/products/:id', protect, deleteProduct)

// ─── COLLECTIONS ──────────────────────────────────────
router.get('/collections', getCollections)
router.get('/collections/all', protect, getAllCollections)
router.post('/collections', protect, upload.single('image'), createCollection)
router.put('/collections/:id', protect, upload.single('image'), updateCollection)
router.delete('/collections/:id', protect, deleteCollection)

// ─── SETTINGS ─────────────────────────────────────────
router.get('/settings', getSettings)
router.put('/settings', protect, updateSettings)

export default router


