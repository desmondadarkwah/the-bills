import axiosInstance from './axiosInstance'

// ─── SETTINGS ─────────────────────────────────────────
export const fetchSettings = async () => {
  const { data } = await axiosInstance.get('/api/settings')
  return data.data || {}
}

export const updateSettings = async (payload) => {
  const { data } = await axiosInstance.put('/api/settings', payload)
  return data.data
}

// ─── PRODUCTS ─────────────────────────────────────────
export const fetchProducts = async (category) => {
  const url = category ? `/api/products?category=${category}` : '/api/products'
  const { data } = await axiosInstance.get(url)
  return data.data || []
}

export const fetchAllProducts = async () => {
  const { data } = await axiosInstance.get('/api/products/all')
  return data.data || []
}

export const createProduct = async (formData) => {
  const { data } = await axiosInstance.post('/api/products', formData)
  return data.data
}

export const updateProduct = async (id, formData) => {
  const { data } = await axiosInstance.put(`/api/products/${id}`, formData)
  return data.data
}

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/api/products/${id}`)
  return data
}

// ─── COLLECTIONS ──────────────────────────────────────
export const fetchCollections = async () => {
  const { data } = await axiosInstance.get('/api/collections')
  return data.data || []
}

export const fetchAllCollections = async () => {
  const { data } = await axiosInstance.get('/api/collections/all')
  return data.data || []
}

export const createCollection = async (formData) => {
  const { data } = await axiosInstance.post('/api/collections', formData)
  return data.data
}

export const updateCollection = async (id, formData) => {
  const { data } = await axiosInstance.put(`/api/collections/${id}`, formData)
  return data.data
}

export const deleteCollection = async (id) => {
  const { data } = await axiosInstance.delete(`/api/collections/${id}`)
  return data
}

// ─── AUTH ─────────────────────────────────────────────
export const loginAdmin = async (payload) => {
  const { data } = await axiosInstance.post('/api/auth/login', payload)
  return data
}

export const fetchMe = async () => {
  const { data } = await axiosInstance.get('/api/auth/me')
  return data.admin
}

export const changePassword = async (payload) => {
  const { data } = await axiosInstance.put('/api/auth/change-password', payload)
  return data
}

export const addAdmin = async (payload) => {
  const { data } = await axiosInstance.post('/api/auth/add-admin', payload)
  return data
}

export const fetchAdmins = async () => {
  const { data } = await axiosInstance.get('/api/auth/admins')
  return data.data || []
}

export const deleteAdmin = async (id) => {
  const { data } = await axiosInstance.delete(`/api/auth/admins/${id}`)
  return data
}

// ─── VENDORS ──────────────────────────────────────────
export const registerVendor = async (payload) => {
  const { data } = await axiosInstance.post('/api/vendors/register', payload)
  return data
}

export const loginVendor = async (payload) => {
  const { data } = await axiosInstance.post('/api/vendors/login', payload)
  return data
}

export const fetchVendorMe = async () => {
  const { data } = await axiosInstance.get('/api/vendors/me')
  return data.vendor
}

export const fetchVendorPublic = async (id) => {
  const { data } = await axiosInstance.get(`/api/vendors/${id}`)
  return data
}

// ─── VENDOR PRODUCTS ──────────────────────────────────
export const fetchMyProducts = async () => {
  const { data } = await axiosInstance.get('/api/products/mine')
  return data.data || []
}

export const createVendorProduct = async (formData) => {
  const { data } = await axiosInstance.post('/api/products/vendor', formData)
  return data.data
}

export const updateVendorProduct = async (id, formData) => {
  const { data } = await axiosInstance.put(`/api/products/vendor/${id}`, formData)
  return data.data
}

export const deleteVendorProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/api/products/vendor/${id}`)
  return data
}

// ─── ADMIN: VENDOR MANAGEMENT ─────────────────────────
export const fetchAllVendors = async () => {
  const { data } = await axiosInstance.get('/api/vendors-all/list')
  return data.data || []
}

export const updateVendorStatus = async (id, status) => {
  const { data } = await axiosInstance.put(`/api/vendors-all/${id}/status`, { status })
  return data.data
}

export const toggleVendorVerified = async (id) => {
  const { data } = await axiosInstance.put(`/api/vendors-all/${id}/verify`)
  return data.data
}

export const deleteVendor = async (id) => {
  const { data } = await axiosInstance.delete(`/api/vendors-all/${id}`)
  return data
}

// ─── PRODUCT TRACKING ─────────────────────────────────
export const trackProductView = async (id) => {
  try { await axiosInstance.post(`/api/products/${id}/view`) } catch {}
}

export const trackProductClick = async (id) => {
  try { await axiosInstance.post(`/api/products/${id}/click`) } catch {}
}

export const updateVendorProfile = async (payload) => {
  const { data } = await axiosInstance.put('/api/vendors/me/update', payload)
  return data.vendor
}

export const changeVendorPassword = async (payload) => {
  const { data } = await axiosInstance.put('/api/vendors/me/password', payload)
  return data
}

// ─── REVIEWS ──────────────────────────────────────────
export const submitReview = async (payload) => {
  const { data } = await axiosInstance.post('/api/reviews', payload)
  return data.data
}

export const fetchProductReviews = async (productId) => {
  const { data } = await axiosInstance.get(`/api/reviews/${productId}`)
  return data
}

export const fetchAllReviews = async () => {
  const { data } = await axiosInstance.get('/api/reviews')
  return data.data || []
}

export const deleteReview = async (id) => {
  const { data } = await axiosInstance.delete(`/api/reviews/${id}`)
  return data
}

// ─── USER AUTH ────────────────────────────────────────
export const registerUser = async (payload) => {
  const { data } = await axiosInstance.post('/api/users/register', payload)
  return data
}

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post('/api/users/login', payload)
  return data
}

export const fetchUserMe = async () => {
  const { data } = await axiosInstance.get('/api/users/me')
  return data.user
}

export const addToWishlistDB = async (productId) => {
  const { data } = await axiosInstance.put('/api/users/wishlist/add', { productId })
  return data.wishlist
}

export const removeFromWishlistDB = async (productId) => {
  const { data } = await axiosInstance.put('/api/users/wishlist/remove', { productId })
  return data.wishlist
}

export const syncWishlistDB = async (productIds) => {
  const { data } = await axiosInstance.put('/api/users/wishlist/sync', { productIds })
  return data.wishlist
}