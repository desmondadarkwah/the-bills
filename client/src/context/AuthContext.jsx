import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMe } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('bills_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchMe()
        .then(adminData => setAdmin(adminData))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (tokenValue, adminData) => {
    localStorage.setItem('bills_token', tokenValue)
    setToken(tokenValue)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('bills_token')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)