import { useState, useEffect } from 'react'
import logo from '../assets/billLogo.png'

export default function Loader() {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Barlow:wght@400&display=swap');

        .loader-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #0a0806;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 20px;
          opacity: ${fadeOut ? 0 : 1};
          pointer-events: ${fadeOut ? 'none' : 'all'};
          transition: opacity 0.8s ease;
        }

        /* logo + ring wrapper */
        .loader-center {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 96px; height: 96px;
        }

        /* expanding ring */
        .loader-ring {
          position: absolute;
          width: 100%; height: 100%;
          border: 1px solid rgba(201,147,58,0.25);
          border-radius: 50%;
          animation: loaderRing 1.8s ease-in-out infinite;
        }

        @keyframes loaderRing {
          0%   { transform: scale(0.75); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        /* actual logo image */
        .loader-logo {
          width: 58px; height: 58px;
          object-fit: contain;
          position: relative; z-index: 1;
          animation: loaderPulse 1.8s ease-in-out infinite alternate;
        }

        @keyframes loaderPulse {
          from { opacity: 0.65; transform: scale(0.96); }
          to   { opacity: 1;    transform: scale(1);    }
        }

        /* brand name — subtle, tiny */
        .loader-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 11px;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: rgba(245,237,224,0.35);
        }

        /* shimmer progress bar */
        .loader-bar-track {
          width: 100px; height: 1px;
          background: rgba(201,147,58,0.1);
          overflow: hidden; position: relative;
        }

        .loader-bar-fill {
          position: absolute; top: 0; bottom: 0;
          left: -40%; width: 40%;
          background: linear-gradient(90deg, transparent, #c9933a, transparent);
          animation: loaderBar 1.4s ease-in-out infinite;
        }

        @keyframes loaderBar {
          0%   { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>

      <div className="loader-root">
        <div className="loader-center">
          <div className="loader-ring" />
          <img src={logo} alt="The Bills" className="loader-logo" />
        </div>

        <div className="loader-text">The Bills</div>

        <div className="loader-bar-track">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </>
  )
}