import logo from '../assets/billLogo.png'

export default function About({ settings }) {
  return (
    <>
      <style>{`
        .about-root {
          background: #0d0a06;
          padding: 120px 48px;
          position: relative;
          overflow: hidden;
          font-family: 'Barlow', sans-serif;
        }
        .about-top-line {
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.22) 30%, rgba(201,147,58,0.22) 70%, transparent);
        }
        .about-watermark {
          position: absolute;
          bottom: -80px; left: -40px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 280px; line-height: 1;
          color: rgba(201,147,58,0.03); letter-spacing: -0.04em;
          text-transform: uppercase; user-select: none; pointer-events: none;
        }
        .about-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 0.85fr;
          gap: 80px; align-items: center; position: relative; z-index: 1;
        }
        .about-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .about-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .about-eyebrow span {
          font-size: 10px;
          letter-spacing: 0.35em; text-transform: uppercase; color: #c9933a;
        }
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 4vw, 58px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase; margin: 0 0 32px;
        }
        .about-title em { font-style: italic; color: #c9933a; }
        .about-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 18px;
          color: rgba(245,237,224,0.5); line-height: 1.8;
          margin-bottom: 20px; letter-spacing: 0.02em;
        }
        .about-divider {
          width: 48px; height: 1px;
          background: rgba(201,147,58,0.35); margin: 32px 0;
        }
        .about-values {
          display: grid; grid-template-columns: 1fr 1fr; gap: 26px 24px;
        }
        .about-value-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 36px;
          color: rgba(201,147,58,0.22); line-height: 1; margin-bottom: 8px;
        }
        .about-value-title {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: #f5ede0; margin-bottom: 6px;
        }
        .about-value-text {
          font-size: 12px; color: rgba(245,237,224,0.32);
          line-height: 1.6; letter-spacing: 0.02em;
        }
        .about-right { position: relative; }
        .about-img-wrap { position: relative; }

        /* blends seamlessly into the page — no visible box edge */
        .about-img-placeholder {
          width: 100%; aspect-ratio: 3/4;
          background: linear-gradient(135deg, #110d07 0%, #0d0a06 50%, #0a0806 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }

        /* diagonal texture fades out at the edges via mask */
        .about-img-placeholder::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg, transparent, transparent 20px,
            rgba(201,147,58,0.015) 20px, rgba(201,147,58,0.015) 21px
          );
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
        }

        .about-img-logo {
          width: 62%;
          object-fit: contain;
          opacity: 0.07;
          position: relative; z-index: 1;
          user-select: none; pointer-events: none;
          filter: brightness(3) sepia(1) saturate(2) hue-rotate(5deg);
        }

        .about-img-tag {
          position: absolute; bottom: -20px; left: -20px;
          background: #c9933a; padding: 20px 24px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .about-img-tag-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 36px;
          color: #0a0806; line-height: 1; margin-bottom: 4px;
        }
        .about-img-tag-text {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: #0a0806;
        }
        @media (max-width: 900px) {
          .about-root { padding: 80px 24px; }
          .about-top-line { left: 24px; right: 24px; }
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-right { order: -1; }
          .about-values { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <section id="about" className="about-root">
        <div className="about-top-line" />
        <div className="about-watermark">TB</div>
        <div className="about-inner">
          <div>
            <div className="about-eyebrow">
              <div className="about-eyebrow-line" />
              <span>Our Story</span>
            </div>
            <h2 className="about-title">Rooted in <em>Tradition</em></h2>
            <p className="about-text">
              {settings?.about || 'The Bills is a fashion brand born from a deep appreciation of African craftsmanship and global style. Every piece we create carries the soul of our heritage and the ambition of a world-class wardrobe.'}
            </p>
            <p className="about-text">
              We believe clothing is more than fabric — it is identity, culture, and confidence worn on the body.
            </p>
            <div className="about-divider" />
            <div className="about-values">
              {[
                { num: '01', title: 'Craftsmanship', text: 'Every piece handpicked and crafted with intention.' },
                { num: '02', title: 'Heritage', text: 'Rooted in African tradition, dressed for the world.' },
                { num: '03', title: 'Quality', text: 'Only the finest materials make the cut.' },
                { num: '04', title: 'Identity', text: 'Clothing that speaks before you do.' },
              ].map(v => (
                <div key={v.num} className="about-value">
                  <div className="about-value-num">{v.num}</div>
                  <div className="about-value-title">{v.title}</div>
                  <div className="about-value-text">{v.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-right">
            <div className="about-img-wrap">
              <div className="about-img-placeholder">
                <img
                  src={logo}
                  alt="The Bills"
                  className="about-img-logo"
                />
              </div>
              <div className="about-img-tag">
                <div className="about-img-tag-num">2026</div>
                <div className="about-img-tag-text">Est. Accra</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}