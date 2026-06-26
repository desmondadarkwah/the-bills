import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const isVendorRoute =
    config.url?.includes('/vendors/me') ||
    config.url?.includes('/vendors/me/update') ||
    config.url?.includes('/vendors/me/password') ||
    config.url?.includes('/products/mine') ||
    config.url?.includes('/products/vendor')

  const isUserRoute =
    config.url?.includes('/users/me') ||
    config.url?.includes('/users/wishlist')

  const adminToken  = localStorage.getItem('bills_token')
  const vendorToken = localStorage.getItem('bills_vendor_token')
  const userToken   = localStorage.getItem('bills_user_token')

  if (isVendorRoute && vendorToken) {
    config.headers.Authorization = `Bearer ${vendorToken}`
  } else if (isUserRoute && userToken) {
    config.headers.Authorization = `Bearer ${userToken}`
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const status = error.response?.status

    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/setup') ||
      url.includes('/vendors/login') ||
      url.includes('/vendors/register') ||
      url.includes('/users/login') ||
      url.includes('/users/register')

    if (status === 401 && !isAuthEndpoint) {
      const isVendorRoute =
        url.includes('/vendors/me') ||
        url.includes('/products/mine') ||
        url.includes('/products/vendor')

      const isUserRoute =
        url.includes('/users/me') ||
        url.includes('/users/wishlist')

      if (isVendorRoute) {
        localStorage.removeItem('bills_vendor_token')
        window.location.href = '/vendor/login'
      } else if (isUserRoute) {
        localStorage.removeItem('bills_user_token')
        window.location.href = '/login'
      } else {
        localStorage.removeItem('bills_token')
        window.location.href = '/manage/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

