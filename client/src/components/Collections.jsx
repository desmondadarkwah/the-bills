import { useState, useEffect } from 'react'
import { fetchProducts, fetchCollections, trackProductView, trackProductClick } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const WhatsAppIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" fill={filled ? '#c9933a' : 'none'} stroke="#c9933a" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CloseIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Collections({ settings }) {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [selectMode, setSelectMode] = useState(false)
  const [viewProduct, setViewProduct] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCollections()])
      .then(([p, c]) => { setProducts(p); setCollections(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
    const saved = localStorage.getItem('bills_wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  useEffect(() => {
    document.body.style.overflow = viewProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [viewProduct])

  const filters = ['All', ...collections.map(c => c.name)]
  const filtered = activeFilter === 'All' ? products : products.filter(p => p.collection === activeFilter)

  const toggleWishlist = (id) => {
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id]
    setWishlist(updated)
    localStorage.setItem('bills_wishlist', JSON.stringify(updated))
  }

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const clearSelect = () => { setSelected([]); setSelectMode(false) }

  const handleWhatsApp = (product) => {
    trackProductClick(product._id)
    const vendorWhatsapp = product.vendor?.whatsapp
    const targetNumber = vendorWhatsapp || settings?.whatsapp || '233546805804'
    const msg = `Hello ${product.vendor ? product.vendor.shopName : 'The Bills'}!\n\nI'm interested in:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${product.price}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleBulkWhatsApp = (items) => {
    const list = items.map((p, i) => `${i + 1}. *${p.name}* — ${p.price}`).join('\n')
    const msg = `Hello The Bills!\n\nI'm interested in the following pieces:\n\n${list}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233546805804'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleBulkEnquire = () => {
    const items = products.filter(p => selected.includes(p._id))
    handleBulkWhatsApp(items)
  }

  const openView = (product) => {
    setViewProduct(product)
    setActiveImg(0)
    trackProductView(product._id)
  }

  const closeView = () => setViewProduct(null)

  return (
    <>
      <style>{`
        /* ── ROOT ── */
        .col-root {
          background: #0a0806;
          padding: 140px 56px 120px;
          position: relative;
          font-family: 'Barlow', sans-serif;
        }
        .col-top-line {
          position: absolute; top: 0; left: 56px; right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.22) 30%, rgba(201,147,58,0.22) 70%, transparent);
        }

        /* ── HEADER ── */
        .col-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 56px; gap: 24px; flex-wrap: wrap;
        }
        .col-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 18px;
        }
        .col-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .col-eyebrow span {
          font-size: 9.5px;
          letter-spacing: 0.36em; text-transform: uppercase; color: #c9933a;
        }
        .col-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 5vw, 64px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase; margin: 0;
        }
        .col-title em { font-style: italic; color: #c9933a; }

        /* ── TOOLBAR ── */
        .col-toolbar {
          display: flex; align-items: center;
          gap: 10px; flex-wrap: wrap;
          justify-content: flex-end;
        }
        .col-filters {
          display: flex; align-items: center;
          gap: 6px; flex-wrap: wrap;
        }
        .col-filter-btn {
          font-size: 9px;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 9px 18px;
          border: 1px solid rgba(201,147,58,0.16);
          background: transparent; color: rgba(245,237,224,0.35);
          cursor: pointer; transition: all 0.2s;
        }
        .col-filter-btn:hover {
          border-color: rgba(201,147,58,0.45);
          color: rgba(245,237,224,0.65);
        }
        .col-filter-btn.active {
          background: #c9933a; color: #0a0806; border-color: #c9933a;
        }

        .col-toolbar-sep {
          width: 1px; height: 18px;
          background: rgba(201,147,58,0.15); flex-shrink: 0;
        }

        .col-action-btn {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 9px 16px; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 7px; border: none;
          background: none; white-space: nowrap;
        }
        .col-action-btn svg { flex-shrink: 0; }
        .col-action-btn-select {
          color: rgba(201,147,58,0.7);
          border: 1px solid rgba(201,147,58,0.2) !important;
          background: rgba(201,147,58,0.04) !important;
        }
        .col-action-btn-select:hover {
          background: rgba(201,147,58,0.1) !important;
          color: #c9933a;
        }
        .col-action-btn-select.active {
          background: rgba(201,147,58,0.12) !important;
          border-color: rgba(201,147,58,0.4) !important;
          color: #c9933a;
        }
        .col-action-btn-wishlist {
          color: rgba(245,237,224,0.35);
          border: 1px solid rgba(245,237,224,0.08) !important;
        }
        .col-action-btn-wishlist:hover {
          border-color: rgba(201,147,58,0.3) !important;
          color: rgba(201,147,58,0.8);
        }

        /* ── GRID ── */
        .col-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2px;
        }

        /* ── CARD ── */
        .col-card {
          position: relative; overflow: hidden;
          background: #100e0a; cursor: pointer;
        }
        .col-card.selected::after {
          content: '';
          position: absolute; inset: 0;
          border: 2px solid #c9933a;
          pointer-events: none; z-index: 3;
        }

        .col-card-img {
          width: 100%; height: 440px; object-fit: cover; display: block;
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .col-card:hover .col-card-img { transform: scale(1.06); }

        .col-card-placeholder {
          width: 100%; height: 440px;
          background: linear-gradient(160deg, #1a1208 0%, #0d0a06 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .col-card-placeholder::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg, transparent, transparent 20px,
            rgba(201,147,58,0.02) 20px, rgba(201,147,58,0.02) 21px
          );
        }
        .col-card-placeholder-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 80px;
          color: rgba(201,147,58,0.07); letter-spacing: -0.04em;
          text-transform: uppercase; position: relative; z-index: 1;
        }

        .col-heart-btn {
          position: absolute; top: 14px; right: 14px; z-index: 4;
          width: 34px; height: 34px;
          background: rgba(10,8,6,0.65);
          border: 1px solid rgba(201,147,58,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .col-heart-btn:hover {
          background: rgba(10,8,6,0.9); border-color: rgba(201,147,58,0.6);
        }

        .col-select-check {
          position: absolute; top: 14px; left: 14px; z-index: 4;
          width: 22px; height: 22px;
          background: rgba(10,8,6,0.65);
          border: 1px solid rgba(201,147,58,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: #0a0806;
        }
        .col-select-check.checked { background: #c9933a; border-color: #c9933a; }

        .col-card-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 32px 22px 18px;
          background: linear-gradient(to top, rgba(10,8,6,0.97) 0%, transparent 100%);
          pointer-events: none;
        }
        .col-card-category {
          font-size: 9px;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: #c9933a; margin-bottom: 5px;
        }
        .col-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500; font-size: 19px;
          color: #f5ede0; letter-spacing: 0.04em;
          margin-bottom: 3px; text-transform: uppercase;
        }
        .col-card-price {
          font-size: 11px;
          color: rgba(245,237,224,0.35); letter-spacing: 0.12em;
        }

        .col-card-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 22px;
          background: linear-gradient(to top, rgba(10,8,6,0.96) 0%, rgba(10,8,6,0.18) 55%, transparent 100%);
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none;
        }
        .col-card:hover .col-card-overlay { opacity: 1; pointer-events: auto; }

        @media (max-width: 768px) {
          .col-card-overlay { opacity: 1; pointer-events: auto; }
        }

        .col-card-actions { display: flex; gap: 6px; margin-top: 60px; }
        .col-card-btn {
          flex: 1; padding: 10px 8px;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .col-card-btn-wa {
          background: transparent; color: #c9933a;
          border: 1px solid #c9933a;
        }
        .col-card-btn-wa:hover { background: #c9933a; color: #0a0806; }
        .col-card-btn-dm {
          background: rgba(201,147,58,0.1); color: #c9933a;
          border: 1px solid rgba(201,147,58,0.25);
        }
        .col-card-btn-dm:hover { opacity: 0.82; }

        /* ── EMPTY STATE ── */
        .col-empty {
          grid-column: 1 / -1;
          padding: 100px 0; text-align: center;
        }
        .col-empty-eyebrow {
          font-size: 9px;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(201,147,58,0.3); margin-bottom: 16px;
        }
        .col-empty-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-style: italic; font-size: 22px;
          color: rgba(245,237,224,0.15); letter-spacing: 0.06em;
        }

        /* ── BULK BAR ── */
        .col-bulk-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 90;
          background: #0d0a06;
          border-top: 1px solid rgba(201,147,58,0.2);
          padding: 18px 56px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.77,0,0.18,1);
        }
        .col-bulk-bar.visible { transform: translateY(0); }
        .col-bulk-bar-left {
          display: flex; align-items: center; gap: 14px;
        }
        .col-bulk-bar-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c9933a; flex-shrink: 0;
        }
        .col-bulk-bar-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 17px;
          color: rgba(245,237,224,0.7); letter-spacing: 0.04em;
        }
        .col-bulk-bar-text span { color: #c9933a; font-weight: 600; }
        .col-bulk-actions { display: flex; gap: 10px; }
        .col-bulk-btn {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 12px 28px; border: none; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .col-bulk-btn-wa {
          background: transparent; color: #c9933a;
          border: 1px solid #c9933a;
          display: flex; align-items: center; gap: 8px;
        }
        .col-bulk-btn-wa:hover { background: #c9933a; color: #0a0806; }
        .col-bulk-btn-clear {
          background: transparent; color: rgba(245,237,224,0.3);
          border: 1px solid rgba(245,237,224,0.08);
        }
        .col-bulk-btn-clear:hover { opacity: 0.85; }

        /* ── VIEW MODAL ── */
        .col-view-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(5,4,3,0.92);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 32px;
          animation: colFadeIn 0.25s ease;
        }
        @keyframes colFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .col-view-modal {
          width: 100%; max-width: 980px; max-height: 88vh;
          background: #0d0a06;
          border: 1px solid rgba(201,147,58,0.18);
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          overflow: hidden;
          animation: colSlideUp 0.35s cubic-bezier(0.16,1,0.3,1);
          position: relative;
        }
        @keyframes colSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .col-view-close {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 38px; height: 38px;
          background: rgba(10,8,6,0.85);
          border: 1px solid rgba(201,147,58,0.3);
          color: #f5ede0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .col-view-close:hover { border-color: #c9933a; background: rgba(10,8,6,0.95); }

        .col-view-imgwrap {
          position: relative;
          background: #100e0a;
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .col-view-img-main {
          width: 100%; flex: 1;
          object-fit: cover; display: block;
          min-height: 320px; max-height: 560px;
        }
        .col-view-img-placeholder {
          width: 100%; flex: 1; min-height: 320px;
          background: linear-gradient(160deg, #1a1208 0%, #0d0a06 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .col-view-img-placeholder span {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 90px;
          color: rgba(201,147,58,0.08); letter-spacing: -0.04em;
        }
        .col-view-thumbs {
          display: flex; gap: 6px; padding: 12px;
          background: #0a0806;
          overflow-x: auto;
          flex-shrink: 0;
        }
        .col-view-thumb {
          width: 56px; height: 56px; flex-shrink: 0;
          object-fit: cover; cursor: pointer;
          opacity: 0.45; transition: opacity 0.2s, border-color 0.2s;
          border: 1px solid transparent;
        }
        .col-view-thumb:hover { opacity: 0.8; }
        .col-view-thumb.active { opacity: 1; border-color: #c9933a; }

        .col-view-body {
          padding: 40px 36px;
          display: flex; flex-direction: column;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .col-view-category {
          font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
          color: #c9933a; margin-bottom: 14px;
        }
        .col-view-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500; font-size: 32px;
          color: #f5ede0; text-transform: uppercase;
          letter-spacing: 0.02em; line-height: 1.1; margin-bottom: 14px;
        }
        .col-view-price {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 22px;
          color: #c9933a; margin-bottom: 24px;
        }
        .col-view-divider {
          width: 36px; height: 1px; background: rgba(201,147,58,0.3);
          margin-bottom: 24px; flex-shrink: 0;
        }
        .col-view-label {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(245,237,224,0.3); margin-bottom: 8px;
        }
        .col-view-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px; line-height: 1.8;
          color: rgba(245,237,224,0.55);
          margin-bottom: 24px;
        }
        .col-view-enquire {
          width: 100%; padding: 14px;
          background: transparent; color: #c9933a;
          border: 1px solid #c9933a; cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s; flex-shrink: 0; margin-bottom: 20px;
        }
        .col-view-enquire:hover { background: #c9933a; color: #0a0806; }
        .col-view-meta {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          padding-top: 20px;
          border-top: 1px solid rgba(201,147,58,0.1);
          flex-shrink: 0;
        }
        .col-view-meta-label {
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(245,237,224,0.25); margin-bottom: 4px;
        }
        .col-view-meta-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px; color: rgba(245,237,224,0.75);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .col-root        { padding: 100px 24px 100px; }
          .col-top-line    { left: 24px; right: 24px; }
          .col-grid        { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
          .col-card-img    { height: 360px; }
          .col-card-placeholder { height: 360px; }
          .col-header      { flex-direction: column; align-items: flex-start; margin-bottom: 36px; }
          .col-toolbar     { justify-content: flex-start; }
          .col-bulk-bar    { padding: 14px 24px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .col-bulk-actions{ width: 100%; }
          .col-bulk-btn    { flex: 1; text-align: center; justify-content: center; }
        }

        /* ── MOBILE MODAL FIXES ── */
        @media (max-width: 768px) {
          .col-view-backdrop {
            padding: 0;
            align-items: flex-end;
          }
          .col-view-modal {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            max-height: 95vh;
            max-width: 100%;
            width: 100%;
            border-left: none;
            border-right: none;
            border-bottom: none;
            border-radius: 0;
          }
          /* image section — fixed height so body gets the rest */
          .col-view-imgwrap {
            max-height: 42vh;
            flex-shrink: 0;
          }
          .col-view-img-main {
            min-height: 0;
            max-height: 36vh;
            height: 36vh;
          }
          .col-view-img-placeholder {
            min-height: 0;
            height: 36vh;
          }
          /* body section scrolls freely */
          .col-view-body {
            padding: 24px 20px 36px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            flex: 1;
          }
          .col-view-name { font-size: 24px; }
          .col-view-price { font-size: 18px; margin-bottom: 18px; }
          .col-view-desc { font-size: 13px; margin-bottom: 18px; }
          /* enquire button always visible on mobile */
          .col-view-enquire { margin-bottom: 18px; }
          .col-view-meta { gap: 12px; }
          .col-view-meta-value { font-size: 13.5px; }
        }

        @media (max-width: 480px) {
          .col-grid { grid-template-columns: 1fr; }
          .col-view-img-main { height: 30vh; max-height: 30vh; }
          .col-view-img-placeholder { height: 30vh; }
          .col-view-body { padding: 20px 16px 32px; }
          .col-view-name { font-size: 22px; }
        }
      `}</style>

      <section id="collections" className="col-root">
        <div className="col-top-line" />

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
                <button
                  key={f}
                  className={`col-filter-btn${activeFilter === f ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="col-toolbar-sep" />
            <button
              className={`col-action-btn col-action-btn-select${selectMode ? ' active' : ''}`}
              onClick={() => { setSelectMode(!selectMode); setSelected([]) }}
            >
              {selectMode ? <><CloseIcon /> Cancel</> : <><CheckIcon /> Select</>}
            </button>
            <button
              className="col-action-btn col-action-btn-wishlist"
              onClick={() => navigate('/wishlist')}
            >
              <HeartIcon filled={false} /> Saved{wishlist.length > 0 ? ` (${wishlist.length})` : ''}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="col-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 440, background: 'linear-gradient(160deg,#1a1208,#0d0a06)', opacity: 0.4 + i * 0.04 }} />
            ))}
          </div>
        ) : (
          <div className="col-grid">
            {filtered.length === 0 ? (
              <div className="col-empty">
                <div className="col-empty-eyebrow">The Bills</div>
                <div className="col-empty-text">No pieces available yet — check back soon.</div>
              </div>
            ) : (
              filtered.map(product => (
                <div
                  key={product._id}
                  className={`col-card${selected.includes(product._id) ? ' selected' : ''}`}
                  onClick={() => selectMode ? toggleSelect(product._id) : openView(product)}
                >
                  <button className="col-heart-btn" onClick={e => { e.stopPropagation(); toggleWishlist(product._id) }}>
                    <HeartIcon filled={wishlist.includes(product._id)} />
                  </button>

                  {selectMode && (
                    <div className={`col-select-check${selected.includes(product._id) ? ' checked' : ''}`}>
                      {selected.includes(product._id) && <CheckIcon />}
                    </div>
                  )}

                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="col-card-img" />
                  ) : (
                    <div className="col-card-placeholder">
                      <span className="col-card-placeholder-text">TB</span>
                    </div>
                  )}

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

      <div className={`col-bulk-bar${selected.length > 0 ? ' visible' : ''}`}>
        <div className="col-bulk-bar-left">
          <div className="col-bulk-bar-dot" />
          <div className="col-bulk-bar-text">
            <span>{selected.length}</span> {selected.length === 1 ? 'piece' : 'pieces'} selected
          </div>
        </div>
        <div className="col-bulk-actions">
          <button className="col-bulk-btn col-bulk-btn-clear" onClick={clearSelect}>Clear</button>
          <button className="col-bulk-btn col-bulk-btn-wa" onClick={handleBulkEnquire}>
            <WhatsAppIcon /> Enquire on All
          </button>
        </div>
      </div>

      {viewProduct && (
        <div className="col-view-backdrop" onClick={e => e.target === e.currentTarget && closeView()}>
          <div className="col-view-modal">
            <button className="col-view-close" onClick={closeView}><CloseIcon /></button>

            <div className="col-view-imgwrap">
              {viewProduct.images?.[activeImg] ? (
                <img src={viewProduct.images[activeImg]} alt={viewProduct.name} className="col-view-img-main" />
              ) : (
                <div className="col-view-img-placeholder"><span>TB</span></div>
              )}
              {viewProduct.images?.length > 1 && (
                <div className="col-view-thumbs">
                  {viewProduct.images.map((img, i) => (
                    <img key={i} src={img} alt="" className={`col-view-thumb${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)} />
                  ))}
                </div>
              )}
            </div>

            <div className="col-view-body">
              <div className="col-view-category">{viewProduct.category}</div>
              <div className="col-view-name">{viewProduct.name}</div>
              <div className="col-view-price">{viewProduct.price}</div>
              {viewProduct.vendor && (
                <div
                  onClick={() => navigate(`/shop/${viewProduct.vendor._id}`)}
                  style={{ fontSize: 11, color: 'rgba(245,237,224,0.4)', marginBottom: 16, letterSpacing: '0.05em', cursor: 'pointer' }}
                >
                  Sold by <span style={{ color: '#c9933a', fontWeight: 600, textDecoration: 'underline' }}>{viewProduct.vendor.shopName}</span>
                  {viewProduct.vendor.verified && <span style={{ marginLeft: 6 }}>✓</span>}
                </div>
              )}
              <div className="col-view-divider" />
              <div className="col-view-label">Description</div>
              <p className="col-view-desc">{viewProduct.description || 'No description provided.'}</p>
              <button className="col-view-enquire" onClick={() => handleWhatsApp(viewProduct)}>
                <WhatsAppIcon /> Enquire on This Piece
              </button>
              <div className="col-view-meta">
                <div className="col-view-meta-item">
                  <div className="col-view-meta-label">Category</div>
                  <div className="col-view-meta-value">{viewProduct.category || '—'}</div>
                </div>
                <div className="col-view-meta-item">
                  <div className="col-view-meta-label">Collection</div>
                  <div className="col-view-meta-value">{viewProduct.collection || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}