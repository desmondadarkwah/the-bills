import { useState, useEffect } from 'react'
import { fetchProducts, fetchSettings, removeFromWishlistDB } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import logo from '../assets/billLogo.png'

const WhatsAppIcon = () => (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" fill={filled ? '#c9933a' : 'none'} stroke="#c9933a" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)

export default function Wishlist() {
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading]   = useState(true)
  const [settings, setSettings] = useState({})
  const navigate = useNavigate()
  const { user, updateWishlist } = useUserAuth()

  useEffect(() => {
    fetchSettings().then(setSettings).catch(console.error)

    if (user) {
      // Logged in — use DB wishlist
      const ids = user.wishlist?.map(p => p._id || p) || []
      setWishlist(ids)
      fetchProducts()
        .then(all => setProducts(all.filter(p => ids.includes(p._id))))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      // Not logged in — use localStorage
      const saved = localStorage.getItem('bills_wishlist')
      const ids = saved ? JSON.parse(saved) : []
      setWishlist(ids)
      fetchProducts()
        .then(all => setProducts(all.filter(p => ids.includes(p._id))))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [user])

  const removeFromWishlist = async (id) => {
    if (user) {
      try {
        const updated = await removeFromWishlistDB(id)
        const ids = updated.map(p => p._id || p)
        setWishlist(ids)
        setProducts(prev => prev.filter(p => p._id !== id))
        updateWishlist(updated)
      } catch(e) { console.error(e) }
    } else {
      const updated = wishlist.filter(w => w !== id)
      setWishlist(updated)
      setProducts(prev => prev.filter(p => p._id !== id))
      localStorage.setItem('bills_wishlist', JSON.stringify(updated))
    }
  }

  const handleEnquireSingle = (product) => {
    const msg = `Hello The Bills!\n\nI'm interested in:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${product.price}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233546805804'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleEnquireAll = () => {
    const list = products.map((p, i) => `${i + 1}. *${p.name}* — ${p.price}`).join('\n')
    const msg = `Hello The Bills!\n\nI'm interested in the following saved pieces:\n\n${list}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233546805804'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const clearAll = async () => {
    if (user) {
      try {
        for (const id of wishlist) { await removeFromWishlistDB(id) }
        updateWishlist([])
      } catch(e) { console.error(e) }
    } else {
      localStorage.removeItem('bills_wishlist')
    }
    setWishlist([])
    setProducts([])
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow:wght@300;400;500&display=swap');
        .wl-root { min-height: 100vh; background: #0a0806; color: #f5ede0; font-family: 'Barlow', sans-serif; }
        .wl-nav { position: sticky; top: 0; z-index: 50; background: rgba(10,8,6,0.95); border-bottom: 1px solid rgba(201,147,58,0.1); backdrop-filter: blur(12px); padding: 18px 48px; display: flex; align-items: center; justify-content: space-between; }
        .wl-nav-logo { display: flex; align-items: center; gap: 11px; font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 19px; letter-spacing: 0.2em; text-transform: uppercase; color: #f5ede0; text-decoration: none; }
        .wl-nav-logo img { width: 32px; height: 32px; object-fit: contain; display: block; flex-shrink: 0; }
        .wl-nav-back { font-size: 9.5px; letter-spacing: 0.26em; text-transform: uppercase; color: rgba(245,237,224,0.35); background: none; border: none; cursor: pointer; transition: color 0.2s; display: flex; align-items: center; gap: 8px; }
        .wl-nav-back:hover { color: #c9933a; }
        .wl-nav-user { display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,237,224,0.3); }
        .wl-nav-user-dot { width: 6px; height: 6px; background: #c9933a; border-radius: 50%; }
        .wl-hero { padding: 72px 48px 44px; border-bottom: 1px solid rgba(201,147,58,0.09); }
        .wl-eyebrow { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .wl-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .wl-eyebrow span { font-size: 9.5px; letter-spacing: 0.36em; text-transform: uppercase; color: #c9933a; }
        .wl-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(48px, 7vw, 88px); line-height: 0.9; letter-spacing: -0.02em; color: #f5ede0; text-transform: uppercase; margin: 0 0 14px; }
        .wl-title em { font-style: italic; color: #c9933a; }
        .wl-subtitle { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic; font-size: 17px; color: rgba(245,237,224,0.3); letter-spacing: 0.04em; }
        .wl-sync-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9933a; }
        .wl-sync-badge-dot { width: 5px; height: 5px; background: #c9933a; border-radius: 50%; }
        .wl-body { max-width: 1200px; margin: 0 auto; padding: 44px 48px 120px; }
        .wl-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .wl-count { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: rgba(245,237,224,0.38); letter-spacing: 0.06em; }
        .wl-count span { color: #c9933a; }
        .wl-toolbar-actions { display: flex; gap: 10px; }
        .wl-btn { font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; padding: 11px 26px; border: none; cursor: pointer; transition: all 0.22s; display: flex; align-items: center; gap: 8px; }
        .wl-btn-wa { background: transparent; color: #c9933a; border: 1px solid #c9933a; }
        .wl-btn-wa:hover { background: #c9933a; color: #0a0806; }
        .wl-btn-clear { background: transparent; color: rgba(245,237,224,0.28); border: 1px solid rgba(245,237,224,0.09); }
        .wl-btn-clear:hover { border-color: rgba(245,237,224,0.2); color: rgba(245,237,224,0.5); }
        .wl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2px; }
        .wl-card { position: relative; overflow: hidden; background: #111009; }
        .wl-card-img { width: 100%; height: 380px; object-fit: cover; display: block; transition: transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94); }
        .wl-card:hover .wl-card-img { transform: scale(1.05); }
        .wl-card-placeholder { width: 100%; height: 380px; background: linear-gradient(135deg, #1a1208, #0d0a06); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 64px; color: rgba(201,147,58,0.06); letter-spacing: -0.04em; }
        .wl-remove-btn { position: absolute; top: 14px; right: 14px; z-index: 3; width: 34px; height: 34px; background: rgba(10,8,6,0.7); border: 1px solid rgba(201,147,58,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); }
        .wl-remove-btn:hover { background: rgba(200,30,30,0.2); border-color: rgba(220,60,60,0.45); }
        .wl-card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 36px 20px 18px; background: linear-gradient(to top, rgba(10,8,6,0.97) 0%, transparent 100%); pointer-events: none; }
        .wl-card-category { font-size: 8.5px; letter-spacing: 0.28em; text-transform: uppercase; color: #c9933a; margin-bottom: 5px; }
        .wl-card-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 19px; color: #f5ede0; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 3px; }
        .wl-card-price { font-size: 11px; color: rgba(245,237,224,0.32); letter-spacing: 0.1em; }
        .wl-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.08) 60%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .wl-card:hover .wl-card-overlay { opacity: 1; pointer-events: auto; }
        .wl-card-enquire { width: 100%; padding: 11px; background: transparent; color: #c9933a; border: 1px solid #c9933a; cursor: pointer; font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 7px; transition: all 0.2s; }
        .wl-card-enquire:hover { background: #c9933a; color: #0a0806; }
        .wl-empty { padding: 120px 48px; text-align: center; }
        .wl-empty-icon { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 120px; color: rgba(201,147,58,0.04); letter-spacing: -0.04em; text-transform: uppercase; margin-bottom: 24px; line-height: 1; }
        .wl-empty-text { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic; font-size: 21px; color: rgba(245,237,224,0.2); margin-bottom: 32px; line-height: 1.6; }
        .wl-empty-btn { font-size: 9.5px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; padding: 14px 36px; background: #c9933a; color: #0a0806; border: none; cursor: pointer; transition: opacity 0.2s; }
        .wl-empty-btn:hover { opacity: 0.85; }
        .wl-empty-login { margin-top: 16px; font-size: 11px; color: rgba(245,237,224,0.2); }
        .wl-empty-login a { color: #c9933a; text-decoration: none; }
        .wl-sticky-footer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(8,6,4,0.97); border-top: 1px solid rgba(201,147,58,0.12); padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; gap: 16px; backdrop-filter: blur(12px); }
        .wl-sticky-text { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: rgba(245,237,224,0.45); letter-spacing: 0.04em; }
        .wl-sticky-text span { color: #c9933a; }
        @media (max-width: 768px) {
          .wl-nav { padding: 16px 24px; }
          .wl-hero { padding: 56px 24px 32px; }
          .wl-body { padding: 32px 24px 100px; }
          .wl-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
          .wl-sticky-footer { padding: 14px 24px; flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) { .wl-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="wl-root">
        <nav className="wl-nav">
          <a href="/" className="wl-nav-logo">
            <img src={logo} alt="The Bills" />
            The Bills
          </a>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            {user && (
              <div className="wl-nav-user">
                <div className="wl-nav-user-dot" />
                {user.name?.split(' ')[0]}
              </div>
            )}
            <button className="wl-nav-back" onClick={() => navigate('/')}>
              <ArrowLeftIcon /> Back
            </button>
          </div>
        </nav>

        <div className="wl-hero">
          <div className="wl-eyebrow">
            <div className="wl-eyebrow-line" />
            <span>Your Saved Pieces</span>
          </div>
          <h1 className="wl-title">My <em>Wishlist</em></h1>
          <p className="wl-subtitle">Pieces you love — ready to enquire anytime.</p>
          {user && (
            <div className="wl-sync-badge">
              <div className="wl-sync-badge-dot" />
              Synced across your devices
            </div>
          )}
        </div>

        <div className="wl-body">
          {loading ? (
            <div className="wl-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height:380, background:'linear-gradient(135deg,#1a1208,#0d0a06)', opacity:0.5 }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">TB</div>
              <div className="wl-empty-text">No saved pieces yet.<br />Tap ♡ on any piece to save it here.</div>
              <button className="wl-empty-btn" onClick={() => navigate('/')}>Browse Collections</button>
              {!user && (
                <div className="wl-empty-login">
                  <a href="/login">Sign in</a> to sync your wishlist across devices
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="wl-toolbar">
                <div className="wl-count">
                  <span>{products.length}</span> saved {products.length === 1 ? 'piece' : 'pieces'}
                </div>
                <div className="wl-toolbar-actions">
                  <button className="wl-btn wl-btn-clear" onClick={clearAll}>Clear All</button>
                  <button className="wl-btn wl-btn-wa" onClick={handleEnquireAll}>
                    <WhatsAppIcon /> Enquire on All
                  </button>
                </div>
              </div>

              <div className="wl-grid">
                {products.map(product => (
                  <div key={product._id} className="wl-card">
                    <button className="wl-remove-btn" onClick={() => removeFromWishlist(product._id)}>
                      <HeartIcon filled={true} />
                    </button>
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name} className="wl-card-img" />
                      : <div className="wl-card-placeholder">TB</div>
                    }
                    <div className="wl-card-info">
                      <div className="wl-card-category">{product.category}</div>
                      <div className="wl-card-name">{product.name}</div>
                      <div className="wl-card-price">{product.price}</div>
                    </div>
                    <div className="wl-card-overlay">
                      <button className="wl-card-enquire" onClick={() => handleEnquireSingle(product)}>
                        <WhatsAppIcon /> Enquire on This Piece
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {products.length > 0 && (
          <div className="wl-sticky-footer">
            <div className="wl-sticky-text">
              <span>{products.length}</span> {products.length === 1 ? 'piece' : 'pieces'} saved
              {user && <span style={{ fontSize:10, marginLeft:12, color:'rgba(201,147,58,0.4)', letterSpacing:'0.1em' }}>· Synced</span>}
            </div>
            <button className="wl-btn wl-btn-wa" onClick={handleEnquireAll}>
              <WhatsAppIcon /> Enquire on All Saved Pieces
            </button>
          </div>
        )}
      </div>
    </>
  )
}