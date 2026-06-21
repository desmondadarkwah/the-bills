import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const isVendorRoute = config.url?.includes('/vendors/me') ||
                        config.url?.includes('/products/mine') ||
                        config.url?.includes('/products/vendor')

  const adminToken = localStorage.getItem('bills_token')
  const vendorToken = localStorage.getItem('bills_vendor_token')

  if (isVendorRoute && vendorToken) {
    config.headers.Authorization = `Bearer ${vendorToken}`
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isVendorRoute = error.config?.url?.includes('/vendors/me') ||
                            error.config?.url?.includes('/products/mine') ||
                            error.config?.url?.includes('/products/vendor')
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