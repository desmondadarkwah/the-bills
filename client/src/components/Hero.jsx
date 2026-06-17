import { useEffect, useState } from 'react'

export default function Hero({ settings }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  return (
    <>
      <style>{`
        .hero-root {
          position: relative;
          min-height: 100vh;
          background: #0a0806;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0a0806 0%, #1a0f08 40%, #0d0a06 100%);
        }
        .hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(201,147,58,0.015) 60px, rgba(201,147,58,0.015) 62px);
        }
        .hero-watermark {
          position: absolute;
          top: 50%; right: -40px;
          transform: translateY(-50%);
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: clamp(180px, 22vw, 320px);
          line-height: 1; color: rgba(201,147,58,0.04);
          letter-spacing: -0.04em; text-transform: uppercase;
          user-select: none; pointer-events: none;
          white-space: nowrap;
        }
        .hero-content {
          position: relative; z-index: 2;
          padding: 0 48px 80px;
          max-width: 1200px;
          opacity: ${loaded ? 1 : 0};
          transform: translateY(${loaded ? '0' : '30px'});
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px;
        }
        .hero-eyebrow-line {
          width: 48px; height: 1px; background: #c9933a;
        }
        .hero-eyebrow span {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: #c9933a;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(64px, 9vw, 140px);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: #f5ede0;
          margin: 0 0 40px;
          text-transform: uppercase;
        }
        .hero-title em {
          font-style: italic;
          color: #c9933a;
          font-weight: 300;
        }
        .hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }
        .hero-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-style: italic;
          font-size: clamp(16px, 2vw, 22px);
          color: rgba(245,237,224,0.5);
          letter-spacing: 0.04em;
          max-width: 400px;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex; align-items: center; gap: 20px;
        }
        .hero-btn-primary {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: #0a0806; background: #c9933a;
          border: none; padding: 16px 40px;
          cursor: pointer; transition: opacity 0.2s;
          text-decoration: none; display: inline-block;
        }
        .hero-btn-primary:hover { opacity: 0.85; }
        .hero-btn-ghost {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(245,237,224,0.6);
          border: 1px solid rgba(201,147,58,0.3);
          background: transparent;
          padding: 16px 40px;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-block;
        }
        .hero-btn-ghost:hover {
          border-color: #c9933a;
          color: #f5ede0;
        }
        .hero-scroll {
          position: absolute;
          bottom: 40px; right: 48px;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          z-index: 2;
        }
        .hero-scroll span {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(245,237,224,0.25);
          writing-mode: vertical-rl;
        }
        .hero-scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, rgba(201,147,58,0.6), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(0.6); }
        }
        .hero-corner {
          position: absolute;
          top: 120px; right: 48px;
          z-index: 2;
          text-align: right;
        }
        .hero-corner-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 11px;
          letter-spacing: 0.2em; color: rgba(245,237,224,0.2);
        }
        @media (max-width: 768px) {
          .hero-content { padding: 0 24px 100px; }
          .hero-bottom { flex-direction: column; align-items: flex-start; }
          .hero-scroll { right: 24px; }
          .hero-corner { right: 24px; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-btn-primary, .hero-btn-ghost { text-align: center; width: 100%; }
        }
      `}</style>

      <section className="hero-root">
        <div className="hero-bg" />
        <div className="hero-watermark">TB</div>

        <div className="hero-corner">
          <div className="hero-corner-num">Est. 2024</div>
          <div className="hero-corner-num" style={{ marginTop:4 }}>Accra, Ghana</div>
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span>New Collection</span>
          </div>

          <h1 className="hero-title">
            Crafted<br />
            for the <em>World</em>
          </h1>

          <div className="hero-bottom">
            <p className="hero-tagline">
              {settings?.tagline || 'Rooted in tradition. Dressed for the world.'}
            </p>
            <div className="hero-actions">
              <a href="#collections" className="hero-btn-primary">View Collections</a>
              <a href="#contact" className="hero-btn-ghost">Get in Touch</a>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>
    </>
  )
}