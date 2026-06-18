export default function Footer({ settings }) {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .footer-root {
          background: #080604;
          padding: 72px 48px 36px;
          position: relative;
          font-family: 'Barlow', sans-serif;
        }
        .footer-divider-top {
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.25) 30%, rgba(201,147,58,0.25) 70%, transparent);
        }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 56px;
          align-items: start;
        }
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 30px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #f5ede0;
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .footer-logo-dot {
          width: 5px; height: 5px;
          background: #c9933a; border-radius: 50%;
          flex-shrink: 0;
        }
        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-style: italic;
          font-size: 14.5px; color: rgba(245,237,224,0.28);
          letter-spacing: 0.05em; line-height: 1.7;
          max-width: 230px; margin-bottom: 28px;
        }
        .footer-col-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: #c9933a; margin-bottom: 22px;
        }
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
        .footer-social {
          display: flex; gap: 10px; margin-top: 24px;
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
        .footer-social-btn svg {
          width: 15px; height: 15px;
        }
        .footer-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid rgba(201,147,58,0.09);
          gap: 12px;
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
        @media (max-width: 768px) {
          .footer-root { padding: 48px 24px 28px; }
          .footer-root .footer-divider-top { left: 24px; right: 24px; }
          .footer-top { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-divider-top" />
        <div className="footer-inner">
          <div className="footer-top">

            <div>
              <div className="footer-logo">
                <div className="footer-logo-dot" />
                {settings?.brandName || 'The Bills'}
              </div>
              <div className="footer-tagline">
                {settings?.tagline || 'Crafted for the world, rooted in tradition.'}
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

            <div>
              <div className="footer-col-label">Navigate</div>
              <ul className="footer-links">
                <li><a href="#collections">Collections</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

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
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {year} <span>{settings?.brandName || 'The Bills'}</span>. All rights reserved.
            </div>
            <div className="footer-bottom-right">
              <span className="footer-bottom-link">Accra, Ghana</span>
              <div className="footer-separator" />
              <span className="footer-bottom-link">Crafted for the world</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}