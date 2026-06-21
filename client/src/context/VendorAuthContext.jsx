import { createContext, useContext, useState, useEffect } from 'react'
import { fetchVendorMe } from '../utils/api'

const VendorAuthContext = createContext()

export function VendorAuthProvider({ children }) {
  const [vendor, setVendor] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('bills_vendor_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchVendorMe()
        .then(vendorData => setVendor(vendorData))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (tokenValue, vendorData) => {
    localStorage.setItem('bills_vendor_token', tokenValue)
    setToken(tokenValue)
    setVendor(vendorData)
  }

  const logout = () => {
    localStorage.removeItem('bills_vendor_token')
    setToken(null)
    setVendor(null)
  }

  return (
    <VendorAuthContext.Provider value={{ vendor, token, login, logout, loading }}>
      {children}
    </VendorAuthContext.Provider>
  )
}

export const useVendorAuth = () => useContext(VendorAuthContext)