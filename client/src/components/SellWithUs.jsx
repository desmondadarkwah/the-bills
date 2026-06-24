export default function SellWithUs() {
  return (
    <>
      <style>{`
        .swu-root {
          background: #0d0a06;
          padding: 100px 48px;
          position: relative;
          overflow: hidden;
        }
        .swu-root::before {
          content: '';
          position: absolute; top: 0; left: 48px; right: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,147,58,0.2) 30%, rgba(201,147,58,0.2) 70%, transparent);
        }
        .swu-watermark {
          position: absolute; bottom: -60px; right: -20px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 220px; line-height: 1;
          color: rgba(201,147,58,0.03); letter-spacing: -0.04em;
          text-transform: uppercase; user-select: none; pointer-events: none;
        }
        .swu-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center; position: relative; z-index: 1;
        }
        .swu-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .swu-eyebrow-line { width: 32px; height: 1px; background: #c9933a; }
        .swu-eyebrow span {
          font-family: 'Barlow', sans-serif; font-size: 10px;
          letter-spacing: 0.35em; text-transform: uppercase; color: #c9933a;
        }
        .swu-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(36px, 4vw, 58px);
          line-height: 0.95; letter-spacing: -0.01em;
          color: #f5ede0; text-transform: uppercase; margin: 0 0 24px;
        }
        .swu-title em { font-style: italic; color: #c9933a; }
        .swu-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 17px;
          color: rgba(245,237,224,0.45); line-height: 1.8;
          margin-bottom: 36px;
        }
        .swu-btn {
          display: inline-block;
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          padding: 16px 40px;
          background: #c9933a; color: #0a0806;
          text-decoration: none; transition: opacity 0.2s;
        }
        .swu-btn:hover { opacity: 0.85; }
        .swu-btn-ghost {
          display: inline-block; margin-left: 16px;
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.28em; text-transform: uppercase;
          padding: 16px 40px;
          background: transparent; color: rgba(245,237,224,0.5);
          border: 1px solid rgba(201,147,58,0.25);
          text-decoration: none; transition: all 0.2s;
        }
        .swu-btn-ghost:hover { border-color: #c9933a; color: #f5ede0; }
        .swu-perks {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
        }
        .swu-perk {}
        .swu-perk-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 32px;
          color: rgba(201,147,58,0.2); line-height: 1; margin-bottom: 8px;
        }
        .swu-perk-title {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #f5ede0; margin-bottom: 6px;
        }
        .swu-perk-text {
          font-size: 12px; color: rgba(245,237,224,0.35); line-height: 1.6;
        }
        @media (max-width: 900px) {
          .swu-root { padding: 80px 24px; }
          .swu-inner { grid-template-columns: 1fr; gap: 48px; }
          .swu-btn-ghost { margin-left: 0; margin-top: 12px; display: block; text-align: center; }
          .swu-btn { display: block; text-align: center; }
        }
      `}</style>

      <section className="swu-root">
        <div className="swu-watermark">TB</div>
        <div className="swu-inner">
          <div>
            <div className="swu-eyebrow">
              <div className="swu-eyebrow-line" />
              <span>For Vendors</span>
            </div>
            <h2 className="swu-title">Sell With <em>Us</em></h2>
            <p className="swu-text">
              Are you a fashion designer, tailor, or clothing brand? Join The Bills marketplace and showcase your pieces to thousands of style-conscious customers across Ghana and beyond.
            </p>
            <div>
              <a href="/vendor/register" className="swu-btn">Open Your Shop</a>
              <a href="/vendor/login" className="swu-btn-ghost">Sign In</a>
            </div>
          </div>

          <div className="swu-perks">
            {[
              { num:'01', title:'Your Own Storefront', text:'Get a dedicated shop page with all your products in one place.' },
              { num:'02', title:'Direct Customer Contact', text:'Customers enquire directly through your WhatsApp — no middleman.' },
              { num:'03', title:'Real Analytics', text:'Track views and clicks on every product to understand what sells.' },
              { num:'04', title:'Verified Badge', text:'Build trust with a verified shop badge once approved by our team.' },
            ].map(p => (
              <div key={p.num} className="swu-perk">
                <div className="swu-perk-num">{p.num}</div>
                <div className="swu-perk-title">{p.title}</div>
                <div className="swu-perk-text">{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}