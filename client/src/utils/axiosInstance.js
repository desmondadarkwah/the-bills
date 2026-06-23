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

  const adminToken = localStorage.getItem('bills_token')
  const vendorToken = localStorage.getItem('bills_vendor_token')

  if (isVendorRoute && vendorToken) {
    config.headers.Authorization = `Bearer ${vendorToken}`
  } else if (!isVendorRoute && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  } else if (vendorToken) {
    config.headers.Authorization = `Bearer ${vendorToken}`
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

    // Never redirect on auth endpoints — wrong password is an expected 401
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/setup') ||
      url.includes('/vendors/login') ||
      url.includes('/vendors/register')

    if (status === 401 && !isAuthEndpoint) {
      const isVendorRoute =
        url.includes('/vendors/me') ||
        url.includes('/products/mine') ||
        url.includes('/products/vendor')

      if (isVendorRoute) {
        localStorage.removeItem('bills_vendor_token')
        window.location.href = '/vendor/login'
      } else {
        localStorage.removeItem('bills_token')
        window.location.href = '/manage/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance