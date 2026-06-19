import { useState, useEffect } from 'react'
import { fetchSettings } from '../utils/api'

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('233546805804')
  const [visible, setVisible]   = useState(false)

  useEffect(() => {
    fetchSettings()
      .then(data => { if (data.whatsapp) setWhatsapp(data.whatsapp) })
      .catch(console.error)

    const t = setTimeout(() => setVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  const message = "Hello The Bills! I'd like to enquire about your pieces."
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap');

        .wa-btn {
          position: fixed;
          bottom: 32px; right: 32px;
          z-index: 9999;
          display: flex; align-items: center; gap: 0;
          text-decoration: none;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          pointer-events: none;
        }
        .wa-btn.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* label — slides in on hover */
        .wa-label {
          background: #0a0806;
          border: 1px solid rgba(201,147,58,0.25);
          border-right: none;
          color: #f5ede0;
          font-family: 'Barlow', sans-serif;
          font-weight: 500; font-size: 10px;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 0 18px;
          height: 50px;
          display: flex; align-items: center;
          white-space: nowrap;
          max-width: 0; overflow: hidden;
          transition: max-width 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .wa-btn:hover .wa-label,
        .wa-btn:focus .wa-label {
          max-width: 170px;
        }

        /* gold accent divider */
        .wa-accent {
          width: 0; height: 50px;
          background: #c9933a;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
        }
        .wa-btn:hover .wa-accent,
        .wa-btn:focus .wa-accent {
          width: 1px;
        }

        /* icon square — dark with gold border, not WhatsApp green */
        .wa-icon {
          width: 50px; height: 50px;
          background: #0a0806;
          border: 1px solid rgba(201,147,58,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          position: relative;
          transition: border-color 0.25s, background 0.25s;
        }
        .wa-btn:hover .wa-icon {
          background: #14100a;
          border-color: #c9933a;
        }

        /* soft pulse ring, gold-tinted */
        .wa-pulse {
          position: absolute; inset: -5px;
          border: 1px solid rgba(201,147,58,0.3);
          animation: wa-pulse 2.4s ease-out infinite;
        }
        @keyframes wa-pulse {
          0%   { opacity: 1;   transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.4); }
        }

        .wa-icon svg {
          width: 21px; height: 21px;
          fill: #c9933a;
          position: relative; z-index: 1;
          transition: fill 0.25s;
        }
        .wa-btn:hover .wa-icon svg { fill: #ddb872; }
      `}</style>

      
      <a  href={url}
        target="_blank"
        rel="noreferrer"
        className={`wa-btn${visible ? ' visible' : ''}`}
        aria-label="Chat with The Bills on WhatsApp"
      >
        <div className="wa-label">Enquire on WhatsApp</div>
        <div className="wa-accent" />
        <div className="wa-icon">
          <div className="wa-pulse" />
          <svg viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </a>
    </>
  )
}