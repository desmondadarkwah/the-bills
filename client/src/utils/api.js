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