import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { loginUser } from '../utils/api'

const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

export default function UserLogin() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const { login } = useUserAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await loginUser({ email, password })
      if (data.success) {
        await login(data.token, data.user)
        navigate('/')
      } else setError(data.error || 'Login failed.')
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap');
        .ul-root { min-height: 100vh; background: #0a0806; display: flex; align-items: center; justify-content: center; padding: 60px 24px; font-family: 'Barlow', sans-serif; }
        .ul-card { width: 100%; max-width: 420px; }
        .ul-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 40px; }
        .ul-logo-dot { width: 6px; height: 6px; background: #c9933a; border-radius: 50%; }
        .ul-logo-text { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #f5ede0; }
        .ul-eyebrow { text-align: center; font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase; color: #c9933a; margin-bottom: 12px; }
        .ul-title { text-align: center; font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 40px; color: #f5ede0; text-transform: uppercase; margin: 0 0 40px; }
        .ul-field { margin-bottom: 18px; }
        .ul-label { display: block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,237,224,0.35); margin-bottom: 8px; }
        .ul-input-wrap { position: relative; display: flex; align-items: center; }
        .ul-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(201,147,58,0.15); color: #f5ede0; font-family: 'Barlow', sans-serif; font-size: 14px; padding: 13px 44px 13px 16px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .ul-input:focus { border-color: #c9933a; }
        .ul-input::placeholder { color: rgba(245,237,224,0.15); }
        .ul-eye { position: absolute; right: 14px; background: none; border: none; cursor: pointer; color: rgba(245,237,224,0.25); display: flex; align-items: center; padding: 0; transition: color 0.2s; }
        .ul-eye:hover { color: #c9933a; }
        .ul-error { padding: 12px 16px; margin-bottom: 16px; background: rgba(220,38,38,0.08); border-left: 3px solid #dc2626; font-size: 12px; color: #fca5a5; }
        .ul-submit { width: 100%; padding: 15px; background: #c9933a; color: #0a0806; border: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
        .ul-submit:hover:not(:disabled) { opacity: 0.88; }
        .ul-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .ul-divider { width: 100%; height: 1px; background: rgba(201,147,58,0.1); margin: 28px 0; }
        .ul-foot { text-align: center; font-size: 12px; color: rgba(245,237,224,0.3); }
        .ul-foot a { color: #c9933a; text-decoration: none; }
        .ul-foot a:hover { text-decoration: underline; }
        .ul-back { display: block; text-align: center; margin-top: 16px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,237,224,0.2); text-decoration: none; transition: color 0.2s; }
        .ul-back:hover { color: rgba(245,237,224,0.5); }
      `}</style>

      <div className="ul-root">
        <div className="ul-card">
          <div className="ul-logo">
            <div className="ul-logo-dot" />
            <div className="ul-logo-text">The Bills</div>
          </div>
          <div className="ul-eyebrow">Welcome Back</div>
          <h1 className="ul-title">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="ul-field">
              <label className="ul-label">Email Address</label>
              <div className="ul-input-wrap">
                <input
                  className="ul-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="ul-field">
              <label className="ul-label">Password</label>
              <div className="ul-input-wrap">
                <input
                  className="ul-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="ul-eye"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
            {error && <div className="ul-error">✕ {error}</div>}
            <button className="ul-submit" type="submit" disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>
          <div className="ul-divider" />
          <div className="ul-foot">Don't have an account? <Link to="/register">Create one</Link></div>
          <Link to="/" className="ul-back">← Back to Website</Link>
        </div>
      </div>
    </>
  )
}