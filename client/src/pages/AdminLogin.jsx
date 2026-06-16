import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAdmin } from '../utils/api'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await loginAdmin({ email, password })
      if (data.success) { login(data.token, data.admin); navigate('/the-bills-manage') }
      else setError(data.error || 'Login failed.')
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Make sure backend is running.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap');
        .login-root {
          min-height: 100vh;
          background: #0a0806;
          display: flex;
          font-family: 'Barlow', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .login-root::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(-55deg, transparent, transparent 40px, rgba(201,147,58,0.02) 40px, rgba(201,147,58,0.02) 42px);
          pointer-events: none;
        }
        .login-watermark {
          position: absolute;
          bottom: -60px; right: -20px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 280px; line-height: 1;
          color: rgba(201,147,58,0.03);
          letter-spacing: -0.04em;
          user-select: none; pointer-events: none; z-index: 0;
        }
        .login-left {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 48px;
          width: 440px;
          flex-shrink: 0;
          border-right: 1px solid rgba(201,147,58,0.1);
          position: relative; z-index: 1;
        }
        @media (min-width: 900px) { .login-left { display: flex; } }
        .login-brand { display: flex; align-items: center; gap: 16px; }
        .login-logo-box {
          width: 48px; height: 48px;
          background: #c9933a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .login-logo-box span { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 18px; color: #0a0806; }
        .login-brand-name { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 16px; letter-spacing: 0.15em; text-transform: uppercase; color: #f5ede0; line-height: 1; margin-bottom: 4px; }
        .login-brand-sub { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,237,224,0.3); }
        .login-headline { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(52px, 5vw, 72px); line-height: 0.95; letter-spacing: -0.01em; color: #f5ede0; }
        .login-headline em { font-style: italic; color: #c9933a; display: block; }
        .login-foot { font-size: 11px; color: rgba(245,237,224,0.2); letter-spacing: 0.1em; line-height: 1.8; }
        .login-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; position: relative; z-index: 1; }
        .login-card { width: 100%; max-width: 420px; }
        .login-mobile-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        @media (min-width: 900px) { .login-mobile-logo { display: none; } }
        .login-eyebrow { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #c9933a; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
        .login-eyebrow::after { content: ''; width: 24px; height: 1px; background: rgba(201,147,58,0.4); }
        .login-title { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 48px; color: #f5ede0; margin: 0 0 36px; line-height: 1; letter-spacing: 0.02em; }
        .login-field { margin-bottom: 18px; }
        .login-label { display: block; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,237,224,0.35); margin-bottom: 8px; }
        .login-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(201,147,58,0.15); color: #f5ede0; font-family: 'Barlow', sans-serif; font-size: 14px; padding: 13px 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .login-input::placeholder { color: rgba(245,237,224,0.15); }
        .login-input:focus { border-color: #c9933a; box-shadow: 0 0 0 3px rgba(201,147,58,0.08); }
        .login-error { padding: 12px 16px; margin-bottom: 16px; background: rgba(220,38,38,0.08); border-left: 3px solid #dc2626; font-size: 12px; font-weight: 500; color: #fca5a5; letter-spacing: 0.04em; }
        .login-submit { width: 100%; padding: 15px; background: #c9933a; color: #0a0806; border: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
        .login-submit:hover:not(:disabled) { opacity: 0.88; }
        .login-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .login-back { display: block; text-align: center; margin-top: 24px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,237,224,0.2); text-decoration: none; transition: color 0.2s; }
        .login-back:hover { color: rgba(245,237,224,0.5); }
        .login-divider { width: 100%; height: 1px; background: rgba(201,147,58,0.1); margin: 28px 0; }
      `}</style>

      <div className="login-root">
        <div className="login-watermark">TB</div>

        <div className="login-left">
          <div className="login-brand">
            <div className="login-logo-box"><span>TB</span></div>
            <div>
              <div className="login-brand-name">The Bills</div>
              <div className="login-brand-sub">Admin Portal</div>
            </div>
          </div>
          <div>
            <div className="login-headline">
              Manage<br />your <em>brand.</em>
            </div>
          </div>
          <div className="login-foot">
            Secure access for authorised<br />The Bills administrators only.
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-mobile-logo">
              <div className="login-logo-box" style={{ width:40, height:40 }}><span style={{ fontSize:15 }}>TB</span></div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, letterSpacing:'0.15em', textTransform:'uppercase', color:'#f5ede0', lineHeight:1, marginBottom:4 }}>The Bills</div>
                <div style={{ fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(245,237,224,0.3)' }}>Admin Portal</div>
              </div>
            </div>

            <div className="login-eyebrow">Secure Login</div>
            <h1 className="login-title">Sign In</h1>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@thebills.com" autoComplete="email" />
              </div>
              <div className="login-field">
                <label className="login-label">Password</label>
                <div style={{ position:'relative' }}>
                  <input className="login-input" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" style={{ paddingRight:48 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(245,237,224,0.35)', fontSize:16, padding:0, lineHeight:1 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              {error && <div className="login-error">✕ &nbsp;{error}</div>}
              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? 'Signing In…' : 'Sign In →'}
              </button>
            </form>

            <div className="login-divider" />
            <a href="/" className="login-back">← Back to Website</a>
          </div>
        </div>
      </div>
    </>
  )
}