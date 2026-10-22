/**
 * API client — axios instance with automatic JWT attachment.
 *
 * The token is stored in memory (module-level variable).
 * Call setToken(token) after login and clearToken() on logout.
 *
 * All /api/admin/* requests automatically include the Bearer header.
 * Public reads (/api/updates, /api/media, etc.) need no token.
 */

import axios from 'axios'

// Development requests use the Vite proxy; production uses the Render API URL.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// ── In-memory token storage ────────────────────────────────────────────────────
let _token = null

export function setToken(token) {
  _token = token
}

export function clearToken() {
  _token = null
}

export function getToken() {
  return _token
}

// ── Axios instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`
  }
  return config
})

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error'
    return Promise.reject(new Error(message))
  }
)

export default api
