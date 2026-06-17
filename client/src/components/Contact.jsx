export default function Contact({ settings }) {
  const handleWhatsApp = () => {
    const msg = `Hello The Bills! I'd like to get in touch.`
    window.open(`https://wa.me/${settings?.whatsapp || '233546804804'}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <style>{`
        .contact-root {
          background: #0a0806;
          padding: 120px 48px;
          position: relative;
        }
        .contact-root::before {
          content: '';
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px; background: rgba(201,147,58,0.15);
        }
        .contact-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .contact-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .contact-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .contact-eyebrow span {
          font-family: 'Barlow', sans-serif; font-size: 10px;
          letter-spacing: 0.35em; text-transform: uppercase; color: #c9933a;
        }
        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 4vw, 58px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase; margin: 0 0 24px;
        }
        .contact-title em { font-style: italic; color: #c9933a; }
        .contact-desc {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 18px;
          color: rgba(245,237,224,0.45); line-height: 1.8;
          margin-bottom: 48px;
        }
        .contact-channels {
          display: flex; flex-direction: column; gap: 16px;
        }
        .contact-channel {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 24px;
          border: 1px solid rgba(201,147,58,0.12);
          background: rgba(201,147,58,0.02);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none;
        }
        .contact-channel:hover {
          border-color: rgba(201,147,58,0.3);
          background: rgba(201,147,58,0.05);
        }
        .contact-channel-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .contact-channel-label {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; letter-spacing: 0.25em;
          text-transform: uppercase; color: #c9933a; margin-bottom: 4px;
        }
        .contact-channel-value {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 16px;
          color: #f5ede0; letter-spacing: 0.04em;
        }
        .contact-channel-arrow {
          margin-left: auto;
          font-size: 18px; color: rgba(201,147,58,0.3);
          transition: transform 0.2s, color 0.2s;
        }
        .contact-channel:hover .contact-channel-arrow {
          transform: translateX(4px); color: #c9933a;
        }
        .contact-right {
          padding-top: 80px;
        }
        .contact-big {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(80px, 10vw, 140px);
          line-height: 0.85; letter-spacing: -0.03em;
          color: rgba(201,147,58,0.06); text-transform: uppercase;
          margin-bottom: 48px; user-select: none;
        }
        .contact-info-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
        }
        .contact-info-label {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; letter-spacing: 0.25em;
          text-transform: uppercase; color: rgba(245,237,224,0.25);
          margin-bottom: 8px;
        }
        .contact-info-value {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 15px;
          color: rgba(245,237,224,0.6); letter-spacing: 0.04em;
        }
        .contact-wa-btn {
          margin-top: 40px; width: 100%;
          padding: 18px; background: #25D366;
          color: #fff; border: none; cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: opacity 0.2s;
        }
        .contact-wa-btn:hover { opacity: 0.88; }
        @media (max-width: 900px) {
          .contact-root { padding: 80px 24px; }
          .contact-inner { grid-template-columns: 1fr; gap: 48px; }
          .contact-right { padding-top: 0; }
          .contact-big { font-size: 80px; }
        }
      `}</style>

      <section id="contact" className="contact-root">
        <div className="contact-inner">
          <div>
            <div className="contact-eyebrow">
              <div className="contact-eyebrow-line" />
              <span>Get In Touch</span>
            </div>
            <h2 className="contact-title">Let's <em>Talk</em></h2>
            <p className="contact-desc">
              Interested in a piece? Want to place a custom order? Reach out directly — we respond fast.
            </p>
            <div className="contact-channels">

              <a href={`https://wa.me/${settings?.whatsapp || '233546805804'}`}
                target="_blank" rel="noreferrer"
                className="contact-channel">

                <div className="contact-channel-icon">💬</div>
                <div>
                  <div className="contact-channel-label">WhatsApp</div>
                  <div className="contact-channel-value">{settings?.phone || '+233 546 805 804'}</div>
                </div>
                <div className="contact-channel-arrow">→</div>
              </a>

              <a
                href={settings?.instagram || 'https://instagram.com'}
                target="_blank" rel="noreferrer"
                className="contact-channel">
                <div className="contact-channel-icon">📸</div>
                <div>
                  <div className="contact-channel-label">Instagram</div>
                  <div className="contact-channel-value">@thebills</div>
                </div>
                <div className="contact-channel-arrow">→</div>
              </a>
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="contact-channel">
                  <div className="contact-channel-icon">✉️</div>
                  <div>
                    <div className="contact-channel-label">Email</div>
                    <div className="contact-channel-value">{settings.email}</div>
                  </div>
                  <div className="contact-channel-arrow">→</div>
                </a>
              )}
            </div>
          </div>

          <div className="contact-right">
            <div className="contact-big">The<br />Bills</div>
            <div className="contact-info-grid">
              <div>
                <div className="contact-info-label">Location</div>
                <div className="contact-info-value">Accra, Ghana</div>
              </div>
              <div>
                <div className="contact-info-label">Hours</div>
                <div className="contact-info-value">Mon – Sat · 9am – 6pm</div>
              </div>
              <div>
                <div className="contact-info-label">Response Time</div>
                <div className="contact-info-value">Within 24 hours</div>
              </div>
              <div>
                <div className="contact-info-label">Custom Orders</div>
                <div className="contact-info-value">Always welcome</div>
              </div>
            </div>
            <button className="contact-wa-btn" onClick={handleWhatsApp}>
              💬 &nbsp; Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>
    </>
  )
}