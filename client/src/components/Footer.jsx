import { useState, useEffect } from 'react'
import { fetchCollections } from '../utils/api'
import logo from '../assets/billLogo.png'

export default function Footer({ settings }) {
  const year = new Date().getFullYear()
  const [collections, setCollections] = useState([])

  useEffect(() => {
    fetchCollections().then(setCollections).catch(console.error)
  }, [])

  return (
    <>
      <style>{`
        .footer-root {
          background: #080604;
          padding: 80px 56px 36px;
          position: relative;
          font-family: 'Barlow', sans-serif;
        }
        .footer-divider-top {
          position: absolute; top: 0; left: 56px; right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.25) 30%, rgba(201,147,58,0.25) 70%, transparent);
        }
        .footer-inner { max-width: 1200px; margin: 0 auto; }

        /* ── TOP GRID ── */
        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 56px;
          align-items: start;
        }

        /* ── BRAND COLUMN ── */
        .footer-brand-row {
          display: flex; align-items: center; gap: 13px;
          margin-bottom: 16px;
        }
        .footer-logo-img {
          width: 36px; height: 36px;
          object-fit: contain; display: block;
          flex-shrink: 0;
        }
        .footer-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 27px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f5ede0; line-height: 1;
        }
        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-style: italic;
          font-size: 14.5px; color: rgba(245,237,224,0.28);
          letter-spacing: 0.05em; line-height: 1.7;
          max-width: 260px; margin-bottom: 24px;
        }

        /* mini info row — location / hours */
        .footer-meta-row {
          display: flex; flex-direction: column; gap: 8px;
          margin-bottom: 26px;
        }
        .footer-meta-item {
          display: flex; align-items: center; gap: 10px;
        }
        .footer-meta-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(201,147,58,0.5); flex-shrink: 0;
        }
        .footer-meta-text {
          font-size: 11.5px; letter-spacing: 0.08em;
          color: rgba(245,237,224,0.28);
        }

        .footer-social {
          display: flex; gap: 10px;
        }
        .footer-social-btn {
          width: 36px; height: 36px;
          border: 1px solid rgba(201,147,58,0.18);
          background: transparent;
          color: rgba(245,237,224,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.22s;
          text-decoration: none;
        }
        .footer-social-btn:hover {
          border-color: rgba(201,147,58,0.7);
          color: #c9933a;
          background: rgba(201,147,58,0.06);
        }
        .footer-social-btn svg { width: 15px; height: 15px; }

        /* ── COLUMN LABEL ── */
        .footer-col-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: #c9933a; margin-bottom: 22px;
        }

        /* ── LINKS ── */
        .footer-links {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 13px;
        }
        .footer-links a {
          font-size: 12.5px; letter-spacing: 0.09em;
          color: rgba(245,237,224,0.32);
          text-decoration: none; transition: color 0.2s;
          display: inline-block;
        }
        .footer-links a:hover { color: #c9933a; }

        /* collections list — slightly different treatment, with count */
        .footer-collection-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
        }
        .footer-collection-count {
          font-size: 10px; color: rgba(201,147,58,0.3);
          font-variant-numeric: tabular-nums;
        }
        .footer-collections-empty {
          font-size: 11.5px; font-style: italic;
          color: rgba(245,237,224,0.18);
          font-family: 'Cormorant Garamond', serif;
        }

        /* ── BOTTOM BAR ── */
        .footer-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid rgba(201,147,58,0.09);
          gap: 12px; flex-wrap: wrap;
        }
        .footer-copy {
          font-size: 10.5px; letter-spacing: 0.14em;
          color: rgba(245,237,224,0.14);
        }
        .footer-copy span { color: rgba(201,147,58,0.45); }
        .footer-bottom-right {
          display: flex; align-items: center; gap: 20px;
        }
        .footer-bottom-link {
          font-size: 10px; letter-spacing: 0.14em;
          color: rgba(245,237,224,0.14);
          text-decoration: none; transition: color 0.2s;
        }
        .footer-bottom-link:hover { color: rgba(201,147,58,0.5); }
        .footer-separator {
          width: 1px; height: 10px;
          background: rgba(245,237,224,0.1);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 40px 32px; }
        }
        @media (max-width: 600px) {
          .footer-root { padding: 56px 24px 28px; }
          .footer-root .footer-divider-top { left: 24px; right: 24px; }
          .footer-top { grid-template-columns: 1fr; gap: 36px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 14px; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-divider-top" />
        <div className="footer-inner">
          <div className="footer-top">

            {/* ── BRAND ── */}
            <div>
              <div className="footer-brand-row">
                <img src={logo} alt={settings?.brandName || 'The Bills'} className="footer-logo-img" />
                <div className="footer-wordmark">
                  {settings?.shortName || 'TBs'}
                </div>
              </div>

              <div className="footer-tagline">
                {settings?.tagline || 'Crafted for the world, rooted in tradition.'}
              </div>

              <div className="footer-meta-row">
                <div className="footer-meta-item">
                  <div className="footer-meta-dot" />
                  <span className="footer-meta-text">{settings?.location || 'Accra, Ghana'}</span>
                </div>
                <div className="footer-meta-item">
                  <div className="footer-meta-dot" />
                  <span className="footer-meta-text">{settings?.hours || 'Mon – Sat · 9am – 6pm'}</span>
                </div>
                <div className="footer-meta-item">
                  <div className="footer-meta-dot" />
                  <span className="footer-meta-text">Custom orders welcome</span>
                </div>
              </div>

              <div className="footer-social">
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noreferrer" className="footer-social-btn" title="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="footer-social-btn" title="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                      <path d="M9 10c0 5 6 5 6 0"/>
                    </svg>
                  </a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="footer-social-btn" title="Facebook">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* ── NAVIGATE ── */}
            <div>
              <div className="footer-col-label">Navigate</div>
              <ul className="footer-links">
                <li><a href="#collections">Collections</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            {/* ── COLLECTIONS (dynamic) ── */}
            <div>
              <div className="footer-col-label">Our Collections</div>
              {collections.length > 0 ? (
                <ul className="footer-links">
                  {collections.slice(0, 6).map(c => (
                    <li key={c._id || c.name}>
                      <a href={`#collections`} className="footer-collection-row">
                        <span>{c.name}</span>
                        {typeof c.count === 'number' && (
                          <span className="footer-collection-count">{c.count}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="footer-collections-empty">New pieces coming soon.</div>
              )}
            </div>

            {/* ── GET IN TOUCH ── */}
            <div>
              <div className="footer-col-label">Get in Touch</div>
              <ul className="footer-links">
                {settings?.whatsapp && (
                  <li><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
                )}
                {settings?.instagram && (
                  <li><a href={settings.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
                )}
                {settings?.email && (
                  <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
                )}
                {settings?.phone && (
                  <li><a href={`tel:${settings.phone}`}>{settings.phone}</a></li>
                )}
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {year} <span>{settings?.brandName || 'The Bills'}</span>. All rights reserved.
            </div>
            <div className="footer-bottom-right">
              <span className="footer-bottom-link">{settings?.location || 'Accra, Ghana'}</span>
              <div className="footer-separator" />
              <span className="footer-bottom-link">Crafted for the world</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}