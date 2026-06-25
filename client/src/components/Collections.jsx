import { useState, useEffect, useRef } from 'react'
import { fetchProducts, fetchCollections, trackProductView, trackProductClick, fetchProductReviews, submitReview } from '../utils/api'
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

const StarIcon = ({ filled, half }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#c9933a' : 'none'} stroke="#c9933a" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#c9933a' : 'none'} stroke="#c9933a" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function ScrollProgress({ scrollRef }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollRef])
  return (
    <div className="scroll-prog-track">
      <div className="scroll-prog-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

export default function Collections({ settings }) {
  const [products, setProducts]         = useState([])
  const [collections, setCollections]   = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState([])
  const [wishlist, setWishlist]         = useState([])
  const [selectMode, setSelectMode]     = useState(false)
  const [viewProduct, setViewProduct]   = useState(null)
  const [activeImg, setActiveImg]       = useState(0)

  // Reviews state
  const [reviews, setReviews]           = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewAvg, setReviewAvg]       = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm]     = useState({ name:'', rating:5, comment:'' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError]   = useState('')

  const featRef = useRef(null)
  const mvRef   = useRef(null)
  const newRef  = useRef(null)
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

  // Load reviews when product opens
  useEffect(() => {
    if (!viewProduct) { setReviews([]); setReviewAvg(0); setShowReviewForm(false); setReviewSuccess(false); return }
    setReviewsLoading(true)
    fetchProductReviews(viewProduct._id)
      .then(data => { setReviews(data.data || []); setReviewAvg(data.avg || 0) })
      .catch(console.error)
      .finally(() => setReviewsLoading(false))
  }, [viewProduct])

  const filters     = ['All', ...collections.map(c => c.name)]
  const filtered    = activeFilter === 'All' ? products : products.filter(p => p.collection === activeFilter)
  const featured    = products.filter(p => p.featured)
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12)
  const mostViewed  = [...products].sort((a, b) => (b.views || 0) - (a.views || 0)).filter(p => (p.views || 0) > 0).slice(0, 10)

  const toggleWishlist = (id) => {
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id]
    setWishlist(updated)
    localStorage.setItem('bills_wishlist', JSON.stringify(updated))
  }

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  const clearSelect = () => { setSelected([]); setSelectMode(false) }

  const handleWhatsApp = (product) => {
    trackProductClick(product._id)
    const msg = `Hello The Bills!\n\nI'm interested in:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ${product.price}${product.vendor ? `\nVendor: ${product.vendor.shopName}` : ''}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233546805804'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleBulkEnquire = () => {
    const items = products.filter(p => selected.includes(p._id))
    const list  = items.map((p, i) => `${i + 1}. *${p.name}* — ${p.price}`).join('\n')
    const msg   = `Hello The Bills!\n\nI'm interested in the following pieces:\n\n${list}\n\nPlease provide more details. Thank you!`
    window.open(`https://wa.me/${settings?.whatsapp || '233546805804'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const openView = (product) => { setViewProduct(product); setActiveImg(0); trackProductView(product._id) }
  const closeView = () => setViewProduct(null)

  const handleReviewSubmit = async () => {
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) { setReviewError('Please fill in all fields.'); return }
    setReviewSubmitting(true); setReviewError('')
    try {
      await submitReview({ product: viewProduct._id, ...reviewForm })
      setReviewSuccess(true)
      setShowReviewForm(false)
      setReviewForm({ name:'', rating:5, comment:'' })
      // Reload reviews
      const data = await fetchProductReviews(viewProduct._id)
      setReviews(data.data || [])
      setReviewAvg(data.avg || 0)
    } catch(e) { setReviewError(e.response?.data?.error || 'Failed to submit review.') }
    finally { setReviewSubmitting(false) }
  }

  return (
    <>
      <style>{`
        .col-root {
          background: #0a0806;
          padding: 80px 15px 50px;
          position: relative;
          font-family: 'Barlow', sans-serif;
        }
        .col-top-line {
          position: absolute; top: 0; left: 56px; right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.22) 30%, rgba(201,147,58,0.22) 70%, transparent);
        }
        .col-sec-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; gap: 16px; }
        .col-eyebrow { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
        .col-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .col-eyebrow span { font-size: 9.5px; letter-spacing: 0.36em; text-transform: uppercase; color: #c9933a; }
        .col-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(24px, 3.5vw, 44px); line-height: 0.95; letter-spacing: -0.01em; color: #f5ede0; text-transform: uppercase; margin: 0; }
        .col-title em { font-style: italic; color: #c9933a; }
        .col-sec-counter { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 300; color: rgba(245,237,224,0.2); letter-spacing: 0.1em; white-space: nowrap; flex-shrink: 0; align-self: flex-end; padding-bottom: 2px; }
        .col-sec-counter span { color: rgba(201,147,58,0.55); }
        .scroll-prog-track { width: 100%; height: 1px; background: rgba(201,147,58,0.1); margin-top: 16px; overflow: hidden; }
        .scroll-prog-fill { height: 100%; background: linear-gradient(to right, rgba(201,147,58,0.4), #c9933a); transition: width 0.1s linear; min-width: 4%; }
        .col-sec-divider { width: 100%; height: 1px; background: rgba(201,147,58,0.08); margin: 15px 0 30px; }

        /* FEATURED */
        .hs-featured-wrap { display: flex; gap: 3px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; cursor: grab; }
        .hs-featured-wrap::-webkit-scrollbar { display: none; }
        .hs-featured-wrap:active { cursor: grabbing; }
        .hs-feat-card { flex-shrink: 0; width: 440px; position: relative; overflow: hidden; background: #100e0a; cursor: pointer; }
        .hs-feat-img { width: 100%; height: 540px; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
        .hs-feat-card:hover .hs-feat-img { transform: scale(1.04); }
        .hs-feat-ph { width: 100%; height: 540px; background: linear-gradient(160deg,#1a1208,#0d0a06); display: flex; align-items: center; justify-content: center; }
        .hs-feat-ph span { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 80px; color: rgba(201,147,58,0.07); }
        .hs-feat-badge { position: absolute; top: 18px; left: 18px; z-index: 3; background: #c9933a; color: #0a0806; font-size: 8px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; padding: 5px 12px; }
        .hs-feat-num { position: absolute; bottom: 100px; right: 20px; z-index: 3; font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 11px; letter-spacing: 0.18em; color: rgba(245,237,224,0.35); }
        .hs-feat-num span { color: rgba(201,147,58,0.7); font-size: 15px; }
        .hs-feat-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 52px 22px 22px; background: linear-gradient(to top, rgba(10,8,6,0.98) 0%, transparent 100%); }
        .hs-feat-cat { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9933a; margin-bottom: 7px; }
        .hs-feat-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 22px; color: #f5ede0; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.02em; }
        .hs-feat-price { font-size: 11px; color: rgba(245,237,224,0.4); letter-spacing: 0.12em; }

        /* NEW ARRIVALS */
        .hs-new-wrap { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; cursor: grab; }
        .hs-new-wrap::-webkit-scrollbar { display: none; }
        .hs-new-wrap:active { cursor: grabbing; }
        .hs-new-inner { display: grid; grid-template-rows: 1fr 1fr; grid-auto-flow: column; grid-auto-columns: 180px; gap: 3px; width: max-content; height: 460px; }
        .hs-new-card { position: relative; overflow: hidden; background: #0f0d09; cursor: pointer; }
        .hs-new-card.tall { grid-row: 1 / 3; width: 180px; }
        .hs-new-card.short-top { grid-row: 1; }
        .hs-new-card.short-bot { grid-row: 2; }
        .hs-new-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
        .hs-new-card:hover img { transform: scale(1.07); }
        .hs-new-card-ph { width: 100%; height: 100%; background: linear-gradient(135deg,#15100a,#0a0806); display: flex; align-items: center; justify-content: center; }
        .hs-new-card-ph span { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 28px; color: rgba(201,147,58,0.06); }
        .hs-new-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 12px 12px; background: linear-gradient(to top, rgba(10,8,6,0.95) 0%, transparent 100%); opacity: 0; transition: opacity 0.28s ease; pointer-events: none; }
        .hs-new-card:hover .hs-new-info { opacity: 1; }
        .hs-new-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 13px; color: #f5ede0; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .hs-new-price { font-size: 10px; color: #c9933a; letter-spacing: 0.08em; }
        .hs-new-badge { position: absolute; top: 10px; left: 10px; z-index: 3; background: rgba(201,147,58,0.9); color: #0a0806; font-size: 7px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; padding: 3px 8px; }

        /* MOST VIEWED */
        .hs-mv-wrap { display: flex; gap: 3px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; cursor: grab; }
        .hs-mv-wrap::-webkit-scrollbar { display: none; }
        .hs-mv-wrap:active { cursor: grabbing; }
        .hs-mv-card { flex-shrink: 0; width: 260px; position: relative; overflow: hidden; background: #0f0d09; cursor: pointer; }
        .hs-mv-img { width: 100%; height: 340px; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .hs-mv-card:hover .hs-mv-img { transform: scale(1.05); }
        .hs-mv-ph { width: 100%; height: 340px; background: linear-gradient(160deg,#1a1208,#0d0a06); display: flex; align-items: center; justify-content: center; }
        .hs-mv-ph span { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 56px; color: rgba(201,147,58,0.07); }
        .hs-mv-rank { position: absolute; bottom: 60px; right: -8px; z-index: 1; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 96px; line-height: 1; color: rgba(201,147,58,0.08); letter-spacing: -0.04em; pointer-events: none; user-select: none; transition: color 0.3s; }
        .hs-mv-card:hover .hs-mv-rank { color: rgba(201,147,58,0.14); }
        .hs-mv-rank-badge { position: absolute; top: 14px; left: 14px; z-index: 3; font-family: 'Barlow', sans-serif; font-size: 8px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,237,224,0.5); background: rgba(10,8,6,0.65); padding: 4px 8px; backdrop-filter: blur(4px); }
        .hs-mv-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 32px 16px 14px; background: linear-gradient(to top, rgba(10,8,6,0.97) 0%, transparent 100%); }
        .hs-mv-cat { font-size: 8.5px; letter-spacing: 0.28em; text-transform: uppercase; color: #c9933a; margin-bottom: 4px; }
        .hs-mv-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 15px; color: #f5ede0; text-transform: uppercase; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hs-mv-price { font-size: 10.5px; color: rgba(245,237,224,0.32); letter-spacing: 0.1em; }

        /* SHARED HEART */
        .col-heart-btn { position: absolute; top: 10px; right: 10px; z-index: 4; width: 30px; height: 30px; background: rgba(10,8,6,0.65); border: 1px solid rgba(201,147,58,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); }
        .col-heart-btn:hover { background: rgba(10,8,6,0.9); border-color: rgba(201,147,58,0.6); }

        /* BROWSE ALL */
        .col-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; gap: 24px; flex-wrap: wrap; }
        .col-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
        .col-filters { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .col-filter-btn { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; padding: 8px 16px; border: 1px solid rgba(201,147,58,0.16); background: transparent; color: rgba(245,237,224,0.35); cursor: pointer; transition: all 0.2s; }
        .col-filter-btn:hover { border-color: rgba(201,147,58,0.45); color: rgba(245,237,224,0.65); }
        .col-filter-btn.active { background: #c9933a; color: #0a0806; border-color: #c9933a; }
        .col-toolbar-sep { width: 1px; height: 18px; background: rgba(201,147,58,0.15); flex-shrink: 0; }
        .col-action-btn { font-size: 9px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; padding: 8px 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 7px; border: none; background: none; white-space: nowrap; }
        .col-action-btn-select { color: rgba(201,147,58,0.7); border: 1px solid rgba(201,147,58,0.2) !important; background: rgba(201,147,58,0.04) !important; }
        .col-action-btn-select:hover { background: rgba(201,147,58,0.1) !important; color: #c9933a; }
        .col-action-btn-select.active { background: rgba(201,147,58,0.12) !important; border-color: rgba(201,147,58,0.4) !important; color: #c9933a; }
        .col-action-btn-wishlist { color: rgba(245,237,224,0.35); border: 1px solid rgba(245,237,224,0.08) !important; }
        .col-action-btn-wishlist:hover { border-color: rgba(201,147,58,0.3) !important; color: rgba(201,147,58,0.8); }

        /* GRID */
        .col-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 3px; }
        .col-card { position: relative; overflow: hidden; background: #100e0a; cursor: pointer; aspect-ratio: 3/4; }
        .col-card.selected::after { content: ''; position: absolute; inset: 0; border: 2px solid #c9933a; pointer-events: none; z-index: 3; }
        .col-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
        .col-card:hover .col-card-img { transform: scale(1.06); }
        .col-card-placeholder { position: absolute; inset: 0; background: linear-gradient(160deg, #1a1208 0%, #0d0a06 100%); display: flex; align-items: center; justify-content: center; }
        .col-card-placeholder-text { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 64px; color: rgba(201,147,58,0.07); letter-spacing: -0.04em; text-transform: uppercase; }
        .col-card-heart { position: absolute; top: 12px; right: 12px; z-index: 4; width: 30px; height: 30px; background: rgba(10,8,6,0.65); border: 1px solid rgba(201,147,58,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); }
        .col-card-heart:hover { background: rgba(10,8,6,0.9); border-color: rgba(201,147,58,0.6); }
        .col-select-check { position: absolute; top: 12px; left: 12px; z-index: 4; width: 20px; height: 20px; background: rgba(10,8,6,0.65); border: 1px solid rgba(201,147,58,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #0a0806; }
        .col-select-check.checked { background: #c9933a; border-color: #c9933a; }
        .col-card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px 16px 14px; background: linear-gradient(to top, rgba(10,8,6,0.97) 0%, transparent 100%); pointer-events: none; }
        .col-card-category { font-size: 8.5px; letter-spacing: 0.28em; text-transform: uppercase; color: #c9933a; margin-bottom: 4px; }
        .col-card-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 15px; color: #f5ede0; letter-spacing: 0.03em; margin-bottom: 2px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .col-card-price { font-size: 10.5px; color: rgba(245,237,224,0.32); letter-spacing: 0.1em; }
        .col-card-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px; background: linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.15) 55%, transparent 100%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .col-card:hover .col-card-overlay { opacity: 1; pointer-events: auto; }
        @media (max-width: 768px) { .col-card-overlay { opacity: 1; pointer-events: auto; } }
        .col-card-actions { display: flex; gap: 4px; margin-top: 52px; }
        .col-card-btn { flex: 1; padding: 9px 6px; font-size: 8.5px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.2s; }
        .col-card-btn-wa { background: transparent; color: #c9933a; border: 1px solid #c9933a; }
        .col-card-btn-wa:hover { background: #c9933a; color: #0a0806; }
        .col-card-btn-dm { background: rgba(201,147,58,0.08); color: #c9933a; border: 1px solid rgba(201,147,58,0.2); }

        /* EMPTY */
        .col-empty { grid-column: 1/-1; padding: 80px 0; text-align: center; }
        .col-empty-eyebrow { font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(201,147,58,0.3); margin-bottom: 12px; }
        .col-empty-text { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic; font-size: 20px; color: rgba(245,237,224,0.15); }

        /* BULK BAR */
        .col-bulk-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 90; background: #0d0a06; border-top: 1px solid rgba(201,147,58,0.2); padding: 18px 56px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.77,0,0.18,1); }
        .col-bulk-bar.visible { transform: translateY(0); }
        .col-bulk-bar-left { display: flex; align-items: center; gap: 14px; }
        .col-bulk-bar-dot { width: 6px; height: 6px; border-radius: 50%; background: #c9933a; flex-shrink: 0; }
        .col-bulk-bar-text { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 17px; color: rgba(245,237,224,0.7); }
        .col-bulk-bar-text span { color: #c9933a; font-weight: 600; }
        .col-bulk-actions { display: flex; gap: 10px; }
        .col-bulk-btn { font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; padding: 12px 28px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .col-bulk-btn-wa { background: transparent; color: #c9933a; border: 1px solid #c9933a; display: flex; align-items: center; gap: 8px; }
        .col-bulk-btn-wa:hover { background: #c9933a; color: #0a0806; }
        .col-bulk-btn-clear { background: transparent; color: rgba(245,237,224,0.3); border: 1px solid rgba(245,237,224,0.08); }

        /* VIEW MODAL */
        .col-view-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(5,4,3,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 32px; animation: colFadeIn 0.25s ease; }
        @keyframes colFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .col-view-modal { width: 100%; max-width: 980px; max-height: 88vh; background: #0d0a06; border: 1px solid rgba(201,147,58,0.18); display: grid; grid-template-columns: 1.1fr 1fr; overflow: hidden; position: relative; animation: colSlideUp 0.35s cubic-bezier(0.16,1,0.3,1); }
        @keyframes colSlideUp { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .col-view-close { position: absolute; top: 16px; right: 16px; z-index: 10; width: 38px; height: 38px; background: rgba(10,8,6,0.85); border: 1px solid rgba(201,147,58,0.3); color: #f5ede0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); }
        .col-view-close:hover { border-color: #c9933a; }
        .col-view-imgwrap { position: relative; background: #100e0a; display: flex; flex-direction: column; overflow: hidden; }
        .col-view-img-main { width: 100%; flex: 1; object-fit: cover; display: block; min-height: 320px; max-height: 560px; }
        .col-view-img-placeholder { width: 100%; flex: 1; min-height: 320px; background: linear-gradient(160deg,#1a1208,#0d0a06); display: flex; align-items: center; justify-content: center; }
        .col-view-img-placeholder span { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 90px; color: rgba(201,147,58,0.08); }
        .col-view-thumbs { display: flex; gap: 6px; padding: 12px; background: #0a0806; overflow-x: auto; flex-shrink: 0; }
        .col-view-thumb { width: 56px; height: 56px; flex-shrink: 0; object-fit: cover; cursor: pointer; opacity: 0.45; transition: opacity 0.2s; border: 1px solid transparent; }
        .col-view-thumb:hover { opacity: 0.8; }
        .col-view-thumb.active { opacity: 1; border-color: #c9933a; }
        .col-view-body { padding: 32px 28px; display: flex; flex-direction: column; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .col-view-category { font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase; color: #c9933a; margin-bottom: 10px; }
        .col-view-name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 28px; color: #f5ede0; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1; margin-bottom: 10px; }
        .col-view-price { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 20px; color: #c9933a; margin-bottom: 16px; }
        .col-view-divider { width: 36px; height: 1px; background: rgba(201,147,58,0.3); margin-bottom: 16px; flex-shrink: 0; }
        .col-view-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(245,237,224,0.3); margin-bottom: 6px; }
        .col-view-desc { font-family: 'Barlow', sans-serif; font-size: 13px; line-height: 1.75; color: rgba(245,237,224,0.55); margin-bottom: 18px; }
        .col-view-enquire { width: 100%; padding: 13px; background: transparent; color: #c9933a; border: 1px solid #c9933a; cursor: pointer; font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; flex-shrink: 0; margin-bottom: 16px; }
        .col-view-enquire:hover { background: #c9933a; color: #0a0806; }
        .col-view-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(201,147,58,0.1); flex-shrink: 0; margin-bottom: 20px; }
        .col-view-meta-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(245,237,224,0.25); margin-bottom: 4px; }
        .col-view-meta-value { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: rgba(245,237,224,0.75); }

        /* REVIEWS */
        .rv-section { border-top: 1px solid rgba(201,147,58,0.1); padding-top: 18px; flex-shrink: 0; }
        .rv-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .rv-title { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(245,237,224,0.3); }
        .rv-avg { display: flex; align-items: center; gap: 6px; }
        .rv-avg-num { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #c9933a; }
        .rv-avg-count { font-size: 10px; color: rgba(245,237,224,0.25); }
        .rv-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 14px; max-height: 160px; overflow-y: auto; }
        .rv-list::-webkit-scrollbar { width: 3px; }
        .rv-list::-webkit-scrollbar-track { background: transparent; }
        .rv-list::-webkit-scrollbar-thumb { background: rgba(201,147,58,0.2); }
        .rv-item { padding: 10px 12px; background: rgba(255,255,255,0.02); border-left: 2px solid rgba(201,147,58,0.2); }
        .rv-item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
        .rv-item-name { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; color: rgba(245,237,224,0.7); }
        .rv-item-date { font-size: 9px; color: rgba(245,237,224,0.2); }
        .rv-item-comment { font-size: 12px; color: rgba(245,237,224,0.45); line-height: 1.6; margin-top: 4px; }
        .rv-empty { font-size: 12px; color: rgba(245,237,224,0.2); font-style: italic; margin-bottom: 12px; }
        .rv-add-btn { width: 100%; padding: 10px; background: transparent; color: rgba(201,147,58,0.6); border: 1px solid rgba(201,147,58,0.2); cursor: pointer; font-family: 'Barlow', sans-serif; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; transition: all 0.2s; }
        .rv-add-btn:hover { border-color: #c9933a; color: #c9933a; }
        .rv-form { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
        .rv-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,147,58,0.15); color: #f5ede0; font-family: 'Barlow', sans-serif; font-size: 12px; padding: 10px 12px; outline: none; width: 100%; transition: border-color 0.2s; }
        .rv-input:focus { border-color: rgba(201,147,58,0.4); }
        .rv-input::placeholder { color: rgba(245,237,224,0.15); }
        .rv-star-row { display: flex; align-items: center; gap: 4px; }
        .rv-star-btn { background: none; border: none; cursor: pointer; padding: 2px; transition: transform 0.1s; }
        .rv-star-btn:hover { transform: scale(1.2); }
        .rv-form-actions { display: flex; gap: 8px; }
        .rv-submit-btn { flex: 1; padding: 10px; background: #c9933a; color: #0a0806; border: none; cursor: pointer; font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; transition: opacity 0.2s; }
        .rv-submit-btn:hover:not(:disabled) { opacity: 0.85; }
        .rv-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .rv-cancel-btn { padding: 10px 16px; background: transparent; color: rgba(245,237,224,0.3); border: 1px solid rgba(245,237,224,0.1); cursor: pointer; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; }
        .rv-error { font-size: 11px; color: #fca5a5; padding: 8px 10px; background: rgba(220,38,38,0.08); border-left: 2px solid #dc2626; }
        .rv-success { font-size: 11px; color: #6ee7b7; padding: 8px 10px; background: rgba(5,150,105,0.08); border-left: 2px solid #059669; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .col-root { padding: 100px 16px 80px; }
          .col-top-line { left: 16px; right: 16px; }
          .col-header { flex-direction: column; align-items: flex-start; }
          .col-toolbar { justify-content: flex-start; }
          .col-bulk-bar { padding: 14px 16px; flex-direction: column; align-items: flex-start; gap: 10px; }
          .col-bulk-actions { width: 100%; }
          .col-bulk-btn { flex: 1; text-align: center; justify-content: center; }
          .hs-feat-card { width: 300px; }
          .hs-feat-img, .hs-feat-ph { height: 380px; }
          .hs-new-inner { grid-auto-columns: 140px; height: 360px; }
          .hs-new-card.tall { width: 140px; }
          .hs-mv-card { width: 200px; }
          .hs-mv-img, .hs-mv-ph { height: 260px; }
          .hs-mv-rank { font-size: 72px; bottom: 48px; }
          .col-grid { grid-template-columns: 1fr 1fr; gap: 3px; }
        }
        @media (max-width: 768px) {
          .col-view-backdrop { padding: 0; align-items: flex-end; }
          .col-view-modal { grid-template-columns: 1fr; grid-template-rows: auto 1fr; max-height: 95vh; max-width: 100%; width: 100%; }
          .col-view-imgwrap { max-height: 42vh; flex-shrink: 0; }
          .col-view-img-main { min-height: 0; max-height: 36vh; height: 36vh; }
          .col-view-img-placeholder { min-height: 0; height: 36vh; }
          .col-view-body { padding: 18px 16px 28px; overflow-y: auto; flex: 1; }
          .col-view-name { font-size: 20px; }
          .col-view-price { font-size: 17px; margin-bottom: 14px; }
          .col-view-desc { font-size: 12px; margin-bottom: 14px; }
          .col-view-enquire { margin-bottom: 14px; }
          .rv-list { max-height: 120px; }
        }
        @media (max-width: 480px) {
          .hs-feat-card { width: 260px; }
          .hs-feat-img, .hs-feat-ph { height: 320px; }
          .hs-new-inner { grid-auto-columns: 120px; height: 300px; }
          .hs-new-card.tall { width: 120px; }
          .hs-mv-card { width: 170px; }
          .hs-mv-img, .hs-mv-ph { height: 220px; }
          .hs-mv-rank { font-size: 56px; }
          .col-grid { grid-template-columns: 1fr 1fr; }
          .col-view-img-main { height: 28vh; max-height: 28vh; }
          .col-view-img-placeholder { height: 28vh; }
          .col-view-body { padding: 14px 12px 24px; }
          .col-view-name { font-size: 18px; }
        }
      `}</style>

      <section id="collections" className="col-root">
        <div className="col-top-line" />

        {loading ? (
          <div className="col-grid" style={{ marginTop: 40 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ aspectRatio:'3/4', background:'linear-gradient(160deg,#1a1208,#0d0a06)', opacity: 0.4 + i * 0.04 }} />
            ))}
          </div>
        ) : (
          <>
            {/* FEATURED */}
            {featured.length > 0 && (
              <div>
                <div className="col-sec-head">
                  <div>
                    <div className="col-eyebrow"><div className="col-eyebrow-line" /><span>Hand Picked</span></div>
                    <h2 className="col-title">Featured <em>Pieces</em></h2>
                  </div>
                  <div className="col-sec-counter"><span>01</span> / {String(featured.length).padStart(2, '0')}</div>
                </div>
                <div className="hs-featured-wrap" ref={featRef}>
                  {featured.map((product, i) => (
                    <div key={product._id} className="hs-feat-card" onClick={() => openView(product)}>
                      <button className="col-heart-btn" onClick={e => { e.stopPropagation(); toggleWishlist(product._id) }}>
                        <HeartIcon filled={wishlist.includes(product._id)} />
                      </button>
                      <div className="hs-feat-badge">Featured</div>
                      {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="hs-feat-img" /> : <div className="hs-feat-ph"><span>TB</span></div>}
                      <div className="hs-feat-num"><span>{String(i + 1).padStart(2, '0')}</span> / {String(featured.length).padStart(2, '0')}</div>
                      <div className="hs-feat-info">
                        <div className="hs-feat-cat">{product.category}</div>
                        <div className="hs-feat-name">{product.name}</div>
                        <div className="hs-feat-price">{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollProgress scrollRef={featRef} />
                <div className="col-sec-divider" />
              </div>
            )}

            {/* NEW ARRIVALS */}
            {newArrivals.length > 0 && (
              <div>
                <div className="col-sec-head">
                  <div>
                    <div className="col-eyebrow"><div className="col-eyebrow-line" /><span>Just Dropped</span></div>
                    <h2 className="col-title">New <em>Arrivals</em></h2>
                  </div>
                  <div className="col-sec-counter"><span>{String(newArrivals.length).padStart(2, '0')}</span> pieces</div>
                </div>
                <div className="hs-new-wrap" ref={newRef}>
                  <div className="hs-new-inner">
                    {newArrivals.map((product, i) => {
                      const groupPos = i % 3
                      let cardClass = 'hs-new-card ' + (groupPos === 0 ? 'tall' : groupPos === 1 ? 'short-top' : 'short-bot')
                      return (
                        <div key={product._id} className={cardClass} onClick={() => openView(product)}>
                          {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <div className="hs-new-card-ph"><span>TB</span></div>}
                          <div className="hs-new-badge">New</div>
                          <div className="hs-new-info">
                            <div className="hs-new-name">{product.name}</div>
                            <div className="hs-new-price">{product.price}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <ScrollProgress scrollRef={newRef} />
                <div className="col-sec-divider" />
              </div>
            )}

            {/* MOST VIEWED */}
            {mostViewed.length > 0 && (
              <div>
                <div className="col-sec-head">
                  <div>
                    <div className="col-eyebrow"><div className="col-eyebrow-line" /><span>Trending Now</span></div>
                    <h2 className="col-title">Most <em>Viewed</em></h2>
                  </div>
                  <div className="col-sec-counter">Top <span>{String(mostViewed.length).padStart(2, '0')}</span></div>
                </div>
                <div className="hs-mv-wrap" ref={mvRef}>
                  {mostViewed.map((product, i) => (
                    <div key={product._id} className="hs-mv-card" onClick={() => openView(product)}>
                      <button className="col-heart-btn" onClick={e => { e.stopPropagation(); toggleWishlist(product._id) }}>
                        <HeartIcon filled={wishlist.includes(product._id)} />
                      </button>
                      <div className="hs-mv-rank">{String(i + 1).padStart(2, '0')}</div>
                      <div className="hs-mv-rank-badge">#{String(i + 1).padStart(2, '0')}</div>
                      {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="hs-mv-img" /> : <div className="hs-mv-ph"><span>TB</span></div>}
                      <div className="hs-mv-info">
                        <div className="hs-mv-cat">{product.category}</div>
                        <div className="hs-mv-name">{product.name}</div>
                        <div className="hs-mv-price">{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollProgress scrollRef={mvRef} />
                <div className="col-sec-divider" />
              </div>
            )}

            {/* BROWSE ALL */}
            <div>
              <div className="col-header">
                <div>
                  <div className="col-eyebrow"><div className="col-eyebrow-line" /><span>The Collection</span></div>
                  <h2 className="col-title">Browse <em>All</em></h2>
                </div>
                <div className="col-toolbar">
                  <div className="col-filters">
                    {filters.map(f => (
                      <button key={f} className={`col-filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                    ))}
                  </div>
                  <div className="col-toolbar-sep" />
                  <button className={`col-action-btn col-action-btn-select${selectMode ? ' active' : ''}`} onClick={() => { setSelectMode(!selectMode); setSelected([]) }}>
                    {selectMode ? <><CloseIcon /> Cancel</> : <><CheckIcon /> Select</>}
                  </button>
                  <button className="col-action-btn col-action-btn-wishlist" onClick={() => navigate('/wishlist')}>
                    <HeartIcon filled={false} /> Saved{wishlist.length > 0 ? ` (${wishlist.length})` : ''}
                  </button>
                </div>
              </div>
              <div className="col-grid">
                {filtered.length === 0 ? (
                  <div className="col-empty">
                    <div className="col-empty-eyebrow">The Bills</div>
                    <div className="col-empty-text">No pieces available yet — check back soon.</div>
                  </div>
                ) : (
                  filtered.map(product => (
                    <div key={product._id} className={`col-card${selected.includes(product._id) ? ' selected' : ''}`} onClick={() => selectMode ? toggleSelect(product._id) : openView(product)}>
                      <button className="col-card-heart" onClick={e => { e.stopPropagation(); toggleWishlist(product._id) }}>
                        <HeartIcon filled={wishlist.includes(product._id)} />
                      </button>
                      {selectMode && (
                        <div className={`col-select-check${selected.includes(product._id) ? ' checked' : ''}`}>
                          {selected.includes(product._id) && <CheckIcon />}
                        </div>
                      )}
                      {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="col-card-img" /> : <div className="col-card-placeholder"><span className="col-card-placeholder-text">TB</span></div>}
                      <div className="col-card-info">
                        <div className="col-card-category">{product.category}</div>
                        <div className="col-card-name">{product.name}</div>
                        <div className="col-card-price">{product.price}</div>
                      </div>
                      {!selectMode && (
                        <div className="col-card-overlay">
                          <div className="col-card-actions">
                            <button className="col-card-btn col-card-btn-wa" onClick={e => { e.stopPropagation(); handleWhatsApp(product) }}><WhatsAppIcon /> WhatsApp</button>
                            <button className="col-card-btn col-card-btn-dm" onClick={e => { e.stopPropagation(); window.open(settings?.instagram || '#', '_blank') }}>DM Us</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* BULK BAR */}
      <div className={`col-bulk-bar${selected.length > 0 ? ' visible' : ''}`}>
        <div className="col-bulk-bar-left">
          <div className="col-bulk-bar-dot" />
          <div className="col-bulk-bar-text"><span>{selected.length}</span> {selected.length === 1 ? 'piece' : 'pieces'} selected</div>
        </div>
        <div className="col-bulk-actions">
          <button className="col-bulk-btn col-bulk-btn-clear" onClick={clearSelect}>Clear</button>
          <button className="col-bulk-btn col-bulk-btn-wa" onClick={handleBulkEnquire}><WhatsAppIcon /> Enquire on All</button>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewProduct && (
        <div className="col-view-backdrop" onClick={e => e.target === e.currentTarget && closeView()}>
          <div className="col-view-modal">
            <button className="col-view-close" onClick={closeView}><CloseIcon /></button>
            <div className="col-view-imgwrap">
              {viewProduct.images?.[activeImg] ? <img src={viewProduct.images[activeImg]} alt={viewProduct.name} className="col-view-img-main" /> : <div className="col-view-img-placeholder"><span>TB</span></div>}
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
                <div onClick={() => navigate(`/shop/${viewProduct.vendor._id}`)} style={{ fontSize:11, color:'rgba(245,237,224,0.4)', marginBottom:12, letterSpacing:'0.05em', cursor:'pointer' }}>
                  Sold by <span style={{ color:'#c9933a', fontWeight:600, textDecoration:'underline' }}>{viewProduct.vendor.shopName}</span>
                  {viewProduct.vendor.verified && <span style={{ marginLeft:6 }}>✓</span>}
                </div>
              )}
              <div className="col-view-divider" />
              <div className="col-view-label">Description</div>
              <p className="col-view-desc">{viewProduct.description || 'No description provided.'}</p>
              <button className="col-view-enquire" onClick={() => handleWhatsApp(viewProduct)}>
                <WhatsAppIcon /> Enquire on This Piece
              </button>
              <div className="col-view-meta">
                <div>
                  <div className="col-view-meta-label">Category</div>
                  <div className="col-view-meta-value">{viewProduct.category || '—'}</div>
                </div>
                <div>
                  <div className="col-view-meta-label">Collection</div>
                  <div className="col-view-meta-value">{viewProduct.collection || '—'}</div>
                </div>
              </div>

              {/* REVIEWS SECTION */}
              <div className="rv-section">
                <div className="rv-head">
                  <span className="rv-title">Reviews</span>
                  {reviews.length > 0 && (
                    <div className="rv-avg">
                      <Stars rating={Math.round(reviewAvg)} size={12} />
                      <span className="rv-avg-num">{reviewAvg}</span>
                      <span className="rv-avg-count">({reviews.length})</span>
                    </div>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="rv-empty">Loading reviews…</div>
                ) : reviews.length === 0 ? (
                  <div className="rv-empty">No reviews yet — be the first!</div>
                ) : (
                  <div className="rv-list">
                    {reviews.map(r => (
                      <div key={r._id} className="rv-item">
                        <div className="rv-item-head">
                          <span className="rv-item-name">{r.name}</span>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <Stars rating={r.rating} size={11} />
                            <span className="rv-item-date">{new Date(r.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                          </div>
                        </div>
                        <div className="rv-item-comment">{r.comment}</div>
                      </div>
                    ))}
                  </div>
                )}

                {reviewSuccess && <div className="rv-success">✓ Review submitted — thank you!</div>}

                {!showReviewForm && !reviewSuccess && (
                  <button className="rv-add-btn" onClick={() => setShowReviewForm(true)}>+ Leave a Review</button>
                )}

                {showReviewForm && (
                  <div className="rv-form">
                    <input className="rv-input" placeholder="Your name" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name:e.target.value})} />
                    <div>
                      <div className="rv-title" style={{ marginBottom:6 }}>Rating</div>
                      <div className="rv-star-row">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} className="rv-star-btn" onClick={() => setReviewForm({...reviewForm, rating:s})}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={s <= reviewForm.rating ? '#c9933a' : 'none'} stroke="#c9933a" strokeWidth="1.5">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea className="rv-input" rows={3} placeholder="Share your thoughts…" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment:e.target.value})} />
                    {reviewError && <div className="rv-error">✕ {reviewError}</div>}
                    <div className="rv-form-actions">
                      <button className="rv-cancel-btn" onClick={() => { setShowReviewForm(false); setReviewError('') }}>Cancel</button>
                      <button className="rv-submit-btn" onClick={handleReviewSubmit} disabled={reviewSubmitting}>{reviewSubmitting ? 'Submitting…' : 'Submit Review'}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}