import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useVendorAuth } from '../context/VendorAuthContext'
import { loginVendor } from '../utils/api'

export default function VendorLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useVendorAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await loginVendor({ email, password })
      if (data.success) { login(data.token, data.vendor); navigate('/vendor/dashboard') }
      else setError(data.error || 'Login failed.')
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap');

        .vl-root {
          min-height: 100vh; background: #0a0806;
          display: flex; align-items: center; justify-content: center;
          padding: 60px 24px; font-family: 'Barlow', sans-serif;
        }
        .vl-card { width: 100%; max-width: 420px; }
        .vl-logo {
          display: flex; align-items: center; gap: 10px;
          justify-content: center; margin-bottom: 40px;
        }
        .vl-logo-dot { width: 6px; height: 6px; background: #c9933a; border-radius: 50%; }
        .vl-logo-text {
          font-family: 'Cormorant Garamond', serif; font-weight: 600;
          font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #f5ede0;
        }
        .vl-eyebrow {
          text-align: center; font-size: 10px; letter-spacing: 0.32em;
          text-transform: uppercase; color: #c9933a; margin-bottom: 12px;
        }
        .vl-title {
          text-align: center; font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 40px; color: #f5ede0;
          text-transform: uppercase; margin: 0 0 40px;
        }
        .vl-field { margin-bottom: 18px; }
        .vl-label {
          display: block; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(245,237,224,0.35); margin-bottom: 8px;
        }
        .vl-input {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,147,58,0.15); color: #f5ede0;
          font-family: 'Barlow', sans-serif; font-size: 14px;
          padding: 13px 16px; outline: none; box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .vl-input:focus { border-color: #c9933a; }
        .vl-input::placeholder { color: rgba(245,237,224,0.15); }
        .vl-error {
          padding: 12px 16px; margin-bottom: 16px;
          background: rgba(220,38,38,0.08); border-left: 3px solid #dc2626;
          font-size: 12px; color: #fca5a5;
        }
        .vl-submit {
          width: 100%; padding: 15px; background: #c9933a; color: #0a0806;
          border: none; font-family: 'Barlow', sans-serif; font-weight: 600;
          font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
          cursor: pointer; transition: opacity 0.2s; margin-top: 8px;
        }
        .vl-submit:hover:not(:disabled) { opacity: 0.88; }
        .vl-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .vl-divider { width: 100%; height: 1px; background: rgba(201,147,58,0.1); margin: 28px 0; }
        .vl-foot {
          text-align: center; font-size: 12px; color: rgba(245,237,224,0.3);
        }
        .vl-foot a { color: #c9933a; text-decoration: none; }
        .vl-foot a:hover { text-decoration: underline; }
        .vl-back {
          display: block; text-align: center; margin-top: 16px;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(245,237,224,0.2); text-decoration: none; transition: color 0.2s;
        }
        .vl-back:hover { color: rgba(245,237,224,0.5); }
      `}</style>

      <div className="vl-root">
        <div className="vl-card">
          <div className="vl-logo">
            <div className="vl-logo-dot" />
            <div className="vl-logo-text">The Bills</div>
          </div>

          <div className="vl-eyebrow">Vendor Portal</div>
          <h1 className="vl-title">Sign In</h1>

          <form onSubmit={handleSubmit}>
            <div className="vl-field">
              <label className="vl-label">Email Address</label>
              <input className="vl-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" autoComplete="email" />
            </div>
            <div className="vl-field">
              <label className="vl-label">Password</label>
              <div style={{ position:'relative' }}>
                <input className="vl-input" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" style={{ paddingRight:48 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(245,237,224,0.35)', fontSize:16, padding:0 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div className="vl-error">✕ {error}</div>}

            <button className="vl-submit" type="submit" disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div className="vl-divider" />
          <div className="vl-foot">
            Don't have a shop yet? <Link to="/vendor/register">Apply to sell</Link>
          </div>
          <Link to="/" className="vl-back">← Back to Website</Link>
        </div>
      </div>
    </>
  )
}