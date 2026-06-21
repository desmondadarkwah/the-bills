import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchVendorPublic, trackProductView, trackProductClick, fetchSettings } from '../utils/api'

const WhatsAppIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function VendorStorefront() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor]     = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [viewProduct, setViewProduct] = useState(null)
  const [activeImg, setActiveImg]     = useState(0)
  const [siteSettings, setSiteSettings] = useState({})

  useEffect(() => {
    fetchVendorPublic(id)
      .then(data => { setVendor(data.vendor); setProducts(data.products) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
    fetchSettings().then(setSiteSettings).catch(console.error)
  }, [id])

  useEffect(() => {
    document.body.style.overflow = viewProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [viewProduct])

  const openView = (product) => {
    setViewProduct(product)
    setActiveImg(0)
    trackProductView(product._id)
  }
  const closeView = () => setViewProduct(null)

  const handleWhatsApp = (product) => {
    trackProductClick(product._id)
    const targetNumber = vendor?.whatsapp || siteSettings?.whatsapp || '233546805804'
    const msg = `Hello ${vendor?.shopName}!\n\nI'm interested in:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${product.price}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0806', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'#c9933a', fontFamily:'Georgia,serif', fontSize:16, letterSpacing:'0.2em', textTransform:'uppercase' }}>Loading…</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0806', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#c9933a', textTransform:'uppercase', letterSpacing:'0.1em' }}>Shop Not Found</div>
        <button onClick={() => navigate('/')} style={{ padding:'12px 32px', background:'transparent', border:'1px solid rgba(201,147,58,0.4)', color:'#c9933a', fontFamily:'Barlow,sans-serif', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>Back to Home</button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Barlow:wght@300;400;500&display=swap');

        .vs-root { min-height: 100vh; background: #0a0806; font-family: 'Barlow', sans-serif; color: #f5ede0; }
        .vs-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(10,8,6,0.95); border-bottom: 1px solid rgba(201,147,58,0.12);
          backdrop-filter: blur(12px); padding: 20px 48px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .vs-nav-logo { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #f5ede0; text-decoration: none; display: flex; align-items: center; gap: 10px; }
        .vs-nav-logo-dot { width: 6px; height: 6px; background: #c9933a; border-radius: 50%; }
        .vs-nav-back { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(245,237,224,0.4); background: none; border: none; cursor: pointer; }
        .vs-nav-back:hover { color: #c9933a; }

        .vs-hero {
          padding: 70px 48px 48px; border-bottom: 1px solid rgba(201,147,58,0.1);
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
        }
        .vs-avatar {
          width: 88px; height: 88px; flex-shrink: 0;
          background: linear-gradient(160deg,#1a1208,#0d0a06);
          border: 1px solid rgba(201,147,58,0.25);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 32px; color: #c9933a;
        }
        .vs-hero-info {}
        .vs-shop-name {
          font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: clamp(28px, 4vw, 42px);
          color: #f5ede0; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 6px;
          display: flex; align-items: center; gap: 10px;
        }
        .vs-verified-badge {
          font-size: 10px; background: rgba(201,147,58,0.15); color: #c9933a;
          border: 1px solid rgba(201,147,58,0.3); padding: 3px 10px; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .vs-bio { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: rgba(245,237,224,0.4); max-width: 520px; line-height: 1.6; }
        .vs-meta { display: flex; gap: 20px; margin-top: 14px; flex-wrap: wrap; }
        .vs-meta-item { font-size: 11px; color: rgba(245,237,224,0.3); letter-spacing: 0.06em; }
        .vs-meta-item span { color: #c9933a; font-weight: 600; }

        .vs-body { max-width: 1200px; margin: 0 auto; padding: 48px; }
        .vs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }
        .vs-card { position: relative; overflow: hidden; background: #100e0a; cursor: pointer; }
        .vs-card-img { width: 100%; height: 380px; object-fit: cover; display: block; transition: transform 0.6s; }
        .vs-card:hover .vs-card-img { transform: scale(1.05); }
        .vs-card-placeholder { width: 100%; height: 380px; background: linear-gradient(160deg,#1a1208,#0d0a06); display: flex; align-items: center; justify-content: center; }
        .vs-card-placeholder span { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 64px; color: rgba(201,147,58,0.07); }
        .vs-card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 20px 16px; background: linear-gradient(to top, rgba(10,8,6,0.97), transparent); }
        .vs-card-category { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9933a; margin-bottom: 5px; }
        .vs-card-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 18px; color: #f5ede0; text-transform: uppercase; margin-bottom: 3px; }
        .vs-card-price { font-size: 11px; color: rgba(245,237,224,0.35); }

        .vs-empty { padding: 100px 0; text-align: center; }
        .vs-empty-text { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 20px; color: rgba(245,237,224,0.2); }

        .vs-view-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(5,4,3,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 32px; }
        .vs-view-modal { width: 100%; max-width: 920px; max-height: 88vh; background: #0d0a06; border: 1px solid rgba(201,147,58,0.18); display: grid; grid-template-columns: 1.1fr 1fr; overflow: hidden; position: relative; }
        .vs-view-close { position: absolute; top: 16px; right: 16px; z-index: 10; width: 38px; height: 38px; background: rgba(10,8,6,0.85); border: 1px solid rgba(201,147,58,0.3); color: #f5ede0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .vs-view-img-main { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 320px; max-height: 560px; }
        .vs-view-img-placeholder { width: 100%; min-height: 320px; background: linear-gradient(160deg,#1a1208,#0d0a06); display: flex; align-items: center; justify-content: center; }
        .vs-view-body { padding: 40px 36px; display: flex; flex-direction: column; overflow-y: auto; }
        .vs-view-category { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9933a; margin-bottom: 12px; }
        .vs-view-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 28px; color: #f5ede0; text-transform: uppercase; margin-bottom: 10px; }
        .vs-view-price { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #c9933a; margin-bottom: 20px; }
        .vs-view-desc { font-size: 13px; line-height: 1.8; color: rgba(245,237,224,0.55); margin-bottom: 24px; }
        .vs-view-enquire { width: 100%; padding: 14px; background: transparent; color: #c9933a; border: 1px solid #c9933a; cursor: pointer; font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .vs-view-enquire:hover { background: #c9933a; color: #0a0806; }

        @media (max-width: 768px) {
          .vs-nav { padding: 16px 24px; }
          .vs-hero { padding: 50px 24px 32px; }
          .vs-body { padding: 32px 24px; }
          .vs-view-modal { grid-template-columns: 1fr; max-height: 92vh; }
          .vs-view-img-main { max-height: 300px; min-height: 240px; }
          .vs-view-body { padding: 28px 24px; }
        }
      `}</style>

      <div className="vs-root">
        <nav className="vs-nav">
          <a href="/" className="vs-nav-logo">
            <div className="vs-nav-logo-dot" />
            The Bills
          </a>
          <button className="vs-nav-back" onClick={() => navigate('/')}>← Back to Marketplace</button>
        </nav>

        <div className="vs-hero">
          <div className="vs-avatar">
            {vendor.logo ? <img src={vendor.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : vendor.shopName?.charAt(0).toUpperCase()}
          </div>
          <div className="vs-hero-info">
            <div className="vs-shop-name">
              {vendor.shopName}
              {vendor.verified && <span className="vs-verified-badge">✓ Verified Shop</span>}
            </div>
            {vendor.bio && <p className="vs-bio">{vendor.bio}</p>}
            <div className="vs-meta">
              <div className="vs-meta-item"><span>{products.length}</span> Products</div>
              <div className="vs-meta-item">Member since <span>{new Date(vendor.createdAt).getFullYear()}</span></div>
            </div>
          </div>
        </div>

        <div className="vs-body">
          {products.length === 0 ? (
            <div className="vs-empty"><div className="vs-empty-text">This shop has no products yet.</div></div>
          ) : (
            <div className="vs-grid">
              {products.map(p => (
                <div key={p._id} className="vs-card" onClick={() => openView(p)}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} className="vs-card-img" />
                    : <div className="vs-card-placeholder"><span>TB</span></div>
                  }
                  <div className="vs-card-info">
                    <div className="vs-card-category">{p.category}</div>
                    <div className="vs-card-name">{p.name}</div>
                    <div className="vs-card-price">{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewProduct && (
        <div className="vs-view-backdrop" onClick={e => e.target === e.currentTarget && closeView()}>
          <div className="vs-view-modal">
            <button className="vs-view-close" onClick={closeView}><CloseIcon /></button>
            {viewProduct.images?.[activeImg]
              ? <img src={viewProduct.images[activeImg]} alt={viewProduct.name} className="vs-view-img-main" />
              : <div className="vs-view-img-placeholder"><span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:80, color:'rgba(201,147,58,0.08)' }}>TB</span></div>
            }
            <div className="vs-view-body">
              <div className="vs-view-category">{viewProduct.category}</div>
              <div className="vs-view-name">{viewProduct.name}</div>
              <div className="vs-view-price">{viewProduct.price}</div>
              <p className="vs-view-desc">{viewProduct.description || 'No description provided.'}</p>
              <button className="vs-view-enquire" onClick={() => handleWhatsApp(viewProduct)}>
                <WhatsAppIcon /> Enquire on This Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}