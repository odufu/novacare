import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function Home({ products, setCurrentPage }) {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    dbService.getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  // Restart slideshow whenever images change
  useEffect(() => {
    if (!settings) return;
    const images = parseHeroImages(settings.hero_images);
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [settings]);

  const parseHeroImages = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["assets/hero-doctor-1.png"];
    } catch {
      return ["assets/hero-doctor-1.png"];
    }
  };

  const handleProductClick = (productId, event) => {
    event.preventDefault();
    setCurrentPage(`product-${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show nothing until settings load (prevents flash)
  if (!settings) return null;

  const heroImages = parseHeroImages(settings.hero_images);

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
              <span className="badge badge-primary">{settings.hero_badge1}</span>
              <span className="badge badge-secondary">{settings.hero_badge2}</span>
            </div>
            <h1 className="hero-title">
              {settings.hero_headline}
            </h1>
            <p className="hero-subtitle">
              {settings.hero_subheadline}
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
                {settings.hero_cta_text} <ArrowRight size={18} />
              </a>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--panel-border)', flexWrap: 'wrap' }}>
              {[
                { val: settings.hero_stat1_value, label: settings.hero_stat1_label, color: 'var(--primary)' },
                { val: settings.hero_stat2_value, label: settings.hero_stat2_label, color: 'var(--primary)' },
                { val: settings.hero_stat3_value, label: settings.hero_stat3_label, color: 'var(--primary)' },
                { val: settings.hero_stat4_value, label: settings.hero_stat4_label, color: 'var(--secondary)', star: true },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.val}</div>
                    {s.star && <span style={{ fontSize: '1.1rem' }}>⭐</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
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

            {/* Doctor — automatic slideshow */}
            <img
              key={`hero-img-${heroImageIndex}`}
              src={heroImages[heroImageIndex]}
              alt="Novacare Certified Medical Professional"
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
              {[
                { icon: settings.hero_card1_icon, title: settings.hero_card1_title, desc: settings.hero_card1_desc, bg: 'hsl(145,70%,92%)', color: 'var(--primary)' },
                { icon: settings.hero_card2_icon, title: settings.hero_card2_title, desc: settings.hero_card2_desc, bg: 'hsl(145,70%,92%)', color: 'var(--primary)' },
                { icon: settings.hero_card3_icon, title: settings.hero_card3_title, desc: settings.hero_card3_desc, bg: 'hsl(38,100%,94%)', color: 'var(--secondary)' },
              ].map((card, i) => (
                <div key={i} style={{
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
                    background: card.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', margin: '0 auto 12px',
                  }}>{card.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: card.color, lineHeight: 1.3, marginBottom: '4px' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {card.desc}
                  </div>
                </div>
              ))}
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
