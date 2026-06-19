import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  fetchAllProducts, createProduct, updateProduct, deleteProduct,
  fetchAllCollections, createCollection, updateCollection, deleteCollection,
  fetchSettings, updateSettings as saveSettings,
  changePassword, addAdmin, fetchAdmins, deleteAdmin,
} from '../utils/api'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  .adm-root { font-family: 'Barlow', sans-serif; min-height: 100vh; background: #fafafa; color: #1a1a1a; }
  .adm-topbar { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #e8e4dc; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; height: 60px; }
  .adm-topbar-left { display: flex; align-items: center; gap: 14px; }
  .adm-logo-badge { width: 36px; height: 36px; background: #c9933a; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 13px; color: #fff; letter-spacing: 0.04em; flex-shrink: 0; }
  .adm-logo-name { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 16px; letter-spacing: 0.15em; text-transform: uppercase; color: #1a1a1a; line-height: 1; margin-bottom: 2px; }
  .adm-logo-sub { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #c9933a; line-height: 1; }
  .adm-topbar-right { display: flex; align-items: center; gap: 10px; }
  .adm-admin-email { font-size: 12px; color: rgba(0,0,0,0.4); display: none; }
  @media (min-width: 768px) { .adm-admin-email { display: block; } }
  .adm-btn-site { padding: 7px 14px; border: 1px solid #e0dccf; color: #555; background: transparent; cursor: pointer; text-decoration: none; font-family: 'Barlow', sans-serif; font-weight: 500; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; transition: border-color 0.2s, color 0.2s; }
  .adm-btn-site:hover { border-color: #c9933a; color: #c9933a; }
  .adm-btn-logout { padding: 7px 16px; background: #c9933a; color: #fff; border: none; cursor: pointer; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; transition: opacity 0.2s; }
  .adm-btn-logout:hover { opacity: 0.88; }
  .adm-layout { display: flex; min-height: calc(100vh - 60px); }
  .adm-sidebar { width: 220px; flex-shrink: 0; background: #fff; border-right: 1px solid #e8e4dc; padding: 24px 12px; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; display: none; }
  @media (min-width: 768px) { .adm-sidebar { display: block; } }
  .adm-sidebar-label { font-family: 'Barlow', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(0,0,0,0.3); padding: 0 12px; margin-bottom: 8px; margin-top: 16px; }
  .adm-sidebar-label:first-child { margin-top: 0; }
  .adm-nav-btn { width: 100%; text-align: left; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: none; background: transparent; cursor: pointer; font-family: 'Barlow', sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(0,0,0,0.5); transition: color 0.2s, background 0.2s; position: relative; }
  .adm-nav-btn::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleY(0); width: 2px; height: 20px; background: #c9933a; transition: transform 0.2s; }
  .adm-nav-btn:hover { color: #1a1a1a; background: rgba(0,0,0,0.03); }
  .adm-nav-btn.active { color: #c9933a; background: rgba(201,147,58,0.08); }
  .adm-nav-btn.active::before { transform: translateY(-50%) scaleY(1); }
  .adm-nav-icon { font-size: 15px; flex-shrink: 0; }
  .adm-mobile-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: #fff; border-top: 1px solid #e8e4dc; overflow-x: auto; }
  @media (min-width: 768px) { .adm-mobile-nav { display: none; } }
  .adm-mobile-btn { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding: 8px 14px; border: none; background: transparent; cursor: pointer; font-family: 'Barlow', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(0,0,0,0.35); transition: color 0.2s; gap: 3px; }
  .adm-mobile-btn.active { color: #c9933a; }
  .adm-mobile-btn span:first-child { font-size: 16px; }
  .adm-main { flex: 1; padding: 32px 28px; padding-bottom: 80px; max-width: 1100px; }
  @media (min-width: 768px) { .adm-main { padding-bottom: 32px; } }
  .adm-page-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 32px; text-transform: uppercase; letter-spacing: 0.06em; color: #1a1a1a; margin: 0 0 28px; display: flex; align-items: center; gap: 12px; }
  .adm-page-title span { font-size: 24px; }
  .adm-card { background: #fff; border: 1px solid #e8e4dc; overflow: hidden; margin-bottom: 20px; border-radius: 6px; }
  .adm-card-head { padding: 16px 20px; border-bottom: 1px solid #f0ede5; display: flex; align-items: center; justify-content: space-between; }
  .adm-card-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; color: #1a1a1a; }
  .adm-row { padding: 14px 20px; border-bottom: 1px solid #f0ede5; display: flex; align-items: center; gap: 14px; transition: background 0.15s; }
  .adm-row:last-child { border-bottom: none; }
  .adm-row:hover { background: #faf8f4; }
  .adm-row-name { font-weight: 600; font-size: 13px; color: #1a1a1a; margin-bottom: 2px; }
  .adm-row-sub { font-size: 11px; color: rgba(0,0,0,0.45); }
  .adm-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .adm-btn { padding: 8px 18px; border: none; cursor: pointer; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; transition: opacity 0.2s; display: inline-flex; align-items: center; gap: 6px; border-radius: 4px; }
  .adm-btn:hover { opacity: 0.85; }
  .adm-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .adm-btn-gold { background: #c9933a; color: #fff; }
  .adm-btn-dark { background: #1a1a1a; color: #fff; }
  .adm-btn-red { background: #dc2626; color: #fff; }
  .adm-btn-ghost { background: transparent; border: 1px solid #d8d3c5; color: #1a1a1a; }
  .adm-btn-sm { padding: 5px 12px; font-size: 10px; }
  .adm-badge { display: inline-block; padding: 3px 10px; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 3px; }
  .adm-badge-gold { background: rgba(201,147,58,0.12); color: #8a5e1a; border: 1px solid rgba(201,147,58,0.3); }
  .adm-badge-green { background: rgba(5,150,105,0.1); color: #047857; border: 1px solid rgba(5,150,105,0.25); }
  .adm-badge-red { background: rgba(220,38,38,0.08); color: #b91c1c; border: 1px solid rgba(220,38,38,0.2); }
  .adm-item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  .adm-item-card { background: #fff; border: 1px solid #e8e4dc; overflow: hidden; position: relative; transition: box-shadow 0.2s; border-radius: 6px; }
  .adm-item-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
  .adm-item-img { width: 100%; height: 200px; object-fit: cover; display: block; }
  .adm-item-placeholder { width: 100%; height: 200px; background: #f5f2ea; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 48px; color: rgba(201,147,58,0.3); letter-spacing: 0.1em; }
  .adm-item-body { padding: 14px 16px; }
  .adm-item-name { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.06em; color: #1a1a1a; margin-bottom: 4px; }
  .adm-item-desc { font-size: 11px; color: #888; line-height: 1.5; margin-bottom: 10px; }
  .adm-item-actions { display: flex; gap: 6px; }
  .adm-modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .adm-modal { background: #fff; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; border-radius: 8px; }
  .adm-modal-head { padding: 20px 24px; border-bottom: 1px solid #f0ede5; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
  .adm-modal-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 20px; text-transform: uppercase; letter-spacing: 0.08em; color: #1a1a1a; }
  .adm-modal-close { background: none; border: 1px solid #e0dccf; color: rgba(0,0,0,0.4); cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; border-radius: 4px; }
  .adm-modal-close:hover { border-color: #dc2626; color: #dc2626; }
  .adm-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .adm-field { display: flex; flex-direction: column; gap: 6px; }
  .adm-label { font-family: 'Barlow', sans-serif; font-weight: 500; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(0,0,0,0.5); }
  .adm-input { background: #fcfbf8; border: 1px solid #ddd7c8; color: #1a1a1a; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 11px 14px; outline: none; width: 100%; transition: border-color 0.2s; border-radius: 4px; }
  .adm-input:focus { border-color: #c9933a; }
  .adm-input::placeholder { color: rgba(0,0,0,0.25); }
  .adm-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .adm-check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: rgba(0,0,0,0.7); font-weight: 500; }
  .adm-status { padding: 12px 16px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; border-radius: 4px; }
  .adm-status.ok { background: rgba(5,150,105,0.08); border-left: 3px solid #059669; color: #047857; }
  .adm-status.err { background: rgba(220,38,38,0.08); border-left: 3px solid #dc2626; color: #b91c1c; }
  .adm-settings-section { background: #fff; border: 1px solid #e8e4dc; margin-bottom: 16px; border-radius: 6px; }
  .adm-settings-head { padding: 16px 20px; border-bottom: 1px solid #f0ede5; }
  .adm-settings-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; color: #1a1a1a; }
  .adm-settings-sub { font-size: 11px; color: rgba(0,0,0,0.4); margin-top: 2px; }
  .adm-settings-body { padding: 20px; }
  .adm-empty { padding: 48px 24px; text-align: center; color: rgba(0,0,0,0.35); }
  .adm-empty-icon { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 56px; color: rgba(201,147,58,0.12); text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 12px; }
  .adm-empty p { font-size: 13px; letter-spacing: 0.06em; }
  .adm-stat-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 28px; }
  @media (min-width: 640px) { .adm-stat-grid { grid-template-columns: repeat(4,1fr); } }
  .adm-stat-card { background: #fff; border: 1px solid #e8e4dc; padding: 20px; position: relative; overflow: hidden; border-radius: 6px; }
  .adm-stat-num { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 40px; line-height: 1; margin-bottom: 4px; color: #c9933a; }
  .adm-stat-label { font-size: 10px; color: rgba(0,0,0,0.45); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; }
`

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const handleLogout = () => { logout(); navigate('/the-bills-manage/login') }

  const tabs = [
    { id: 'overview',     label: 'Overview',    icon: '📊', group: 'main' },
    { id: 'products',     label: 'Products',    icon: '👔', group: 'content' },
    { id: 'collections',  label: 'Collections', icon: '🗂️', group: 'content' },
    { id: 'settings',     label: 'Settings',    icon: '⚙️', group: 'system' },
    { id: 'account',      label: 'Account',     icon: '👤', group: 'system' },
  ]

  return (
    <>
      <style>{STYLES}</style>
      <div className="adm-root">
        <nav className="adm-topbar">
          <div className="adm-topbar-left">
            <div className="adm-logo-badge">TB</div>
            <div>
              <div className="adm-logo-name">The Bills</div>
              <div className="adm-logo-sub">Admin Dashboard</div>
            </div>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-admin-email">{admin?.email}</span>
            <a href="/" target="_blank" className="adm-btn-site">View Site</a>
            <button onClick={handleLogout} className="adm-btn-logout">Logout</button>
          </div>
        </nav>

        <div className="adm-layout">
          <aside className="adm-sidebar">
            {['main','content','system'].map(group => (
              <div key={group}>
                <div className="adm-sidebar-label">{group}</div>
                {tabs.filter(t => t.group === group).map(tab => (
                  <button key={tab.id}
                    className={`adm-nav-btn${activeTab === tab.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}>
                    <span className="adm-nav-icon">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <main className="adm-main">
            {activeTab === 'overview'    && <OverviewTab />}
            {activeTab === 'products'    && <ProductsTab />}
            {activeTab === 'collections' && <CollectionsTab />}
            {activeTab === 'settings'    && <SettingsTab />}
            {activeTab === 'account'     && <AccountTab />}
          </main>
        </div>

        <div className="adm-mobile-nav">
          {tabs.map(tab => (
            <button key={tab.id}
              className={`adm-mobile-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="adm-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-head">
          <span className="adm-modal-title">{title}</span>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="adm-field">
      <label className="adm-label">{label}</label>
      {children}
    </div>
  )
}

function OverviewTab() {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])

  useEffect(() => {
    fetchAllProducts().then(setProducts).catch(console.error)
    fetchAllCollections().then(setCollections).catch(console.error)
  }, [])

  const stats = [
    { label: 'Products',    value: products.length,                        icon: '👔' },
    { label: 'Collections', value: collections.length,                     icon: '🗂️' },
    { label: 'Available',   value: products.filter(p => p.available).length, icon: '✅' },
    { label: 'Featured',    value: products.filter(p => p.featured).length,  icon: '⭐' },
  ]

  return (
    <div>
      <h2 className="adm-page-title"><span>📊</span>Overview</h2>
      <div className="adm-stat-grid">
        {stats.map(s => (
          <div key={s.label} className="adm-stat-card">
            <div style={{ position:'absolute', top:14, right:14, fontSize:20, opacity:0.2 }}>{s.icon}</div>
            <div className="adm-stat-num">{s.value}</div>
            <div className="adm-stat-label">{s.label}</div>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#c9933a' }} />
          </div>
        ))}
      </div>
      <div className="adm-card">
        <div className="adm-card-head"><span className="adm-card-title">Recent Products</span></div>
        {products.length === 0
          ? <div className="adm-empty"><p>No products yet.</p></div>
          : products.slice(0,6).map(p => (
            <div key={p._id} className="adm-row">
              {p.images?.[0]
                ? <img src={p.images[0]} alt={p.name} style={{ width:44, height:44, objectFit:'cover', flexShrink:0, borderRadius:4 }} />
                : <div style={{ width:44, height:44, background:'#f5f2ea', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16, color:'rgba(201,147,58,0.4)', borderRadius:4 }}>TB</div>
              }
              <div style={{ flex:1, minWidth:0 }}>
                <div className="adm-row-name">{p.name}</div>
                <div className="adm-row-sub">{p.category} · {p.collection} · {p.price}</div>
              </div>
              <span className={`adm-badge ${p.available ? 'adm-badge-green' : 'adm-badge-red'}`}>{p.available ? 'Live' : 'Hidden'}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts]     = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState({ name:'', description:'', price:'', category:'', collection:'', available:true, featured:false, order:0 })
  const [images, setImages]         = useState([])
  const [saving, setSaving]         = useState(false)

  useEffect(() => {
    load()
    fetchAllCollections().then(setCollections).catch(console.error)
  }, [])

  const load = () => fetchAllProducts().then(d => { setProducts(d); setLoading(false) }).catch(console.error)
  const openAdd  = () => { setEditing(null); setForm({ name:'',description:'',price:'',category:'',collection:'',available:true,featured:false,order:0 }); setImages([]); setModal(true) }
  const openEdit = p => { setEditing(p); setForm({ name:p.name,description:p.description,price:p.price,category:p.category,collection:p.collection||'',available:p.available,featured:p.featured,order:p.order||0 }); setImages([]); setModal(true) }

  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k,v))
      images.forEach(img => fd.append('images', img))
      editing ? await updateProduct(editing._id, fd) : await createProduct(fd)
      load(); setModal(false)
    } catch(e){ console.error(e) } finally { setSaving(false) }
  }

  const del = async id => { if (!confirm('Delete this product?')) return; await deleteProduct(id); load() }

  const toggle = async p => {
    const fd = new FormData()
    fd.append('name',p.name); fd.append('description',p.description)
    fd.append('price',p.price); fd.append('category',p.category); fd.append('collection',p.collection||'')
    fd.append('available',!p.available); fd.append('featured',p.featured); fd.append('order',p.order||0)
    await updateProduct(p._id, fd); load()
  }

  return (
    <div>
      <div className="adm-section-head">
        <h2 className="adm-page-title"><span>👔</span>Products</h2>
        <button className="adm-btn adm-btn-gold" onClick={openAdd}>+ Add Product</button>
      </div>
      <div className="adm-card">
        {loading
          ? <div className="adm-empty"><p>Loading…</p></div>
          : products.length === 0
            ? <div className="adm-empty"><div className="adm-empty-icon">TB</div><p>No products yet.</p></div>
            : products.map(p => (
              <div key={p._id} className="adm-row">
                {p.images?.[0]
                  ? <img src={p.images[0]} alt={p.name} style={{ width:52,height:52,objectFit:'cover',flexShrink:0, borderRadius:4 }} />
                  : <div style={{ width:52,height:52,background:'#f5f2ea',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18,color:'rgba(201,147,58,0.4)',fontFamily:"'Cormorant Garamond',serif", borderRadius:4 }}>TB</div>
                }
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="adm-row-name">{p.name}</div>
                  <div className="adm-row-sub">{p.category} {p.collection && `· ${p.collection}`} · {p.price}</div>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                  <button className={`adm-badge ${p.available ? 'adm-badge-green' : 'adm-badge-red'}`} style={{ cursor:'pointer', border:'none' }} onClick={() => toggle(p)}>{p.available ? 'Live' : 'Hidden'}</button>
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  <button className="adm-btn adm-btn-red adm-btn-sm" onClick={() => del(p._id)}>Del</button>
                </div>
              </div>
            ))
        }
      </div>
      {modal && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setModal(false)}>
          <Field label="Product Name"><input className="adm-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Ankara Blazer" /></Field>
          <Field label="Description"><textarea className="adm-input" rows={3} value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></Field>
          <div className="adm-two-col">
            <Field label="Price"><input className="adm-input" value={form.price} onChange={e => setForm({...form,price:e.target.value})} placeholder="e.g. GHS 450" /></Field>
            <Field label="Category"><input className="adm-input" value={form.category} onChange={e => setForm({...form,category:e.target.value})} placeholder="e.g. Blazers" /></Field>
          </div>
          <Field label="Collection">
            <select className="adm-input" value={form.collection} onChange={e => setForm({...form,collection:e.target.value})}>
              <option value="">No collection</option>
              {collections.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Images (up to 5)">
            <input type="file" accept="image/*" multiple className="adm-input" onChange={e => setImages(Array.from(e.target.files))} />
            {editing?.images?.length > 0 && images.length === 0 && (
              <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                {editing.images.map((img,i) => <img key={i} src={img} alt="" style={{ height:60, objectFit:'cover', borderRadius:4 }} />)}
              </div>
            )}
          </Field>
          <div className="adm-two-col">
            <Field label="Display Order"><input type="number" className="adm-input" value={form.order} onChange={e => setForm({...form,order:e.target.value})} /></Field>
            <div style={{ display:'flex', flexDirection:'column', gap:10, justifyContent:'flex-end', paddingBottom:2 }}>
              <label className="adm-check-label"><input type="checkbox" checked={form.available} onChange={e => setForm({...form,available:e.target.checked})} />Available on site</label>
              <label className="adm-check-label"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form,featured:e.target.checked})} />Featured piece</label>
            </div>
          </div>
          <button className="adm-btn adm-btn-dark" style={{ width:'100%', padding:'13px' }} onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update Product' : 'Add Product'}</button>
        </Modal>
      )}
    </div>
  )
}

function CollectionsTab() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading]         = useState(true)
  const [modal, setModal]             = useState(false)
  const [editing, setEditing]         = useState(null)
  const [form, setForm]               = useState({ name:'', description:'', active:true, order:0 })
  const [saving, setSaving]           = useState(false)

  useEffect(() => { load() }, [])
  const load = () => fetchAllCollections().then(d => { setCollections(d); setLoading(false) }).catch(console.error)
  const openAdd  = () => { setEditing(null); setForm({ name:'',description:'',active:true,order:0 }); setModal(true) }
  const openEdit = c => { setEditing(c); setForm({ name:c.name,description:c.description,active:c.active,order:c.order||0 }); setModal(true) }

  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k,v))
      editing ? await updateCollection(editing._id, fd) : await createCollection(fd)
      load(); setModal(false)
    } catch(e){ console.error(e) } finally { setSaving(false) }
  }

  const del = async id => { if (!confirm('Delete?')) return; await deleteCollection(id); load() }

  return (
    <div>
      <div className="adm-section-head">
        <h2 className="adm-page-title"><span>🗂️</span>Collections</h2>
        <button className="adm-btn adm-btn-gold" onClick={openAdd}>+ Add Collection</button>
      </div>
      <div className="adm-card">
        {loading
          ? <div className="adm-empty"><p>Loading…</p></div>
          : collections.length === 0
            ? <div className="adm-empty"><div className="adm-empty-icon">TB</div><p>No collections yet.</p></div>
            : collections.map(c => (
              <div key={c._id} className="adm-row">
                <div style={{ width:44,height:44,background:'#f5f2ea',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:16,color:'rgba(201,147,58,0.4)',fontFamily:"'Cormorant Garamond',serif", borderRadius:4 }}>🗂️</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="adm-row-name">{c.name}</div>
                  <div className="adm-row-sub">{c.description}</div>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                  <span className={`adm-badge ${c.active ? 'adm-badge-green' : 'adm-badge-red'}`}>{c.active ? 'Active' : 'Hidden'}</span>
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(c)}>Edit</button>
                  <button className="adm-btn adm-btn-red adm-btn-sm" onClick={() => del(c._id)}>Del</button>
                </div>
              </div>
            ))
        }
      </div>
      {modal && (
        <Modal title={editing ? 'Edit Collection' : 'Add Collection'} onClose={() => setModal(false)}>
          <Field label="Collection Name"><input className="adm-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Modern Executive Suits" /></Field>
          <Field label="Description"><textarea className="adm-input" rows={3} value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></Field>
          <div className="adm-two-col">
            <Field label="Display Order"><input type="number" className="adm-input" value={form.order} onChange={e => setForm({...form,order:e.target.value})} /></Field>
            <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:2 }}><label className="adm-check-label"><input type="checkbox" checked={form.active} onChange={e => setForm({...form,active:e.target.checked})} />Active on site</label></div>
          </div>
          <button className="adm-btn adm-btn-dark" style={{ width:'100%', padding:'13px' }} onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Collection'}</button>
        </Modal>
      )}
    </div>
  )
}

function SettingsTab() {
  const [form, setForm] = useState({ brandName:'', tagline:'', phone:'', whatsapp:'', email:'', instagram:'', facebook:'', tiktok:'', about:'' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetchSettings().then(data => { setForm(prev => ({...prev,...data})); setLoading(false) }).catch(console.error)
  }, [])

  const save = async () => {
    setSaving(true)
    try { await saveSettings(form); setSaved(true); setTimeout(() => setSaved(false), 3000) }
    catch(e){ console.error(e) } finally { setSaving(false) }
  }

  if (loading) return <div className="adm-empty"><p>Loading…</p></div>

  return (
    <div>
      <div className="adm-section-head">
        <h2 className="adm-page-title"><span>⚙️</span>Settings</h2>
        <button className="adm-btn adm-btn-gold" style={{ padding:'10px 24px' }} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
      <div className="adm-settings-section">
        <div className="adm-settings-head"><div className="adm-settings-title">Brand Information</div></div>
        <div className="adm-settings-body">
          <div className="adm-two-col" style={{ marginBottom:14 }}>
            <Field label="Brand Name"><input className="adm-input" value={form.brandName} onChange={e => setForm({...form,brandName:e.target.value})} /></Field>
            <Field label="Tagline"><input className="adm-input" value={form.tagline} onChange={e => setForm({...form,tagline:e.target.value})} /></Field>
          </div>
          <Field label="About"><textarea className="adm-input" rows={4} value={form.about} onChange={e => setForm({...form,about:e.target.value})} /></Field>
        </div>
      </div>
      <div className="adm-settings-section">
        <div className="adm-settings-head"><div className="adm-settings-title">Contact Details</div></div>
        <div className="adm-settings-body">
          <div className="adm-two-col" style={{ marginBottom:14 }}>
            <Field label="Phone"><input className="adm-input" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="+233 000 000 000" /></Field>
            <Field label="WhatsApp (with country code)"><input className="adm-input" value={form.whatsapp} onChange={e => setForm({...form,whatsapp:e.target.value})} placeholder="233000000000" /></Field>
          </div>
          <Field label="Email"><input className="adm-input" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></Field>
        </div>
      </div>
      <div className="adm-settings-section">
        <div className="adm-settings-head"><div className="adm-settings-title">Social Media</div></div>
        <div className="adm-settings-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            <Field label="Instagram"><input className="adm-input" value={form.instagram} onChange={e => setForm({...form,instagram:e.target.value})} placeholder="https://instagram.com/..." /></Field>
            <Field label="Facebook"><input className="adm-input" value={form.facebook} onChange={e => setForm({...form,facebook:e.target.value})} placeholder="https://facebook.com/..." /></Field>
            <Field label="TikTok"><input className="adm-input" value={form.tiktok} onChange={e => setForm({...form,tiktok:e.target.value})} placeholder="https://tiktok.com/..." /></Field>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountTab() {
  const { admin } = useAuth()
  const [pwForm, setPwForm]           = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [pwSaving, setPwSaving]       = useState(false)
  const [pwStatus, setPwStatus]       = useState('')
  const [pwError, setPwError]         = useState('')
  const [adminForm, setAdminForm]     = useState({ email:'', password:'' })
  const [adminSaving, setAdminSaving] = useState(false)
  const [adminStatus, setAdminStatus] = useState('')
  const [adminError, setAdminError]   = useState('')
  const [admins, setAdmins]           = useState([])

  useEffect(() => { fetchAdmins().then(setAdmins).catch(console.error) }, [])

  const changePw = async () => {
    setPwError(''); setPwStatus('')
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) { setPwError('All fields required'); return }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return }
    if (pwForm.newPassword.length < 6) { setPwError('Minimum 6 characters'); return }
    setPwSaving(true)
    try { await changePassword({ currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword }); setPwStatus('ok'); setPwForm({ currentPassword:'',newPassword:'',confirmPassword:'' }); setTimeout(() => setPwStatus(''), 3000) }
    catch(e){ setPwError(e.response?.data?.error || 'Failed') } finally { setPwSaving(false) }
  }

  const addAdminFn = async () => {
    setAdminError(''); setAdminStatus('')
    if (!adminForm.email || !adminForm.password) { setAdminError('Email and password required'); return }
    setAdminSaving(true)
    try { await addAdmin(adminForm); setAdminStatus('ok'); setAdminForm({ email:'',password:'' }); fetchAdmins().then(setAdmins); setTimeout(() => setAdminStatus(''), 3000) }
    catch(e){ setAdminError(e.response?.data?.error || 'Failed') } finally { setAdminSaving(false) }
  }

  const delAdmin = async id => {
    if (!confirm('Remove this admin?')) return
    try { await deleteAdmin(id); fetchAdmins().then(setAdmins) }
    catch(e){ alert(e.response?.data?.error || 'Failed') }
  }

  return (
    <div>
      <h2 className="adm-page-title"><span>👤</span>Account</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div className="adm-settings-section">
          <div className="adm-settings-head"><div className="adm-settings-title">🔒 Change Password</div><div className="adm-settings-sub">{admin?.email}</div></div>
          <div className="adm-settings-body" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Field label="Current Password"><input type="password" className="adm-input" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm,currentPassword:e.target.value})} /></Field>
            <Field label="New Password"><input type="password" className="adm-input" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm,newPassword:e.target.value})} /></Field>
            <Field label="Confirm Password"><input type="password" className="adm-input" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm,confirmPassword:e.target.value})} /></Field>
            {pwError && <div className="adm-status err">✕ {pwError}</div>}
            {pwStatus === 'ok' && <div className="adm-status ok">✓ Password changed!</div>}
            <button className="adm-btn adm-btn-dark" style={{ width:'100%', padding:'12px' }} onClick={changePw} disabled={pwSaving}>{pwSaving ? 'Changing…' : 'Change Password'}</button>
          </div>
        </div>
        <div className="adm-settings-section">
          <div className="adm-settings-head"><div className="adm-settings-title">➕ Add Admin</div></div>
          <div className="adm-settings-body" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Field label="Email"><input type="email" className="adm-input" value={adminForm.email} onChange={e => setAdminForm({...adminForm,email:e.target.value})} /></Field>
            <Field label="Password"><input type="password" className="adm-input" value={adminForm.password} onChange={e => setAdminForm({...adminForm,password:e.target.value})} /></Field>
            {adminError && <div className="adm-status err">✕ {adminError}</div>}
            {adminStatus === 'ok' && <div className="adm-status ok">✓ Admin added!</div>}
            <button className="adm-btn adm-btn-gold" style={{ width:'100%', padding:'12px' }} onClick={addAdminFn} disabled={adminSaving}>{adminSaving ? 'Adding…' : 'Add Admin'}</button>
          </div>
        </div>
      </div>
      <div className="adm-card">
        <div className="adm-card-head"><span className="adm-card-title">All Admins ({admins.length})</span></div>
        {admins.map(a => (
          <div key={a._id} className="adm-row">
            <div style={{ width:36,height:36,background:'#f5f2ea',color:'#c9933a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,flexShrink:0, borderRadius:4 }}>{a.email?.charAt(0).toUpperCase()}</div>
            <div style={{ flex:1 }}>
              <div className="adm-row-name">{a.email}</div>
              <div className="adm-row-sub">Added {new Date(a.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
            </div>
            {a.email === admin?.email
              ? <span className="adm-badge adm-badge-gold">You</span>
              : <button className="adm-btn adm-btn-red adm-btn-sm" onClick={() => delAdmin(a._id)}>Remove</button>
            }
          </div>
        ))}
      </div>
    </div>
  )
}