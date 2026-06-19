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
          font-family: 'Barlow', sans-serif;
        }
        .contact-top-line {
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.22) 30%, rgba(201,147,58,0.22) 70%, transparent);
        }
        .contact-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .contact-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 22px;
        }
        .contact-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .contact-eyebrow span {
          font-size: 9.5px; letter-spacing: 0.36em;
          text-transform: uppercase; color: #c9933a;
        }
        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 4vw, 58px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase;
          margin: 0 0 22px;
        }
        .contact-title em { font-style: italic; color: #c9933a; }
        .contact-desc {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 18px;
          color: rgba(245,237,224,0.4); line-height: 1.8;
          margin-bottom: 44px; max-width: 400px;
        }
        .contact-channels { display: flex; flex-direction: column; gap: 10px; }
        .contact-channel {
          display: flex; align-items: center; gap: 20px;
          padding: 18px 22px;
          border: 1px solid rgba(201,147,58,0.1);
          background: rgba(201,147,58,0.015);
          cursor: pointer; transition: all 0.22s;
          text-decoration: none;
        }
        .contact-channel:hover {
          border-color: rgba(201,147,58,0.28);
          background: rgba(201,147,58,0.045);
        }
        .contact-channel-icon {
          width: 38px; height: 38px; flex-shrink: 0;
          border: 1px solid rgba(201,147,58,0.15);
          display: flex; align-items: center; justify-content: center;
          color: #c9933a;
        }
        .contact-channel-icon svg { width: 16px; height: 16px; }
        .contact-channel-label {
          font-size: 8.5px; letter-spacing: 0.28em;
          text-transform: uppercase; color: #c9933a; margin-bottom: 5px;
        }
        .contact-channel-value {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 16px;
          color: #f5ede0; letter-spacing: 0.04em;
        }
        .contact-channel-arrow {
          margin-left: auto; flex-shrink: 0;
          color: rgba(201,147,58,0.25); font-size: 14px;
          transition: transform 0.22s, color 0.22s;
        }
        .contact-channel:hover .contact-channel-arrow {
          transform: translateX(5px); color: #c9933a;
        }
        .contact-right { padding-top: 64px; }
        .contact-big {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(80px, 10vw, 130px);
          line-height: 0.82; letter-spacing: -0.03em;
          color: rgba(201,147,58,0.055); text-transform: uppercase;
          margin-bottom: 52px; user-select: none;
        }
        .contact-info-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 28px 32px; margin-bottom: 40px;
        }
        .contact-info-label {
          font-size: 8.5px; letter-spacing: 0.28em;
          text-transform: uppercase; color: rgba(245,237,224,0.22);
          margin-bottom: 7px;
        }
        .contact-info-value {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400; font-size: 15px;
          color: rgba(245,237,224,0.55); letter-spacing: 0.04em;
        }
        .contact-wa-btn {
          width: 100%; padding: 17px;
          background: transparent;
          color: #c9933a;
          border: 1px solid #c9933a;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.25s;
        }
        .contact-wa-btn:hover {
          background: #c9933a;
          color: #0a0806;
        }
        .contact-wa-btn svg { width: 16px; height: 16px; }
        @media (max-width: 900px) {
          .contact-root { padding: 80px 24px; }
          .contact-top-line { left: 24px; right: 24px; }
          .contact-inner { grid-template-columns: 1fr; gap: 48px; }
          .contact-right { padding-top: 0; }
          .contact-big { font-size: 80px; }
        }
      `}</style>

      <section id="contact" className="contact-root">
        <div className="contact-top-line" />
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
                className="contact-channel"
              >
                <div className="contact-channel-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10c0 5 6 5 6 0"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-channel-label">WhatsApp</div>
                  <div className="contact-channel-value">{settings?.phone || '+233 546 805 804'}</div>
                </div>
                <div className="contact-channel-arrow">→</div>
              </a>

              
             <a href={settings?.instagram || 'https://instagram.com'}
                target="_blank" rel="noreferrer"
                className="contact-channel"
              >
                <div className="contact-channel-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-channel-label">Instagram</div>
                  <div className="contact-channel-value">@thebills</div>
                </div>
                <div className="contact-channel-arrow">→</div>
              </a>

              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="contact-channel">
                  <div className="contact-channel-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10c0 5 6 5 6 0"/>
              </svg>
              Chat on WhatsApp
            </button>
          </div>

        </div>
      </section>
    </>
  )
}