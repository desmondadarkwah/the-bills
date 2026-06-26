import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { registerUser } from '../utils/api'

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

export default function UserRegister() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirm:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [showCf, setShowCf]   = useState(false)
  const { login } = useUserAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const data = await registerUser({ name: form.name, email: form.email, password: form.password })
      if (data.success) {
        await login(data.token, data.user)
        navigate('/')
      } else setError(data.error || 'Registration failed.')
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap');
        .ur-root { min-height: 100vh; background: #0a0806; display: flex; align-items: center; justify-content: center; padding: 60px 24px; font-family: 'Barlow', sans-serif; }
        .ur-card { width: 100%; max-width: 420px; }
        .ur-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 40px; }
        .ur-logo-dot { width: 6px; height: 6px; background: #c9933a; border-radius: 50%; }
        .ur-logo-text { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #f5ede0; }
        .ur-eyebrow { text-align: center; font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase; color: #c9933a; margin-bottom: 12px; }
        .ur-title { text-align: center; font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 40px; color: #f5ede0; text-transform: uppercase; margin: 0 0 40px; }
        .ur-field { margin-bottom: 18px; }
        .ur-label { display: block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,237,224,0.35); margin-bottom: 8px; }
        .ur-input-wrap { position: relative; display: flex; align-items: center; }
        .ur-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(201,147,58,0.15); color: #f5ede0; font-family: 'Barlow', sans-serif; font-size: 14px; padding: 13px 44px 13px 16px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .ur-input:focus { border-color: #c9933a; }
        .ur-input::placeholder { color: rgba(245,237,224,0.15); }
        .ur-eye { position: absolute; right: 14px; background: none; border: none; cursor: pointer; color: rgba(245,237,224,0.25); display: flex; align-items: center; padding: 0; transition: color 0.2s; }
        .ur-eye:hover { color: #c9933a; }
        .ur-error { padding: 12px 16px; margin-bottom: 16px; background: rgba(220,38,38,0.08); border-left: 3px solid #dc2626; font-size: 12px; color: #fca5a5; }
        .ur-submit { width: 100%; padding: 15px; background: #c9933a; color: #0a0806; border: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
        .ur-submit:hover:not(:disabled) { opacity: 0.88; }
        .ur-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .ur-divider { width: 100%; height: 1px; background: rgba(201,147,58,0.1); margin: 28px 0; }
        .ur-foot { text-align: center; font-size: 12px; color: rgba(245,237,224,0.3); }
        .ur-foot a { color: #c9933a; text-decoration: none; }
        .ur-foot a:hover { text-decoration: underline; }
        .ur-back { display: block; text-align: center; margin-top: 16px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,237,224,0.2); text-decoration: none; transition: color 0.2s; }
        .ur-back:hover { color: rgba(245,237,224,0.5); }
      `}</style>

      <div className="ur-root">
        <div className="ur-card">
          <div className="ur-logo">
            <div className="ur-logo-dot" />
            <div className="ur-logo-text">The Bills</div>
          </div>
          <div className="ur-eyebrow">Join The Bills</div>
          <h1 className="ur-title">Create Account</h1>
          <form onSubmit={handleSubmit}>
            <div className="ur-field">
              <label className="ur-label">Full Name</label>
              <div className="ur-input-wrap">
                <input className="ur-input" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required placeholder="Your full name" />
              </div>
            </div>
            <div className="ur-field">
              <label className="ur-label">Email Address</label>
              <div className="ur-input-wrap">
                <input className="ur-input" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required placeholder="you@email.com" />
              </div>
            </div>
            <div className="ur-field">
              <label className="ur-label">Password</label>
              <div className="ur-input-wrap">
                <input
                  className="ur-input"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  required
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
                <button type="button" className="ur-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>
            <div className="ur-field">
              <label className="ur-label">Confirm Password</label>
              <div className="ur-input-wrap">
                <input
                  className="ur-input"
                  type={showCf ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => setForm({...form, confirm:e.target.value})}
                  required
                  placeholder="Repeat your password"
                />
                <button type="button" className="ur-eye" onClick={() => setShowCf(p => !p)} tabIndex={-1}>
                  <EyeIcon open={showCf} />
                </button>
              </div>
            </div>
            {error && <div className="ur-error">✕ {error}</div>}
            <button className="ur-submit" type="submit" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
          <div className="ur-divider" />
          <div className="ur-foot">Already have an account? <Link to="/login">Sign in</Link></div>
          <Link to="/" className="ur-back">← Back to Website</Link>
        </div>
      </div>
    </>
  )
}