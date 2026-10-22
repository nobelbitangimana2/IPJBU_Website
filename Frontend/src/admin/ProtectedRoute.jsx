import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

/**
 * Wraps any admin route. Redirects to /admin/login if not authenticated,
 * passing the current location so the login page can redirect back after sign-in.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
