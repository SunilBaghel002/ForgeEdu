import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Flame, Lock, Eye, EyeOff } from 'lucide-react'
import './AdminAuth.css'

export default function AdminAuth() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem('forgeEduAdmin') === 'true'
  )
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      sessionStorage.setItem('forgeEduAdmin', 'true')
      setAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password. Try again.')
    }
  }

  if (authenticated) return <Outlet />

  return (
    <div className="admin-auth">
      <form className="admin-auth-card" onSubmit={handleLogin}>
        <div className="admin-auth-logo">
          <Flame size={40} />
        </div>
        <h2>Admin Access</h2>
        <p className="text-muted fs-sm">Enter the admin password to continue</p>

        <div className="form-group mt-lg">
          <label className="form-label">Password</label>
          <div className="password-input-wrap">
            <Lock size={18} className="password-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: '42px', paddingRight: '42px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-danger fs-sm">{error}</p>}

        <button className="btn btn-primary w-full mt-md" type="submit">
          Enter Dashboard
        </button>
      </form>
    </div>
  )
}
