import { createContext, useContext, useState, useEffect } from 'react'
import { fetchUserMe, syncWishlistDB } from '../utils/api'

const UserAuthContext = createContext()

export function UserAuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(localStorage.getItem('bills_user_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUserMe()
        .then(userData => setUser(userData))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (tokenValue, userData) => {
    localStorage.setItem('bills_user_token', tokenValue)
    setToken(tokenValue)
    setUser(userData)

    // Migrate localStorage wishlist to DB
    const saved = localStorage.getItem('bills_wishlist')
    if (saved) {
      const ids = JSON.parse(saved)
      if (ids.length > 0) {
        try {
          await syncWishlistDB(ids)
          localStorage.removeItem('bills_wishlist')
        } catch {}
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('bills_user_token')
    setToken(null)
    setUser(null)
  }

  const updateWishlist = (wishlist) => {
    setUser(prev => ({ ...prev, wishlist }))
  }

  return (
    <UserAuthContext.Provider value={{ user, token, login, logout, loading, updateWishlist }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => useContext(UserAuthContext)