import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login, isLoggedIn } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname ?? '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  // Already logged in → go straight to admin
  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true })
  }, [isLoggedIn, navigate, from])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login__card">
        {/* Brand mark */}
        <div className="adm-login__brand" aria-hidden="true">
          <img src="/IpjbuLogo.jpg" alt="Logo IPJBU – DUHINDURINGENDO" className="adm-login__brand-logo" />
        </div>

        <h1 className="adm-login__title">IPJBU Admin</h1>
        <p className="adm-login__sub">Connectez-vous pour gérer le contenu du site</p>

        {error && (
          <div className="adm-login__error" role="alert">
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        <form className="adm-login__form" onSubmit={handleSubmit} noValidate>
          <div className="adm-field">
            <label htmlFor="adm-username" className="adm-label">Nom d'utilisateur</label>
            <input
              id="adm-username"
              type="text"
              className="adm-input"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              autoComplete="username"
              autoFocus
              placeholder="admin"
              aria-required="true"
              disabled={loading}
            />
          </div>

          <div className="adm-field">
            <label htmlFor="adm-password" className="adm-label">Mot de passe</label>
            <div className="adm-login__pw-wrap">
              <input
                id="adm-password"
                type={showPw ? 'text' : 'password'}
                className="adm-input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-required="true"
                disabled={loading}
              />
              <button
                type="button"
                className="adm-login__pw-toggle"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                tabIndex={-1}
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn--primary adm-btn--lg adm-login__submit"
            disabled={loading}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="adm-login__hint">
          Utilisez les identifiants créés via le script de configuration initiale.
        </p>
      </div>
    </div>
  )
}
