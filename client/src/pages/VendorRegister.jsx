import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerVendor } from '../utils/api'

export default function VendorRegister() {
  const [form, setForm] = useState({ shopName:'', email:'', password:'', phone:'', whatsapp:'', bio:'' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await registerVendor(form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap');

        .vr-root {
          min-height: 100vh; background: #0a0806;
          display: flex; align-items: center; justify-content: center;
          padding: 60px 24px; font-family: 'Barlow', sans-serif;
        }
        .vr-card { width: 100%; max-width: 480px; }
        .vr-logo {
          display: flex; align-items: center; gap: 10px;
          justify-content: center; margin-bottom: 40px;
        }
        .vr-logo-dot { width: 6px; height: 6px; background: #c9933a; border-radius: 50%; }
        .vr-logo-text {
          font-family: 'Cormorant Garamond', serif; font-weight: 600;
          font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #f5ede0;
        }
        .vr-eyebrow {
          text-align: center; font-size: 10px; letter-spacing: 0.32em;
          text-transform: uppercase; color: #c9933a; margin-bottom: 12px;
        }
        .vr-title {
          text-align: center; font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 38px; color: #f5ede0;
          text-transform: uppercase; margin: 0 0 8px;
        }
        .vr-subtitle {
          text-align: center; font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300; font-size: 15px;
          color: rgba(245,237,224,0.4); margin-bottom: 40px;
        }
        .vr-field { margin-bottom: 16px; }
        .vr-label {
          display: block; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(245,237,224,0.35); margin-bottom: 8px;
        }
        .vr-input, .vr-textarea {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,147,58,0.15); color: #f5ede0;
          font-family: 'Barlow', sans-serif; font-size: 14px;
          padding: 13px 16px; outline: none; box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .vr-input:focus, .vr-textarea:focus { border-color: #c9933a; }
        .vr-input::placeholder, .vr-textarea::placeholder { color: rgba(245,237,224,0.15); }
        .vr-textarea { resize: none; }
        .vr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .vr-error {
          padding: 12px 16px; margin-bottom: 16px;
          background: rgba(220,38,38,0.08); border-left: 3px solid #dc2626;
          font-size: 12px; color: #fca5a5;
        }
        .vr-submit {
          width: 100%; padding: 15px; background: #c9933a; color: #0a0806;
          border: none; font-family: 'Barlow', sans-serif; font-weight: 600;
          font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
          cursor: pointer; transition: opacity 0.2s; margin-top: 8px;
        }
        .vr-submit:hover:not(:disabled) { opacity: 0.88; }
        .vr-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .vr-foot {
          text-align: center; margin-top: 24px; font-size: 12px;
          color: rgba(245,237,224,0.3);
        }
        .vr-foot a { color: #c9933a; text-decoration: none; }
        .vr-foot a:hover { text-decoration: underline; }
        .vr-success {
          text-align: center; padding: 40px 20px;
        }
        .vr-success-icon {
          width: 56px; height: 56px; border: 1px solid #c9933a;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; font-size: 24px; color: #c9933a;
        }
        .vr-success-title {
          font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 26px;
          color: #f5ede0; text-transform: uppercase; margin-bottom: 12px;
        }
        .vr-success-text {
          font-size: 13px; color: rgba(245,237,224,0.45); line-height: 1.7; margin-bottom: 24px;
        }
      `}</style>

      <div className="vr-root">
        <div className="vr-card">
          <div className="vr-logo">
            <div className="vr-logo-dot" />
            <div className="vr-logo-text">The Bills</div>
          </div>

          {success ? (
            <div className="vr-success">
              <div className="vr-success-icon">✓</div>
              <div className="vr-success-title">Application Submitted</div>
              <p className="vr-success-text">
                Thank you for applying to sell on The Bills. Your shop is now pending review.
                You'll be able to log in once an admin approves your account.
              </p>
              <Link to="/" className="vr-submit" style={{ display:'inline-block', textDecoration:'none', textAlign:'center' }}>
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="vr-eyebrow">Become a Vendor</div>
              <h1 className="vr-title">Sell With Us</h1>
              <p className="vr-subtitle">Open your shop on The Bills marketplace</p>

              <form onSubmit={handleSubmit}>
                <div className="vr-field">
                  <label className="vr-label">Shop Name</label>
                  <input className="vr-input" name="shopName" value={form.shopName} onChange={handleChange} required placeholder="e.g. Kofi's Couture" />
                </div>
                <div className="vr-field">
                  <label className="vr-label">Email Address</label>
                  <input className="vr-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
                </div>
                <div className="vr-field">
                  <label className="vr-label">Password</label>
                  <input className="vr-input" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Minimum 6 characters" minLength={6} />
                </div>
                <div className="vr-row">
                  <div className="vr-field">
                    <label className="vr-label">Phone</label>
                    <input className="vr-input" name="phone" value={form.phone} onChange={handleChange} placeholder="050 000 0000" />
                  </div>
                  <div className="vr-field">
                    <label className="vr-label">WhatsApp</label>
                    <input className="vr-input" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="233500000000" />
                  </div>
                </div>
                <div className="vr-field">
                  <label className="vr-label">Shop Bio (optional)</label>
                  <textarea className="vr-textarea" rows={3} name="bio" value={form.bio} onChange={handleChange} placeholder="Tell customers about your shop..." />
                </div>

                {error && <div className="vr-error">✕ {error}</div>}

                <button className="vr-submit" type="submit" disabled={loading}>
                  {loading ? 'Submitting…' : 'Apply to Sell'}
                </button>
              </form>

              <div className="vr-foot">
                Already a vendor? <Link to="/vendor/login">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}