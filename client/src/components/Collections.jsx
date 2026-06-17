import { useState, useEffect } from 'react'
import { fetchProducts, fetchCollections } from '../utils/api'

const WhatsAppIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" fill={filled ? '#c9933a' : 'none'} stroke="#c9933a" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

export default function Collections({ settings }) {
  const [products, setProducts]       = useState([])
  const [collections, setCollections] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState([])
  const [wishlist, setWishlist]       = useState([])
  const [showWishlist, setShowWishlist] = useState(false)
  const [selectMode, setSelectMode]   = useState(false)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCollections()])
      .then(([p, c]) => { setProducts(p); setCollections(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
    // Load wishlist from localStorage
    const saved = localStorage.getItem('bills_wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  const filters = ['All', ...collections.map(c => c.name)]
  const filtered = activeFilter === 'All' ? products : products.filter(p => p.category === activeFilter)
  const wishlistProducts = products.filter(p => wishlist.includes(p._id))

  // Wishlist
  const toggleWishlist = (id) => {
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id]
    setWishlist(updated)
    localStorage.setItem('bills_wishlist', JSON.stringify(updated))
  }

  // Multi-select
  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const clearSelect = () => { setSelected([]); setSelectMode(false) }

  // WhatsApp
  const handleWhatsApp = (product) => {
    const msg = `Hello The Bills!\n\nI'm interested in:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${product.price}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233000000000'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleBulkWhatsApp = (items) => {
    const list = items.map((p, i) => `${i + 1}. *${p.name}* — ${p.price}`).join('\n')
    const msg = `Hello The Bills!\n\nI'm interested in the following pieces:\n\n${list}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233000000000'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleBulkEnquire = () => {
    const items = products.filter(p => selected.includes(p._id))
    handleBulkWhatsApp(items)
  }

  const handleWishlistEnquire = () => {
    handleBulkWhatsApp(wishlistProducts)
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
          margin-bottom: 48px; gap: 24px; flex-wrap: wrap;
        }
        .col-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 16px;
        }
        .col-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .col-eyebrow span {
          font-family: 'Barlow', sans-serif; font-size: 10px;
          letter-spacing: 0.35em; text-transform: uppercase; color: #c9933a;
        }
        .col-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 5vw, 64px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase; margin: 0;
        }
        .col-title em { font-style: italic; color: #c9933a; }
        .col-toolbar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .col-filters {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .col-filter-btn {
          font-family: 'Barlow', sans-serif; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 8px 20px; border: 1px solid rgba(201,147,58,0.2);
          background: transparent; color: rgba(245,237,224,0.4);
          cursor: pointer; transition: all 0.2s;
        }
        .col-filter-btn:hover { border-color: rgba(201,147,58,0.5); color: rgba(245,237,224,0.7); }
        .col-filter-btn.active { background: #c9933a; color: #0a0806; border-color: #c9933a; }
        .col-action-btn {
          font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 8px 20px; border: none; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .col-action-btn-select { background: rgba(201,147,58,0.1); color: #c9933a; border: 1px solid rgba(201,147,58,0.3); }
        .col-action-btn-select:hover { background: rgba(201,147,58,0.2); }
        .col-action-btn-select.active { background: #c9933a; color: #0a0806; }
        .col-action-btn-wishlist { background: transparent; color: rgba(245,237,224,0.5); border: 1px solid rgba(245,237,224,0.1); }
        .col-action-btn-wishlist:hover { border-color: #c9933a; color: #c9933a; }

        /* Bulk bar */
        .col-bulk-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 90;
          background: #0a0806; border-top: 1px solid rgba(201,147,58,0.2);
          padding: 16px 48px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.77,0,0.18,1);
        }
        .col-bulk-bar.visible { transform: translateY(0); }
        .col-bulk-bar-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 18px;
          color: #f5ede0; letter-spacing: 0.04em;
        }
        .col-bulk-bar-text span { color: #c9933a; }
        .col-bulk-actions { display: flex; gap: 10px; }
        .col-bulk-btn {
          font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 12px 28px; border: none; cursor: pointer; transition: opacity 0.2s;
        }
        .col-bulk-btn-wa { background: #25D366; color: #fff; }
        .col-bulk-btn-clear { background: transparent; color: rgba(245,237,224,0.4); border: 1px solid rgba(245,237,224,0.1); }
        .col-bulk-btn:hover { opacity: 0.85; }

        /* Grid */
        .col-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2px;
        }
        .col-card {
          position: relative; overflow: hidden;
          background: #111009; cursor: pointer;
        }
        .col-card.selected::after {
          content: '';
          position: absolute; inset: 0;
          border: 2px solid #c9933a;
          pointer-events: none; z-index: 3;
        }
        .col-card-img {
          width: 100%; height: 420px; object-fit: cover; display: block;
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
          color: rgba(201,147,58,0.08);
        }

        /* Heart button */
        .col-heart-btn {
          position: absolute; top: 16px; right: 16px; z-index: 4;
          width: 36px; height: 36px;
          background: rgba(10,8,6,0.7); border: 1px solid rgba(201,147,58,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px);
        }
        .col-heart-btn:hover { background: rgba(10,8,6,0.9); border-color: #c9933a; }

        /* Select checkbox */
        .col-select-check {
          position: absolute; top: 16px; left: 16px; z-index: 4;
          width: 24px; height: 24px;
          background: rgba(10,8,6,0.7); border: 1px solid rgba(201,147,58,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .col-select-check.checked { background: #c9933a; border-color: #c9933a; }
        .col-select-check span { font-size: 12px; color: #0a0806; font-weight: 700; }

        .col-card-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 28px;
          background: linear-gradient(to top, rgba(10,8,6,0.98) 0%, transparent 100%);
        }
        .col-card-category {
          font-family: 'Barlow', sans-serif; font-size: 9px;
          letter-spacing: 0.3em; text-transform: uppercase; color: #c9933a; margin-bottom: 6px;
        }
        .col-card-name {
          font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 20px;
          color: #f5ede0; letter-spacing: 0.04em; margin-bottom: 4px; text-transform: uppercase;
        }
        .col-card-price {
          font-family: 'Barlow', sans-serif; font-size: 12px;
          color: rgba(245,237,224,0.4); letter-spacing: 0.1em;
        }
        .col-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.2) 60%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 28px; opacity: 0; transition: opacity 0.3s;
        }
        .col-card:hover .col-card-overlay { opacity: 1; }
        .col-card-actions { display: flex; gap: 8px; margin-top: 16px; }
        .col-card-btn {
          flex: 1; padding: 10px 12px;
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.2s;
        }
        .col-card-btn:hover { opacity: 0.85; }
        .col-card-btn-wa { background: #25D366; color: #fff; }
        .col-card-btn-dm { background: rgba(201,147,58,0.15); color: #c9933a; border: 1px solid rgba(201,147,58,0.3); }

        /* Wishlist drawer */
        .col-wishlist-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(10,8,6,0.7); backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .col-wishlist-backdrop.open { opacity: 1; pointer-events: all; }
        .col-wishlist-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 101;
          width: 420px; max-width: 100vw;
          background: #0d0a06; border-left: 1px solid rgba(201,147,58,0.15);
          display: flex; flex-direction: column;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.77,0,0.18,1);
        }
        .col-wishlist-drawer.open { transform: translateX(0); }
        .col-wishlist-head {
          padding: 28px 24px; border-bottom: 1px solid rgba(201,147,58,0.1);
          display: flex; align-items: center; justify-content: space-between;
        }
        .col-wishlist-title {
          font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 24px;
          text-transform: uppercase; letter-spacing: 0.08em; color: #f5ede0;
        }
        .col-wishlist-close {
          background: none; border: 1px solid rgba(201,147,58,0.2);
          color: rgba(245,237,224,0.4); cursor: pointer;
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.2s;
        }
        .col-wishlist-close:hover { border-color: #c9933a; color: #c9933a; }
        .col-wishlist-body { flex: 1; overflow-y: auto; padding: 16px; }
        .col-wishlist-item {
          display: flex; gap: 16px; padding: 16px;
          border-bottom: 1px solid rgba(201,147,58,0.08);
          align-items: center;
        }
        .col-wishlist-item-img {
          width: 72px; height: 72px; object-fit: cover; flex-shrink: 0;
        }
        .col-wishlist-item-placeholder {
          width: 72px; height: 72px; background: #0a0806;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 20px;
          color: rgba(201,147,58,0.15); flex-shrink: 0;
        }
        .col-wishlist-item-name {
          font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 16px;
          color: #f5ede0; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;
        }
        .col-wishlist-item-price {
          font-family: 'Barlow', sans-serif; font-size: 11px;
          color: rgba(245,237,224,0.35); letter-spacing: 0.1em;
        }
        .col-wishlist-item-remove {
          margin-left: auto; background: none; border: none;
          color: rgba(245,237,224,0.2); cursor: pointer; font-size: 18px;
          transition: color 0.2s; flex-shrink: 0;
        }
        .col-wishlist-item-remove:hover { color: #dc2626; }
        .col-wishlist-footer {
          padding: 20px 24px; border-top: 1px solid rgba(201,147,58,0.1);
        }
        .col-wishlist-enquire {
          width: 100%; padding: 14px;
          background: #25D366; color: #fff; border: none; cursor: pointer;
          font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s;
        }
        .col-wishlist-enquire:hover { opacity: 0.88; }
        .col-wishlist-empty {
          padding: 60px 24px; text-align: center;
        }
        .col-wishlist-empty-text {
          font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic;
          font-size: 18px; color: rgba(245,237,224,0.2);
        }
        .col-empty { grid-column: 1/-1; padding: 80px 0; text-align: center; }
        .col-empty-text {
          font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 18px;
          color: rgba(245,237,224,0.2); letter-spacing: 0.1em;
        }
        @media (max-width: 768px) {
          .col-root { padding: 80px 24px; }
          .col-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
          .col-card-img { height: 340px; }
          .col-card-overlay { opacity: 1; }
          .col-bulk-bar { padding: 16px 24px; flex-direction: column; }
          .col-wishlist-drawer { width: 100vw; }
        }
      `}</style>

      <section id="collections" className="col-root">
        {/* Header */}
        <div className="col-header">
          <div>
            <div className="col-eyebrow">
              <div className="col-eyebrow-line" />
              <span>The Collection</span>
            </div>
            <h2 className="col-title">Our <em>Pieces</em></h2>
          </div>
          <div className="col-toolbar">
            <div className="col-filters">
              {filters.map(f => (
                <button key={f} className={`col-filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
              ))}
            </div>
            <button
              className={`col-action-btn col-action-btn-select${selectMode ? ' active' : ''}`}
              onClick={() => { setSelectMode(!selectMode); setSelected([]) }}
            >
              {selectMode ? '✕ Cancel' : '☑ Select'}
            </button>
            <button
              className="col-action-btn col-action-btn-wishlist"
              onClick={() => setShowWishlist(true)}
            >
              ♡ Saved {wishlist.length > 0 && `(${wishlist.length})`}
            </button>
          </div>
        </div>

        {/* Grid */}
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
                <div
                  key={product._id}
                  className={`col-card${selected.includes(product._id) ? ' selected' : ''}`}
                  onClick={() => selectMode && toggleSelect(product._id)}
                >
                  {/* Heart */}
                  <button
                    className="col-heart-btn"
                    onClick={e => { e.stopPropagation(); toggleWishlist(product._id) }}
                  >
                    <HeartIcon filled={wishlist.includes(product._id)} />
                  </button>

                  {/* Select checkbox */}
                  {selectMode && (
                    <div className={`col-select-check${selected.includes(product._id) ? ' checked' : ''}`}>
                      {selected.includes(product._id) && <span>✓</span>}
                    </div>
                  )}

                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} className="col-card-img" />
                    : <div className="col-card-placeholder"><span className="col-card-placeholder-text">TB</span></div>
                  }

                  <div className="col-card-info">
                    <div className="col-card-category">{product.category}</div>
                    <div className="col-card-name">{product.name}</div>
                    <div className="col-card-price">{product.price}</div>
                  </div>

                  {!selectMode && (
                    <div className="col-card-overlay">
                      <div className="col-card-actions">
                        <button className="col-card-btn col-card-btn-wa" onClick={e => { e.stopPropagation(); handleWhatsApp(product) }}>
                          <WhatsAppIcon /> WhatsApp
                        </button>
                        <button className="col-card-btn col-card-btn-dm" onClick={e => { e.stopPropagation(); window.open(settings?.instagram || '#', '_blank') }}>
                          DM Us
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Bulk bar */}
      <div className={`col-bulk-bar${selected.length > 0 ? ' visible' : ''}`}>
        <div className="col-bulk-bar-text">
          <span>{selected.length}</span> {selected.length === 1 ? 'piece' : 'pieces'} selected
        </div>
        <div className="col-bulk-actions">
          <button className="col-bulk-btn col-bulk-btn-clear" onClick={clearSelect}>Clear</button>
          <button className="col-bulk-btn col-bulk-btn-wa" onClick={handleBulkEnquire}>
            <WhatsAppIcon /> &nbsp; Enquire on All
          </button>
        </div>
      </div>

      {/* Wishlist drawer */}
      <div className={`col-wishlist-backdrop${showWishlist ? ' open' : ''}`} onClick={() => setShowWishlist(false)} />
      <div className={`col-wishlist-drawer${showWishlist ? ' open' : ''}`}>
        <div className="col-wishlist-head">
          <div className="col-wishlist-title">Saved Pieces</div>
          <button className="col-wishlist-close" onClick={() => setShowWishlist(false)}>✕</button>
        </div>
        <div className="col-wishlist-body">
          {wishlistProducts.length === 0 ? (
            <div className="col-wishlist-empty">
              <div className="col-wishlist-empty-text">No saved pieces yet.<br />Tap ♡ on any piece to save it.</div>
            </div>
          ) : (
            wishlistProducts.map(p => (
              <div key={p._id} className="col-wishlist-item">
                {p.images?.[0]
                  ? <img src={p.images[0]} alt={p.name} className="col-wishlist-item-img" />
                  : <div className="col-wishlist-item-placeholder">TB</div>
                }
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="col-wishlist-item-name">{p.name}</div>
                  <div className="col-wishlist-item-price">{p.price}</div>
                </div>
                <button className="col-wishlist-item-remove" onClick={() => toggleWishlist(p._id)}>✕</button>
              </div>
            ))
          )}
        </div>
        {wishlistProducts.length > 0 && (
          <div className="col-wishlist-footer">
            <button className="col-wishlist-enquire" onClick={handleWishlistEnquire}>
              <WhatsAppIcon /> &nbsp; Enquire on All Saved Pieces
            </button>
          </div>
        )}
      </div>
    </>
  )
}