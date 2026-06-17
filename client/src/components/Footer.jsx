export default function Footer({ settings }) {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .footer-root {
          background: #080604;
          padding: 64px 48px 32px;
          position: relative;
        }
        .footer-root::before {
          content: '';
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px; background: rgba(201,147,58,0.15);
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
        }
        .footer-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          gap: 48px; flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .footer-brand {}
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 28px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f5ede0; margin-bottom: 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .footer-logo-dot {
          width: 6px; height: 6px;
          background: #c9933a; border-radius: 50%;
        }
        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-style: italic;
          font-size: 14px; color: rgba(245,237,224,0.3);
          letter-spacing: 0.06em; max-width: 240px;
          line-height: 1.6;
        }
        .footer-links-group {}
        .footer-links-title {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: #c9933a; margin-bottom: 20px;
        }
        .footer-links {
          display: flex; flex-direction: column; gap: 12px;
          list-style: none; padding: 0; margin: 0;
        }
        .footer-links a {
          font-family: 'Barlow', sans-serif;
          font-size: 12px; letter-spacing: 0.1em;
          color: rgba(245,237,224,0.35);
          text-decoration: none; transition: color 0.2s;
        }
        .footer-links a:hover { color: #c9933a; }
        .footer-social {
          display: flex; gap: 12px; margin-top: 20px;
        }
        .footer-social-btn {
          width: 36px; height: 36px;
          border: 1px solid rgba(201,147,58,0.2);
          background: transparent; color: rgba(245,237,224,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer;
          transition: all 0.2s; text-decoration: none;
        }
        .footer-social-btn:hover {
          border-color: #c9933a; color: #c9933a;
          background: rgba(201,147,58,0.05);
        }
        .footer-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 32px;
          border-top: 1px solid rgba(201,147,58,0.08);
          gap: 16px; flex-wrap: wrap;
        }
        .footer-copy {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; letter-spacing: 0.15em;
          color: rgba(245,237,224,0.15);
        }
        .footer-copy span { color: rgba(201,147,58,0.4); }
        @media (max-width: 768px) {
          .footer-root { padding: 48px 24px 24px; }
          .footer-top { flex-direction: column; gap: 32px; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-dot" />
                The Bills
              </div>
              <div className="footer-tagline">
                {settings?.tagline || 'Crafted for the world, rooted in tradition.'}
              </div>
            </div>

            <div className="footer-links-group">
              <div className="footer-links-title">Navigate</div>
              <ul className="footer-links">
                <li><a href="#collections">Collections</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <div className="footer-links-title">Contact</div>
              <ul className="footer-links">
                <li><a href={`https://wa.me/${settings?.whatsapp || ''}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
                <li><a href={settings?.instagram || '#'} target="_blank" rel="noreferrer">Instagram</a></li>
                {settings?.email && <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
              </ul>
              <div className="footer-social">
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noreferrer" className="footer-social-btn">📸</a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="footer-social-btn">💬</a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="footer-social-btn">👤</a>
                )}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {year} <span>{settings?.brandName || 'The Bills'}</span>. All rights reserved.
            </div>
            <div className="footer-copy">
              Accra, Ghana · Crafted for the world
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}