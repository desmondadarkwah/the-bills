import { useState, useEffect } from 'react'
import { useVendorAuth } from '../context/VendorAuthContext'
import { useNavigate } from 'react-router-dom'
import {
  fetchMyProducts, createVendorProduct, updateVendorProduct, deleteVendorProduct,
  fetchAllCollections, updateVendorProfile, changeVendorPassword,
} from '../utils/api'


const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  .vd-root { font-family: 'Barlow', sans-serif; min-height: 100vh; background: #fafafa; color: #1a1a1a; }
  .vd-topbar { position: sticky; top: 0; z-index: 50; background: #0a0806; border-bottom: 1px solid rgba(201,147,58,0.15); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; height: 60px; }
  .vd-topbar-left { display: flex; align-items: center; gap: 14px; }
  .vd-logo-badge { width: 36px; height: 36px; background: #c9933a; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 13px; color: #fff; flex-shrink: 0; }
  .vd-logo-name { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 16px; letter-spacing: 0.15em; text-transform: uppercase; color: #f5ede0; line-height: 1; margin-bottom: 2px; }
  .vd-logo-sub { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #c9933a; }
  .vd-topbar-right { display: flex; align-items: center; gap: 10px; }
  .vd-btn-site { padding: 7px 14px; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.6); background: transparent; cursor: pointer; text-decoration: none; font-weight: 500; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; transition: all 0.2s; }
  .vd-btn-site:hover { border-color: #c9933a; color: #c9933a; }
  .vd-btn-logout { padding: 7px 16px; background: #c9933a; color: #fff; border: none; cursor: pointer; font-weight: 600; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }
  .vd-main { max-width: 1000px; margin: 0 auto; padding: 36px 28px 80px; }
  .vd-page-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 30px; text-transform: uppercase; letter-spacing: 0.04em; color: #1a1a1a; margin: 0 0 6px; }
  .vd-shop-sub { font-size: 13px; color: rgba(0,0,0,0.4); margin-bottom: 28px; }
  .vd-stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 28px; }
  .vd-stat-card { background: #fff; border: 1px solid #e8e4dc; padding: 18px; position: relative; }
  .vd-stat-num { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 32px; color: #c9933a; line-height: 1; margin-bottom: 4px; }
  .vd-stat-label { font-size: 10px; color: rgba(0,0,0,0.4); letter-spacing: 0.12em; text-transform: uppercase; }
  .vd-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .vd-section-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 20px; text-transform: uppercase; letter-spacing: 0.06em; }
  .vd-btn { padding: 9px 20px; border: none; cursor: pointer; font-weight: 600; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; transition: opacity 0.2s; }
  .vd-btn:hover { opacity: 0.85; }
  .vd-btn-gold { background: #c9933a; color: #fff; }
  .vd-btn-ghost { background: transparent; border: 1px solid #d8d3c5; color: #1a1a1a; }
  .vd-btn-red { background: #dc2626; color: #fff; }
  .vd-btn-sm { padding: 5px 12px; font-size: 10px; }
  .vd-card { background: #fff; border: 1px solid #e8e4dc; overflow: hidden; margin-bottom: 16px; }
  .vd-row { padding: 14px 18px; border-bottom: 1px solid #f0ede5; display: flex; align-items: center; gap: 14px; }
  .vd-row:last-child { border-bottom: none; }
  .vd-row-name { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
  .vd-row-sub { font-size: 11px; color: rgba(0,0,0,0.45); }
  .vd-badge { display: inline-block; padding: 3px 10px; font-weight: 600; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
  .vd-badge-green { background: rgba(5,150,105,0.1); color: #047857; border: 1px solid rgba(5,150,105,0.25); }
  .vd-badge-red { background: rgba(220,38,38,0.08); color: #b91c1c; border: 1px solid rgba(220,38,38,0.2); }
  .vd-empty { padding: 48px 24px; text-align: center; color: rgba(0,0,0,0.35); }
  .vd-empty-icon { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 48px; color: rgba(201,147,58,0.15); margin-bottom: 10px; }
  .vd-modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .vd-modal { background: #fff; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; }
  .vd-modal-head { padding: 20px 24px; border-bottom: 1px solid #f0ede5; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; }
  .vd-modal-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 18px; text-transform: uppercase; }
  .vd-modal-close { background: none; border: 1px solid #e0dccf; cursor: pointer; width: 30px; height: 30px; }
  .vd-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .vd-field { display: flex; flex-direction: column; gap: 6px; }
  .vd-label { font-weight: 500; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(0,0,0,0.5); }
  .vd-input { background: #fcfbf8; border: 1px solid #ddd7c8; font-size: 13px; padding: 11px 14px; outline: none; width: 100%; }
  .vd-input:focus { border-color: #c9933a; }
  .vd-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .vd-check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
  .vd-pending-banner { background: #fff8e8; border: 1px solid rgba(201,147,58,0.3); padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #8a5e1a; }
`

function Modal({ title, onClose, children }) {
  return (
    <div className="vd-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="vd-modal">
        <div className="vd-modal-head">
          <span className="vd-modal-title">{title}</span>
          <button className="vd-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="vd-modal-body">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="vd-field">
      <label className="vd-label">{label}</label>
      {children}
    </div>
  )
}

export default function VendorDashboard() {
  const { vendor, logout } = useVendorAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/vendor/login') }

  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', collection: '', available: true, order: 0 })
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  const [profileForm, setProfileForm] = useState({ shopName: '', phone: '', whatsapp: '', bio: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileStatus, setProfileStatus] = useState('')
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwStatus, setPwStatus] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    load()
    fetchAllCollections().then(setCollections).catch(console.error)
  }, [])

  useEffect(() => {
    if (vendor) {
      setProfileForm({
        shopName: vendor.shopName || '',
        phone: vendor.phone || '',
        whatsapp: vendor.whatsapp || '',
        bio: vendor.bio || '',
      })
    }
  }, [vendor])

  const load = () => fetchMyProducts().then(d => { setProducts(d); setLoading(false) }).catch(console.error)
  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', price: '', category: '', collection: '', available: true, order: 0 }); setImages([]); setModal(true) }
  const openEdit = p => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, collection: p.collection || '', available: p.available, order: p.order || 0 }); setImages([]); setModal(true) }

  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(img => fd.append('images', img))
      editing ? await updateVendorProduct(editing._id, fd) : await createVendorProduct(fd)
      load(); setModal(false)
    } catch (e) { alert(e.response?.data?.error || 'Something went wrong') } finally { setSaving(false) }
  }

  const del = async id => {
    if (!confirm('Delete this product?')) return
    try { await deleteVendorProduct(id); load() }
    catch (e) { alert(e.response?.data?.error || 'Failed to delete') }
  }

  const stats = [
    { label: 'Total Products', value: products.length },
    { label: 'Live', value: products.filter(p => p.available).length },
    { label: 'Total Views', value: products.reduce((sum, p) => sum + (p.views || 0), 0) },
  ]

  const saveProfile = async () => {
    setProfileSaving(true); setProfileStatus('')
    try {
      await updateVendorProfile(profileForm)
      setProfileStatus('ok')
      setTimeout(() => setProfileStatus(''), 3000)
    } catch (e) { setProfileStatus('err') } finally { setProfileSaving(false) }
  }

  const changePw = async () => {
    setPwError(''); setPwStatus('')
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) { setPwError('All fields required'); return }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return }
    if (pwForm.newPassword.length < 6) { setPwError('Minimum 6 characters'); return }
    setPwSaving(true)
    try {
      await changeVendorPassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwStatus('ok')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwStatus(''), 3000)
    } catch (e) { setPwError(e.response?.data?.error || 'Failed') } finally { setPwSaving(false) }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="vd-root">
        <nav className="vd-topbar">
          <div className="vd-topbar-left">
            <div className="vd-logo-badge">TB</div>
            <div>
              <div className="vd-logo-name">{vendor?.shopName || 'Vendor'}</div>
              <div className="vd-logo-sub">Vendor Dashboard</div>
            </div>
          </div>
          <div className="vd-topbar-right">
            <a href="/" target="_blank" className="vd-btn-site">View Site</a>
            <button onClick={handleLogout} className="vd-btn-logout">Logout</button>
          </div>
        </nav>

        <main className="vd-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 className="vd-page-title">My Shop</h1>
              <p className="vd-shop-sub" style={{ margin: 0 }}>{vendor?.shopName}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['products', 'settings'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className="vd-btn" style={{ background: activeTab === t ? '#c9933a' : 'transparent', color: activeTab === t ? '#fff' : '#1a1a1a', border: activeTab === t ? 'none' : '1px solid #d8d3c5', textTransform: 'capitalize' }}>{t}</button>
              ))}
            </div>
          </div>

          {activeTab === 'products' && (
            <>
              {!vendor?.verified && (
                <div className="vd-pending-banner">
                  Your shop is approved but not yet verified. Verified shops get a badge that builds customer trust — your admin can verify you once you've established a track record.
                </div>
              )}

              <div className="vd-stat-grid">
                {stats.map(s => (
                  <div key={s.label} className="vd-stat-card">
                    <div className="vd-stat-num">{s.value}</div>
                    <div className="vd-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="vd-section-head">
                <span className="vd-section-title">My Products</span>
                <button className="vd-btn vd-btn-gold" onClick={openAdd}>+ Add Product</button>
              </div>

              <div className="vd-card">
                {loading
                  ? <div className="vd-empty"><p>Loading…</p></div>
                  : products.length === 0
                    ? <div className="vd-empty"><div className="vd-empty-icon">TB</div><p>No products yet. Click + Add Product to get started.</p></div>
                    : products.map(p => (
                      <div key={p._id} className="vd-row">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 52, objectFit: 'cover', flexShrink: 0 }} />
                          : <div style={{ width: 52, height: 52, background: '#f5f2ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, color: 'rgba(201,147,58,0.4)' }}>TB</div>
                        }
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="vd-row-name">{p.name}</div>
                          <div className="vd-row-sub">{p.category} {p.collection && `· ${p.collection}`} · {p.price}</div>
                          <div className="vd-row-sub">{p.views || 0} views · {p.clicks || 0} clicks</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                          <span className={`vd-badge ${p.available ? 'vd-badge-green' : 'vd-badge-red'}`}>{p.available ? 'Live' : 'Hidden'}</span>
                          <button className="vd-btn vd-btn-ghost vd-btn-sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className="vd-btn vd-btn-red vd-btn-sm" onClick={() => del(p._id)}>Del</button>
                        </div>
                      </div>
                    ))
                }
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="vd-card">
                <div style={{ padding: '16px 18px', borderBottom: '1px solid #f0ede5', fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shop Information</div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="vd-field">
                    <label className="vd-label">Shop Name</label>
                    <input className="vd-input" value={profileForm.shopName} onChange={e => setProfileForm({ ...profileForm, shopName: e.target.value })} />
                  </div>
                  <div className="vd-two-col">
                    <div className="vd-field">
                      <label className="vd-label">Phone</label>
                      <input className="vd-input" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="050 000 0000" />
                    </div>
                    <div className="vd-field">
                      <label className="vd-label">WhatsApp (with country code)</label>
                      <input className="vd-input" value={profileForm.whatsapp} onChange={e => setProfileForm({ ...profileForm, whatsapp: e.target.value })} placeholder="233500000000" />
                    </div>
                  </div>
                  <div className="vd-field">
                    <label className="vd-label">Shop Bio</label>
                    <textarea className="vd-input" rows={3} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
                  </div>
                  {profileStatus === 'ok' && <div style={{ padding: '10px 14px', background: 'rgba(5,150,105,0.08)', borderLeft: '3px solid #059669', color: '#047857', fontSize: 12 }}>✓ Profile updated!</div>}
                  {profileStatus === 'err' && <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.08)', borderLeft: '3px solid #dc2626', color: '#b91c1c', fontSize: 12 }}>✕ Failed to update. Try again.</div>}
                  <button className="vd-btn vd-btn-gold" style={{ alignSelf: 'flex-start', padding: '10px 28px' }} onClick={saveProfile} disabled={profileSaving}>
                    {profileSaving ? 'Saving…' : profileStatus === 'ok' ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>

              <div className="vd-card">
                <div style={{ padding: '16px 18px', borderBottom: '1px solid #f0ede5', fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Change Password</div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
                  <div className="vd-field">
                    <label className="vd-label">Current Password</label>
                    <input type="password" className="vd-input" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                  </div>
                  <div className="vd-field">
                    <label className="vd-label">New Password</label>
                    <input type="password" className="vd-input" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                  </div>
                  <div className="vd-field">
                    <label className="vd-label">Confirm New Password</label>
                    <input type="password" className="vd-input" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                  </div>
                  {pwError && <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.08)', borderLeft: '3px solid #dc2626', color: '#b91c1c', fontSize: 12 }}>✕ {pwError}</div>}
                  {pwStatus === 'ok' && <div style={{ padding: '10px 14px', background: 'rgba(5,150,105,0.08)', borderLeft: '3px solid #059669', color: '#047857', fontSize: 12 }}>✓ Password changed!</div>}
                  <button className="vd-btn vd-btn-gold" style={{ alignSelf: 'flex-start', padding: '10px 28px' }} onClick={changePw} disabled={pwSaving}>
                    {pwSaving ? 'Changing…' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {modal && (
          <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setModal(false)}>
            <Field label="Product Name"><input className="vd-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kente Two-Piece" /></Field>
            <Field label="Description"><textarea className="vd-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
            <div className="vd-two-col">
              <Field label="Price"><input className="vd-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. GHS 350" /></Field>
              <Field label="Category"><input className="vd-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Two-Piece Sets" /></Field>
            </div>
            <Field label="Collection (optional)">
              <select className="vd-input" value={form.collection} onChange={e => setForm({ ...form, collection: e.target.value })}>
                <option value="">No collection</option>
                {collections.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Images (up to 5)">
              <input type="file" accept="image/*" multiple className="vd-input" onChange={e => setImages(Array.from(e.target.files))} />
              {editing?.images?.length > 0 && images.length === 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {editing.images.map((img, i) => <img key={i} src={img} alt="" style={{ height: 60, objectFit: 'cover' }} />)}
                </div>
              )}
            </Field>
            <label className="vd-check-label"><input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} />Available on site</label>
            <button className="vd-btn vd-btn-gold" style={{ width: '100%', padding: '13px' }} onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update Product' : 'Add Product'}</button>
          </Modal>
        )}
      </div>
    </>
  )
}