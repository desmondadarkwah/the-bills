import { useState, useEffect } from 'react'
import { useUserAuth } from '../context/UserAuthContext'
import logo from '../assets/billLogo.png'

export default function Navbar({ settings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useUserAuth()

  const links = ['Collections', 'About', 'Contact']

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = () => { logout(); setMenuOpen(false) }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Barlow:wght@300;400;500&display=swap');

        .nav-root { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
        .nav-topline { height: 1px; background: linear-gradient(to right, transparent, #c9933a 40%, rgba(201,147,58,0.3) 100%); }
        .nav-bar { display: flex; align-items: center; justify-content: space-between; padding: 22px 56px; background: rgba(10,8,6,0); border-bottom: 1px solid rgba(201,147,58,0); backdrop-filter: blur(0px); transition: padding 0.4s ease, background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease; }
        .nav-bar.scrolled { padding: 14px 56px; background: rgba(10,8,6,0.94); border-bottom-color: rgba(201,147,58,0.1); backdrop-filter: blur(16px); }

        .nav-logo { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 19px; letter-spacing: 0.2em; text-transform: uppercase; color: #f5ede0; text-decoration: none; display: flex; align-items: center; gap: 12px; position: relative; z-index: 2; }
        .nav-logo-mark { width: 38px; height: 38px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .nav-logo-mark img { width: 100%; height: 100%; object-fit: contain; display: block; }

        .nav-desktop { display: flex; align-items: center; gap: 48px; }
        .nav-links { display: flex; align-items: center; gap: 44px; list-style: none; margin: 0; padding: 0; }
        .nav-links a { font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(245,237,224,0.5); text-decoration: none; transition: color 0.25s; position: relative; padding-bottom: 4px; }
        .nav-links a::before { content: ''; position: absolute; bottom: 0; left: 50%; right: 50%; height: 1px; background: #c9933a; transition: left 0.3s ease, right 0.3s ease; }
        .nav-links a:hover { color: #f5ede0; }
        .nav-links a:hover::before { left: 0; right: 0; }
        .nav-divider { width: 1px; height: 18px; background: rgba(201,147,58,0.2); }

        .nav-enquire { font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase; color: #0a0806; background: #c9933a; border: none; padding: 11px 28px; cursor: pointer; transition: opacity 0.2s, box-shadow 0.3s; text-decoration: none; display: inline-block; }
        .nav-enquire:hover { opacity: 0.92; box-shadow: 0 0 18px 1px rgba(201,147,58,0.3); }

        /* USER AREA */
        .nav-user-area { display: flex; align-items: center; gap: 12px; }
        .nav-user-avatar { width: 32px; height: 32px; background: rgba(201,147,58,0.15); border: 1px solid rgba(201,147,58,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 13px; color: #c9933a; flex-shrink: 0; }
        .nav-user-name { font-family: 'Barlow', sans-serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,237,224,0.5); }
        .nav-user-logout { font-family: 'Barlow', sans-serif; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,237,224,0.25); background: none; border: none; cursor: pointer; padding: 0; transition: color 0.2s; }
        .nav-user-logout:hover { color: #c9933a; }
        .nav-sign-in { font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,237,224,0.4); text-decoration: none; border: 1px solid rgba(201,147,58,0.2); padding: 8px 16px; transition: all 0.2s; }
        .nav-sign-in:hover { border-color: #c9933a; color: #c9933a; }

        .nav-hamburger { display: none; flex-direction: column; justify-content: center; align-items: flex-end; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; position: relative; z-index: 101; }
        .nav-hamburger span { display: block; height: 1px; background: #f5ede0; transition: all 0.35s cubic-bezier(0.77,0,0.18,1); }
        .nav-hamburger span:nth-child(1) { width: 26px; }
        .nav-hamburger span:nth-child(2) { width: 18px; }
        .nav-hamburger span:nth-child(3) { width: 22px; }
        .nav-hamburger.open span:nth-child(1) { width: 24px; transform: translateY(6px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { width: 24px; transform: translateY(-6px) rotate(-45deg); }

        .nav-mobile { position: fixed; inset: 0; z-index: 100; background: #0a0806; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateX(100%); transition: transform 0.45s cubic-bezier(0.77,0,0.18,1); overflow: hidden; }
        .nav-mobile.open { transform: translateX(0); }
        .nav-mobile::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(201,147,58,0.015) 60px, rgba(201,147,58,0.015) 61px); pointer-events: none; }
        .nav-mobile::after { content: ''; position: absolute; top: 0; left: 0; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, #c9933a 40%, transparent); }
        .nav-mobile-close { position: absolute; top: 24px; right: 28px; z-index: 10; width: 38px; height: 38px; background: rgba(201,147,58,0.08); border: 1px solid rgba(201,147,58,0.25); color: rgba(245,237,224,0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 14px; line-height: 1; }
        .nav-mobile-close:hover { border-color: #c9933a; color: #f5ede0; background: rgba(201,147,58,0.12); }
        .nav-mobile-watermark { position: absolute; bottom: -60px; right: -30px; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: clamp(120px, 22vw, 220px); color: rgba(201,147,58,0.04); letter-spacing: -0.04em; text-transform: uppercase; user-select: none; pointer-events: none; line-height: 1; }
        .nav-mobile-links { display: flex; flex-direction: column; align-items: center; gap: 0; position: relative; z-index: 2; width: 100%; }
        .nav-mobile-links a { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(36px, 9vw, 56px); letter-spacing: 0.06em; text-transform: uppercase; color: rgba(245,237,224,0.7); text-decoration: none; display: block; padding: 12px 32px; text-align: center; width: 100%; transition: color 0.2s; position: relative; }
        .nav-mobile-links a::after { content: ''; position: absolute; bottom: 10px; left: 50%; right: 50%; height: 1px; background: #c9933a; transition: left 0.35s ease, right 0.35s ease; }
        .nav-mobile-links a:hover { color: #f5ede0; }
        .nav-mobile-links a:hover::after { left: 32px; right: 32px; }
        .nav-mobile-sep { width: 40px; height: 1px; background: rgba(201,147,58,0.3); margin: 20px 0 28px; position: relative; z-index: 2; }
        .nav-mobile .nav-enquire { position: relative; z-index: 2; font-size: 10px; padding: 14px 52px; letter-spacing: 0.3em; }
        .nav-mobile-user { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 20px; }
        .nav-mobile-user-name { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: rgba(245,237,224,0.4); letter-spacing: 0.1em; }
        .nav-mobile-user-logout { font-family: 'Barlow', sans-serif; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(201,147,58,0.5); background: none; border: 1px solid rgba(201,147,58,0.2); padding: 8px 20px; cursor: pointer; }
        .nav-mobile-meta { position: absolute; bottom: 36px; left: 0; right: 0; display: flex; justify-content: center; gap: 28px; z-index: 2; }
        .nav-mobile-meta span { font-family: 'Barlow', sans-serif; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(245,237,224,0.16); }

        @media (max-width: 900px) {
          .nav-bar { padding: 18px 28px; }
          .nav-bar.scrolled { padding: 13px 28px; }
          .nav-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <div className="nav-root">
        <div className="nav-topline" />
        <div className={`nav-bar${scrolled ? ' scrolled' : ''}`}>

          {/* Logo */}
          <a href="/" className="nav-logo">
            <div className="nav-logo-mark">
              <img src={logo} alt={settings?.brandName || 'The Bills'} />
            </div>
            {settings?.brandName || 'The Bills'}
          </a>

          {/* Desktop */}
          <div className="nav-desktop">
            <ul className="nav-links">
              {links.map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`}>{link}</a>
                </li>
              ))}
              <li><a href="/vendor/login">Vendor</a></li>
            </ul>

            <div className="nav-divider" />

            {user ? (
              <div className="nav-user-area">
                <div className="nav-user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="nav-user-name">{user.name?.split(' ')[0]}</div>
                  <button className="nav-user-logout" onClick={handleLogout}>Sign out</button>
                </div>
              </div>
            ) : (
              <a href="/login" className="nav-sign-in">Sign In</a>
            )}

            <a href="#contact" className="nav-enquire">Enquire Now</a>
          </div>

          {/* Hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <div className="nav-mobile-watermark">TB</div>
        <button className="nav-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>

        <div className="nav-mobile-links">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
          <a href="/vendor/login" onClick={() => setMenuOpen(false)}>Vendor</a>
        </div>

        <div className="nav-mobile-sep" />

        <a href="#contact" className="nav-enquire" onClick={() => setMenuOpen(false)}>
          Enquire Now
        </a>

        {user ? (
          <div className="nav-mobile-user">
            <div className="nav-mobile-user-name">Hi, {user.name?.split(' ')[0]}</div>
            <button className="nav-mobile-user-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <div style={{ position:'relative', zIndex:2, display:'flex', gap:10, marginTop:20 }}>
            <a href="/login" onClick={() => setMenuOpen(false)} style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,237,224,0.4)', textDecoration:'none', border:'1px solid rgba(201,147,58,0.2)', padding:'10px 20px' }}>Sign In</a>
            <a href="/register" onClick={() => setMenuOpen(false)} style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#0a0806', background:'#c9933a', textDecoration:'none', padding:'10px 20px' }}>Register</a>
          </div>
        )}

        <div className="nav-mobile-meta">
          <span>Est. 2024</span>
          <span>Accra, Ghana</span>
          <span>The Bills</span>
        </div>
      </div>
    </>
  )
}