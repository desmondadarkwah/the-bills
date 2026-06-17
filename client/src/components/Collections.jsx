import { useState, useEffect } from 'react'
import { fetchProducts, fetchCollections } from '../utils/api'

const WhatsAppIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Collections({ settings }) {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCollections()])
      .then(([p, c]) => { setProducts(p); setCollections(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filters = ['All', ...collections.map(c => c.name)]
  const filtered = activeFilter === 'All' ? products : products.filter(p => p.category === activeFilter)

  const handleWhatsApp = (product) => {
    const msg = `Hello The Bills!\n\nI'm interested in: *${product.name}*\nPrice: ${product.price}\n\nPlease provide more details.`
    window.open(`https://wa.me/${settings?.whatsapp || '233000000000'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleDM = (product) => {
    window.open(settings?.instagram || 'https://instagram.com', '_blank')
  }

  return (
    <>
      <style>{`
        .col-root {
          background: #0a0806;
          padding: 120px 48px;
          position: relative;
        }
        .col-root::before {
          content: '';
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px; background: rgba(201,147,58,0.15);
        }
        .col-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 64px; gap: 40px; flex-wrap: wrap;
        }
        .col-header-left {}
        .col-eyebrow {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 16px;
        }
        .col-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .col-eyebrow span {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; letter-spacing: 0.35em;
          text-transform: uppercase; color: #c9933a;
        }
        .col-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 5vw, 64px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase; margin: 0;
        }
        .col-title em { font-style: italic; color: #c9933a; }
        .col-filters {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .col-filter-btn {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 8px 20px; border: 1px solid rgba(201,147,58,0.2);
          background: transparent; color: rgba(245,237,224,0.4);
          cursor: pointer; transition: all 0.2s;
        }
        .col-filter-btn:hover { border-color: rgba(201,147,58,0.5); color: rgba(245,237,224,0.7); }
        .col-filter-btn.active { background: #c9933a; color: #0a0806; border-color: #c9933a; }
        .col-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2px;
        }
        .col-card {
          position: relative; overflow: hidden;
          background: #111009;
          cursor: pointer;
        }
        .col-card-img {
          width: 100%; height: 420px;
          object-fit: cover; display: block;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .col-card:hover .col-card-img { transform: scale(1.05); }
        .col-card-placeholder {
          width: 100%; height: 420px;
          background: linear-gradient(135deg, #1a1208 0%, #0d0a06 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .col-card-placeholder-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 64px;
          color: rgba(201,147,58,0.08); letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .col-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.2) 50%, transparent 100%);
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
          opacity: 0; transition: opacity 0.3s;
        }
        .col-card:hover .col-card-overlay { opacity: 1; }
        .col-card-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 28px;
          background: linear-gradient(to top, rgba(10,8,6,0.98) 0%, transparent 100%);
        }
        .col-card-category {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; letter-spacing: 0.3em;
          text-transform: uppercase; color: #c9933a;
          margin-bottom: 6px;
        }
        .col-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500; font-size: 20px;
          color: #f5ede0; letter-spacing: 0.04em;
          margin-bottom: 4px; text-transform: uppercase;
        }
        .col-card-price {
          font-family: 'Barlow', sans-serif;
          font-size: 12px; color: rgba(245,237,224,0.4);
          letter-spacing: 0.1em;
        }
        .col-card-actions {
          display: flex; gap: 8px; margin-top: 16px;
        }
        .col-card-btn {
          flex: 1; padding: 10px 12px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.2s;
        }
        .col-card-btn:hover { opacity: 0.85; }
        .col-card-btn-wa { background: #25D366; color: #fff; }
        .col-card-btn-dm { background: rgba(201,147,58,0.15); color: #c9933a; border: 1px solid rgba(201,147,58,0.3); }
        .col-empty {
          grid-column: 1/-1; padding: 80px 0; text-align: center;
        }
        .col-empty-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 18px;
          color: rgba(245,237,224,0.2); letter-spacing: 0.1em;
        }
        @media (max-width: 768px) {
          .col-root { padding: 80px 24px; }
          .col-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2px; }
          .col-card-img { height: 340px; }
          .col-card-overlay { opacity: 1; }
        }
      `}</style>

      <section id="collections" className="col-root">
        <div className="col-header">
          <div className="col-header-left">
            <div className="col-eyebrow">
              <div className="col-eyebrow-line" />
              <span>The Collection</span>
            </div>
            <h2 className="col-title">Our <em>Pieces</em></h2>
          </div>
          <div className="col-filters">
            {filters.map(f => (
              <button key={f} className={`col-filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="col-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height:420, background:'linear-gradient(135deg,#1a1208,#0d0a06)', opacity:0.5 }} />
            ))}
          </div>
        ) : (
          <div className="col-grid">
            {filtered.length === 0 ? (
              <div className="col-empty">
                <div className="col-empty-text">No pieces available yet — check back soon.</div>
              </div>
            ) : (
              filtered.map(product => (
                <div key={product._id} className="col-card">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} className="col-card-img" />
                    : <div className="col-card-placeholder"><span className="col-card-placeholder-text">TB</span></div>
                  }
                  <div className="col-card-info">
                    <div className="col-card-category">{product.category}</div>
                    <div className="col-card-name">{product.name}</div>
                    <div className="col-card-price">{product.price}</div>
                  </div>
                  <div className="col-card-overlay">
                    <div className="col-card-actions">
                      <button className="col-card-btn col-card-btn-wa" onClick={() => handleWhatsApp(product)}>
                        <WhatsAppIcon /> WhatsApp
                      </button>
                      <button className="col-card-btn col-card-btn-dm" onClick={() => handleDM(product)}>
                        DM Us
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </>
  )
}