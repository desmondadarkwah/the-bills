import express from 'express'
import { protect, protectVendor } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

import { setupAdmin, loginAdmin, getMe, changePassword, addAdmin, getAdmins, deleteAdmin } from '../controllers/authController.js'
import {
  getProducts, getAllProducts, getMyProducts,
  createProduct, createVendorProduct,
  updateProduct, updateVendorProduct,
  deleteProduct, deleteVendorProduct,
  trackProductView, trackProductClick,
} from '../controllers/productController.js'
import { getCollections, getAllCollections, createCollection, updateCollection, deleteCollection } from '../controllers/collectionController.js'
import { getSettings, updateSettings } from '../controllers/settingsController.js'
import {
  registerVendor, loginVendor, getVendorMe, getVendorPublic,
  getAllVendors, updateVendorStatus, toggleVendorVerified, deleteVendor,  updateVendorProfile, changeVendorPassword,

} from '../controllers/vendorController.js'
import { createReview, getProductReviews, getAllReviews, deleteReview } from '../controllers/reviewController.js'

const router = express.Router()

// ─── HEALTH ───────────────────────────────────────────
router.get('/health', (req, res) => res.json({ message: 'The Bills server is running ✅' }))

// ─── ADMIN AUTH ───────────────────────────────────────
router.post('/auth/setup', setupAdmin)
router.post('/auth/login', loginAdmin)
router.get('/auth/me', protect, getMe)
router.put('/auth/change-password', protect, changePassword)
router.post('/auth/add-admin', protect, addAdmin)
router.get('/auth/admins', protect, getAdmins)
router.delete('/auth/admins/:id', protect, deleteAdmin)

// ─── VENDOR AUTH ──────────────────────────────────────
router.post('/vendors/register', registerVendor)
router.post('/vendors/login', loginVendor)
router.get('/vendors/me', protectVendor, getVendorMe)
router.put('/vendors/me/update', protectVendor, updateVendorProfile)
router.put('/vendors/me/password', protectVendor, changeVendorPassword)
router.get('/vendors/:id', getVendorPublic)

// ─── VENDOR MANAGEMENT (admin only) ───────────────────
router.get('/vendors-all/list', protect, getAllVendors)
router.put('/vendors-all/:id/status', protect, updateVendorStatus)
router.put('/vendors-all/:id/verify', protect, toggleVendorVerified)
router.delete('/vendors-all/:id', protect, deleteVendor)

// ─── PRODUCTS (public) ─────────────────────────────────
router.get('/products', getProducts)
router.post('/products/:id/view', trackProductView)
router.post('/products/:id/click', trackProductClick)

// ─── PRODUCTS (admin) ──────────────────────────────────
router.get('/products/all', protect, getAllProducts)
router.post('/products', protect, upload.array('images', 5), createProduct)
router.put('/products/:id', protect, upload.array('images', 5), updateProduct)
router.delete('/products/:id', protect, deleteProduct)

// ─── PRODUCTS (vendor) ─────────────────────────────────
router.get('/products/mine', protectVendor, getMyProducts)
router.post('/products/vendor', protectVendor, upload.array('images', 5), createVendorProduct)
router.put('/products/vendor/:id', protectVendor, upload.array('images', 5), updateVendorProduct)
router.delete('/products/vendor/:id', protectVendor, deleteVendorProduct)

// ─── COLLECTIONS ──────────────────────────────────────
router.get('/collections', getCollections)
router.get('/collections/all', protect, getAllCollections)
router.post('/collections', protect, upload.single('image'), createCollection)
router.put('/collections/:id', protect, upload.single('image'), updateCollection)
router.delete('/collections/:id', protect, deleteCollection)

// ─── SETTINGS ─────────────────────────────────────────
router.get('/settings', getSettings)
router.put('/settings', protect, updateSettings)

// ─── REVIEWS ──────────────────────────────────────────
router.post('/reviews', createReview)
router.get('/reviews/:productId', getProductReviews)
router.get('/reviews', protect, getAllReviews)
router.delete('/reviews/:id', protect, deleteReview)

export default router