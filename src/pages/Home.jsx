import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckSquare } from 'lucide-react';

export default function Home({ products, setCurrentPage }) {
  const [currentHeroImage, setCurrentHeroImage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev % 5) + 1);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  
  const handleProductClick = (productId, event) => {
    event.preventDefault();
    setCurrentPage(`product-${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      {/* ==========================================================================
           HERO SECTION
           ========================================================================== */}
      <section className="hero" style={{ overflow: 'hidden' }}>
        <div className="container hero-grid-2col">
          
          {/* LEFT: Content */}
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badges">
              <span className="badge badge-primary">✓ NAFDAC Certified</span>
              <span className="badge badge-secondary">🚚 Free Doorstep Delivery</span>
            </div>
            <h1 className="hero-title">
              Nigeria's Most <br />
              <span className="accent">Trusted Herbal</span><br />
              Supplement Brand.
            </h1>
            <p className="hero-subtitle">
              Every product is NAFDAC-registered and laboratory verified — what is on the label is <strong>exactly</strong> what is inside the bottle. Order now and pay only when it arrives at your door.
            </p>
            <div className="hero-actions" style={{ marginTop: '8px' }}>
              <a
                href="#catalog-section"
                className="btn btn-primary"
                style={{ padding: '16px 32px', fontSize: '1.05rem' }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop Now <ArrowRight size={18} />
              </a>

            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--panel-border)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>1M+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Per Month</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>36</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>States Covered</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>7</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Premium Products</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>4.9</div>
                  <span style={{ fontSize: '1.1rem' }}>⭐</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Rating</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Doctor (no frame, transparent PNG) + 3 Promise Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
          }}>

            {/* Doctor — automatic slideshow, floats freely */}
            <img
              key={`hero-img-${currentHeroImage}`}
              src={`assets/hero-doctor-${currentHeroImage}.png`}
              alt="Novacare Certified Medical Professional holding Grazer Herbal Detox Tea"
              style={{
                width: '100%',
                maxWidth: '420px',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                objectPosition: 'center bottom',
                filter: 'drop-shadow(0 20px 40px rgba(0, 80, 40, 0.12))',
                animation: 'fadeInUp 0.7s ease forwards',
              }}
            />

            {/* 3 Promise Cards in a row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              width: '100%',
            }}>

              {/* Card 1 — NAFDAC Certified */}
              <div style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--panel-border)',
                borderRadius: '20px',
                padding: '20px 14px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'hsl(145,70%,92%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', margin: '0 auto 12px',
                }}>🧬</div>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                  NAFDAC Certified
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Govt. approved & verified
                </div>
              </div>

              {/* Card 2 — Label = Bottle */}
              <div style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--panel-border)',
                borderRadius: '20px',
                padding: '20px 14px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'hsl(145,70%,92%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', margin: '0 auto 12px',
                }}>🌿</div>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                  Label = Bottle
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  100% purity guaranteed
                </div>
              </div>

              {/* Card 3 — Pay on Delivery */}
              <div style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--panel-border)',
                borderRadius: '20px',
                padding: '20px 14px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'hsl(38,100%,94%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', margin: '0 auto 12px',
                }}>🚚</div>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--secondary)', lineHeight: 1.3, marginBottom: '4px' }}>
                  Pay on Delivery
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Inspect before you pay
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           PRODUCT CATALOG SECTION
           ========================================================================== */}
      <section className="section" id="catalog-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-primary">Premium Catalog</span>
            <h2 className="section-title">Our Certified Supplements</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Select from our certified herbal formulas below. Inspect details, view dosage guides, and order online.
            </p>
          </div>

          {/* Products Grid */}
          <div className="products-grid" id="products-grid">
            {products.map(product => (
              <article className="product-card animate-fade-in-up" key={product.id}>
                <div className="product-badge">{product.category}</div>
                <a 
                  href="#" 
                  onClick={(e) => handleProductClick(product.id, e)}
                  style={{ display: 'block', overflow: 'hidden' }}
                >
                  <div className="product-img-wrapper">
                    <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                  </div>
                </a>
                <div className="product-info">
                  <div className="product-meta">
                    <span className="nafdac-tag">NAFDAC: {product.nafdac || 'Pending'}</span>
                    <span className="reviews-count">⭐ {product.reviews ? product.reviews.length : 2} reviews</span>
                  </div>
                  <a 
                    href="#" 
                    onClick={(e) => handleProductClick(product.id, e)}
                    style={{ color: 'inherit' }}
                  >
                    <h3 className="product-card-title">{product.name}</h3>
                  </a>
                  <ul className="product-benefits">
                    {product.benefits && product.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i}>
                        <CheckSquare size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="product-footer">
                    <div className="product-price">₦{product.price.toLocaleString()}</div>
                    <div className="product-actions">
                      <a 
                        href="#" 
                        onClick={(e) => handleProductClick(product.id, e)}
                        className="btn btn-outline btn-text"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
