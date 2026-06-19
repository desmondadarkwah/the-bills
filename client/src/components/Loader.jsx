import { useState, useEffect } from 'react'

export default function Loader() {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');

        .loader-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #0a0806;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 24px;
          opacity: ${fadeOut ? 0 : 1};
          pointer-events: ${fadeOut ? 'none' : 'all'};
          transition: opacity 0.6s ease;
        }

        .loader-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 13px;
          letter-spacing: 0.1em; color: #0a0806;
        }

        .loader-mark {
          width: 64px; height: 64px;
          background: #c9933a;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          animation: loaderPulse 1.8s ease-in-out infinite;
        }

        @keyframes loaderPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.94); opacity: 0.85; }
        }

        .loader-mark::before {
          content: '';
          position: absolute; inset: -8px;
          border: 1px solid rgba(201,147,58,0.3);
          animation: loaderRing 1.8s ease-in-out infinite;
        }

        @keyframes loaderRing {
          0% { transform: scale(0.85); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        .loader-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 20px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #f5ede0;
        }

        .loader-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(201,147,58,0.6);
        }

        .loader-bar-track {
          width: 160px; height: 1px;
          background: rgba(201,147,58,0.15);
          margin-top: 8px; overflow: hidden;
          position: relative;
        }

        .loader-bar-fill {
          position: absolute; top: 0; left: 0; bottom: 0;
          width: 40%;
          background: #c9933a;
          animation: loaderBar 1.2s ease-in-out infinite;
        }

        @keyframes loaderBar {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>

      <div className="loader-root">
        <div className="loader-mark">
          <span className="loader-logo">TB</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="loader-text">The Bills</div>
          <div className="loader-sub" style={{ marginTop: 6 }}>Crafted for the world</div>
        </div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </>
  )
}