import { useState, useEffect } from 'react'

export default function Navbar({ settings }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = ['Collections', 'About', 'Contact']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Barlow:wght@300;400;500&display=swap');

        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 20px 48px;
          background: rgba(10,8,6,0.92);
          border-bottom: 1px solid rgba(201,147,58,0.12);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 22px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f5ede0; text-decoration: none;
          display: flex; align-items: center; gap: 10px;
        }
        .nav-logo-dot {
          width: 6px; height: 6px;
          background: #c9933a; border-radius: 50%;
        }
        .nav-links {
          display: flex; align-items: center; gap: 40px;
          list-style: none; margin: 0; padding: 0;
        }
        .nav-links a {
          font-family: 'Barlow', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(245,237,224,0.6);
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute; bottom: -4px; left: 0; right: 0;
          height: 1px; background: #c9933a;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s;
        }
        .nav-links a:hover { color: #f5ede0; }
        .nav-links a:hover::after { transform: scaleX(1); }
        .nav-enquire {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #0a0806; background: #c9933a;
          border: none; padding: 10px 24px;
          cursor: pointer; transition: opacity 0.2s;
          text-decoration: none; display: inline-block;
        }
        .nav-enquire:hover { opacity: 0.85; }
        .nav-desktop { display: flex; align-items: center; gap: 40px; }
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .nav-hamburger span {
          display: block; width: 24px; height: 1px;
          background: #f5ede0; transition: all 0.3s;
        }
        .nav-mobile {
          position: fixed; inset: 0; z-index: 99;
          background: #0a0806;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 40px;
          transition: transform 0.4s cubic-bezier(0.77,0,0.18,1);
        }
        .nav-mobile a {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 42px;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #f5ede0; text-decoration: none;
          transition: color 0.2s;
        }
        .nav-mobile a:hover { color: #c9933a; }
        .nav-mobile-close {
          position: absolute; top: 28px; right: 48px;
          background: none; border: none; cursor: pointer;
          font-size: 28px; color: rgba(245,237,224,0.4);
        }
        @media (max-width: 768px) {
          .nav-root { padding: 16px 24px; }
          .nav-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className="nav-root">
        <a href="/" className="nav-logo">
          <div className="nav-logo-dot" />
          {settings?.brandName || 'The Bills'}
        </a>

        <div className="nav-desktop">
          <ul className="nav-links">
            {links.map(link => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`}>{link}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="nav-enquire">Enquire Now</a>
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className="nav-mobile" style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button className="nav-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {links.map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
            {link}
          </a>
        ))}
        <a href="#contact" className="nav-enquire" onClick={() => setMenuOpen(false)}>
          Enquire Now
        </a>
      </div>
    </>
  )
}


// Email: admin@thebills.com
// Password: thebills2024