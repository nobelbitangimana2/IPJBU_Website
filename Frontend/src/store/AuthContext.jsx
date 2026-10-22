import React, { createContext, useContext, useState } from 'react'
import api, { setToken, clearToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  /**
   * POST /api/auth/login
   * On success: stores JWT in the api client, sets user state.
   */
  async function login(username, password) {
    const res  = await api.post('/api/auth/login', { username, password })
    const { token, user: userData } = res.data
    setToken(token)
    setUser(userData)
  }

  /**
   * POST /api/auth/logout  (JWT is stateless — server call is optional but kept for consistency)
   */
  async function logout() {
    try { await api.post('/api/auth/logout') } catch { /* ignore */ }
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
