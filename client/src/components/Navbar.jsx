import { useState, useEffect } from 'react'

export default function Navbar({ settings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = ['Collections', 'About', 'Contact']

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Barlow:wght@300;400;500&display=swap');

        /* ── ROOT ── */
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        }

        /* thin gold line at very top */
        .nav-topline {
          height: 1px;
          background: linear-gradient(to right, transparent, #c9933a 40%, rgba(201,147,58,0.3) 100%);
        }

        .nav-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 26px 56px;
          background: rgba(10,8,6,0);
          border-bottom: 1px solid rgba(201,147,58,0);
          backdrop-filter: blur(0px);
          transition: padding 0.4s ease, background 0.4s ease,
                      border-color 0.4s ease, backdrop-filter 0.4s ease;
        }
        .nav-bar.scrolled {
          padding: 16px 56px;
          background: rgba(10,8,6,0.94);
          border-bottom-color: rgba(201,147,58,0.1);
          backdrop-filter: blur(16px);
        }

        /* ── LOGO ── */
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 20px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #f5ede0; text-decoration: none;
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 2;
        }
        .nav-logo-ornament {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
        }
        .nav-logo-ornament-line {
          width: 18px; height: 1px; background: #c9933a; opacity: 0.7;
        }
        .nav-logo-dot {
          width: 5px; height: 5px;
          background: #c9933a; border-radius: 50%;
          box-shadow: 0 0 6px rgba(201,147,58,0.5);
        }

        /* ── DESKTOP NAV ── */
        .nav-desktop {
          display: flex; align-items: center; gap: 48px;
        }
        .nav-links {
          display: flex; align-items: center; gap: 44px;
          list-style: none; margin: 0; padding: 0;
        }
        .nav-links a {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(245,237,224,0.5);
          text-decoration: none;
          transition: color 0.25s;
          position: relative; padding-bottom: 4px;
        }
        /* underline sweeps in from center */
        .nav-links a::before {
          content: '';
          position: absolute; bottom: 0; left: 50%; right: 50%;
          height: 1px; background: #c9933a;
          transition: left 0.3s ease, right 0.3s ease;
        }
        .nav-links a:hover { color: #f5ede0; }
        .nav-links a:hover::before { left: 0; right: 0; }

        /* divider between links and CTA */
        .nav-divider {
          width: 1px; height: 18px;
          background: rgba(201,147,58,0.2);
        }

        /* ── CTA BUTTON ── */
        .nav-enquire {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #0a0806;
          background: #c9933a;
          border: none; padding: 11px 28px;
          cursor: pointer; transition: opacity 0.2s, box-shadow 0.2s;
          text-decoration: none; display: inline-block;
          position: relative;
        }
        .nav-enquire::after {
          content: '';
          position: absolute; inset: 0;
          box-shadow: 0 0 0 0 rgba(201,147,58,0.4);
          transition: box-shadow 0.3s;
        }
        .nav-enquire:hover { opacity: 0.88; }
        .nav-enquire:hover::after {
          box-shadow: 0 0 18px 2px rgba(201,147,58,0.2);
        }

        /* ── HAMBURGER ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center; align-items: flex-end;
          gap: 5px; background: none; border: none;
          cursor: pointer; padding: 6px;
          position: relative; z-index: 101;
        }
        .nav-hamburger span {
          display: block; height: 1px; background: #f5ede0;
          transition: all 0.35s cubic-bezier(0.77,0,0.18,1);
        }
        .nav-hamburger span:nth-child(1) { width: 26px; }
        .nav-hamburger span:nth-child(2) { width: 18px; }
        .nav-hamburger span:nth-child(3) { width: 22px; }
        /* animate to X when open */
        .nav-hamburger.open span:nth-child(1) { width: 24px; transform: translateY(6px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { width: 24px; transform: translateY(-6px) rotate(-45deg); }

        /* ── MOBILE MENU ── */
        .nav-mobile {
          position: fixed; inset: 0; z-index: 100;
          background: #0a0806;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
          overflow: hidden;
        }
        .nav-mobile.open { transform: translateX(0); }

        /* texture overlay */
        .nav-mobile::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg, transparent, transparent 60px,
            rgba(201,147,58,0.015) 60px, rgba(201,147,58,0.015) 61px
          );
          pointer-events: none;
        }
        /* gold left edge */
        .nav-mobile::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 1px; height: 100%;
          background: linear-gradient(to bottom, transparent, #c9933a 40%, transparent);
        }

        /* watermark */
        .nav-mobile-watermark {
          position: absolute; bottom: -60px; right: -30px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: clamp(120px, 22vw, 220px);
          color: rgba(201,147,58,0.04); letter-spacing: -0.04em;
          text-transform: uppercase; user-select: none; pointer-events: none;
          line-height: 1;
        }

        /* links */
        .nav-mobile-links {
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
          position: relative; z-index: 2; width: 100%;
        }
        .nav-mobile a {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 9vw, 56px);
          letter-spacing: 0.06em; text-transform: uppercase;
          color: rgba(245,237,224,0.7); text-decoration: none;
          display: block; padding: 12px 32px;
          text-align: center; width: 100%;
          transition: color 0.2s;
          position: relative;
        }
        .nav-mobile a::after {
          content: '';
          position: absolute; bottom: 10px;
          left: 50%; right: 50%;
          height: 1px; background: #c9933a;
          transition: left 0.35s ease, right 0.35s ease;
        }
        .nav-mobile a:hover { color: #f5ede0; }
        .nav-mobile a:hover::after { left: 32px; right: 32px; }

        /* separator before CTA */
        .nav-mobile-sep {
          width: 40px; height: 1px;
          background: rgba(201,147,58,0.3);
          margin: 20px 0 28px;
          position: relative; z-index: 2;
        }

        /* CTA in mobile menu */
        .nav-mobile .nav-enquire {
          position: relative; z-index: 2;
          font-size: 10px; padding: 14px 52px;
          letter-spacing: 0.3em;
        }

        /* meta info at bottom */
        .nav-mobile-meta {
          position: absolute; bottom: 36px;
          left: 0; right: 0;
          display: flex; justify-content: center; gap: 28px;
          z-index: 2;
        }
        .nav-mobile-meta span {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(245,237,224,0.16);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .nav-bar         { padding: 20px 28px; }
          .nav-bar.scrolled{ padding: 14px 28px; }
          .nav-desktop     { display: none; }
          .nav-hamburger   { display: flex; }
        }
      `}</style>

      <div className="nav-root">
        <div className="nav-topline" />

        <div className={`nav-bar${scrolled ? ' scrolled' : ''}`}>

          {/* Logo */}
          <a href="/" className="nav-logo">
            <div className="nav-logo-ornament">
              <div className="nav-logo-ornament-line" />
              <div className="nav-logo-dot" />
              <div className="nav-logo-ornament-line" />
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
            </ul>
            <div className="nav-divider" />
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

      {/* Mobile full-screen menu */}
      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <div className="nav-mobile-watermark">TB</div>

        <div className="nav-mobile-links">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="nav-mobile-sep" />

        <a
          href="#contact"
          className="nav-enquire"
          onClick={() => setMenuOpen(false)}
        >
          Enquire Now
        </a>

        <div className="nav-mobile-meta">
          <span>Est. 2024</span>
          <span>Accra, Ghana</span>
          <span>The Bills</span>
        </div>
      </div>
    </>
  )
}