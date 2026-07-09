import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, Play, ArrowUpRight } from 'lucide-react';
import { NIGERIAN_STATES, REVIEWS_POOL } from '../data/initialData';
import { dbService } from '../services/dbService';

export default function ProductFunnel({
  productId,
  setCurrentPage,
  addToast,
  onOrderSuccess
}) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showFixedCta, setShowFixedCta] = useState(false);

  // Video playing state
  const [activeVideoId, setActiveVideoId] = useState(null);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [address, setAddress] = useState('');

  // Checkout Success State
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    fetchProductDetails();
    
    const handleScroll = () => {
      const checkoutEl = document.getElementById('checkout-section');
      if (checkoutEl) {
        const checkoutTop = checkoutEl.getBoundingClientRect().top;
        if (checkoutTop < window.innerHeight) {
          setShowFixedCta(false);
          return;
        }
      }
      setShowFixedCta(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [productId]);

  const renderVideo = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return (
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?rel=0`} 
          title="Video testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      );
    }
    return <video src={url} controls style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}></video>;
  };

  const fetchProductDetails = async () => {
    try {
      const prodList = await dbService.getProducts();
      const prod = prodList.find(p => p.id === productId);
      if (prod) {
        setProduct(prod);
        // Get reviews
        const revList = await dbService.getReviews(productId);
        setReviews(revList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p>Loading supplement details...</p>
        <button className="btn btn-outline" onClick={() => setCurrentPage('home')}>
          Back to Shop
        </button>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TESTIMONIAL VIDEO CLICK
  // --------------------------------------------------------------------------
  const playVideo = (videoId) => {
    setActiveVideoId(videoId);
    addToast("Playing customer video testimonial review...");
  };

  // --------------------------------------------------------------------------
  // CHECKOUT SUBMISSION
  // --------------------------------------------------------------------------
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!name || !phone || !state || !lga || !address) {
      addToast("Please fill in all mandatory fields", "error");
      return;
    }

    const phoneReg = /^(?:\+?234|0)[789][01]\d{8}$/;
    if (!phoneReg.test(phone.replace(/\s+/g, ''))) {
      addToast("Please enter a valid Nigerian phone number (e.g. 08031234567)", "error");
      return;
    }

    if (altPhone && !phoneReg.test(altPhone.replace(/\s+/g, ''))) {
      addToast("Please enter a valid alternative phone number", "error");
      return;
    }

    // Generate Order ID (NC-XXXXXX)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderCode = 'NC-';
    for (let i = 0; i < 6; i++) {
      orderCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newOrder = {
      id: orderCode,
      customer_name: name,
      phone: phone,
      alt_phone: altPhone || 'N/A',
      address: address,
      state: state,
      lga: lga,
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }],
      total: product.price,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      await dbService.saveOrder(newOrder);
      setPlacedOrder(newOrder);
      onOrderSuccess(newOrder);
      addToast("Order placed successfully!", "success");
      // Scroll to checkout area
      document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      addToast("Failed to place order. Please try again.", "error");
    }
  };

  // WhatsApp click generator
  const getWhatsAppLink = (order) => {
    const itemsText = order.items.map(item => `• ${item.name} x ${item.quantity} (₦${(item.price * item.quantity).toLocaleString()})`).join('%0A');
    const whatsappNumber = "+2347073488224"; // Actual Novacare agent number from label
    const message = `Hello Novacare Limited,%0A%0AI would like to confirm my order.%0A%0A*Order Details:*%0A---------------------------------%0A*Order ID:* ${order.id}%0A*Name:* ${order.customer_name}%0A*Phone:* ${order.phone}${order.alt_phone !== 'N/A' ? `%0A*Alt Phone:* ${order.alt_phone}` : ''}%0A*State:* ${order.state}%0A*LGA:* ${order.lga}%0A*Delivery Address:* ${order.address}%0A%0A*Items Ordered:*%0A${itemsText}%0A%0A*Total Amount:* ₦${parseFloat(order.total).toLocaleString()}%0A*Payment Method:* Payment on Delivery (POD)%0A---------------------------------%0A%0APlease dispatch my order as soon as possible. Thank you!`;
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const handleResetCheckout = () => {
    setPlacedOrder(null);
    setName('');
    setPhone('');
    setAltPhone('');
    setLga('');
    setAddress('');
  };

  return (
    <main style={{ marginTop: 'var(--header-height)' }}>
      {/* Back button */}
      <div className="container" style={{ paddingTop: '20px' }}>
        <button
          className="btn btn-outline"
          onClick={() => setCurrentPage('home')}
          style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={14} /> Back to Main Shop
        </button>
      </div>

      {/* ==========================================================================
           FUNNEL HERO
           ========================================================================== */}
      <section className="funnel-hero">
        <div className="container funnel-container">
          <div className="hero-visual animate-fade-in">
            <div className="hero-blob"></div>
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '85%', height: 'auto', borderRadius: 'var(--border-radius-xl)', boxShadow: 'var(--shadow-lg)', zIndex: 2 }}
            />
          </div>
          <div className="funnel-product-specs animate-fade-in-up">
            <div className="funnel-badge-row">
              <span className="badge badge-primary">🧬 NAFDAC: {product.nafdac || 'Pending'}</span>
              <span className="badge badge-secondary">⭐ 4.8 Rating ({reviews.length + 12} Reviews)</span>
            </div>
            <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', fontWeight: 900, lineHeight: 1.15 }}>
              {product.name} <br />
              <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {product.name === 'Grazer Herbal Detox Tea' ? 'Flat Belly, Healthy Liver.' : 'Certified Purity.'}
              </span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              {product.tagline}
            </p>

            <div className="funnel-price-box">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                  Exclusive Offer Price
                </span>
                <div className="funnel-price-value">₦{product.price.toLocaleString()}</div>
              </div>
              <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                FREE Doorstep Delivery
              </div>
            </div>

            <ul className="product-benefits" style={{ fontSize: '0.95rem', marginTop: '10px' }}>
              {product.benefits && product.benefits.map((benefit, i) => (
                <li key={i}>✓ {benefit}</li>
              ))}
            </ul>

            <div className="hero-actions" style={{ marginTop: '16px' }}>
              <a
                href="#checkout-section"
                className="btn btn-secondary"
                style={{ padding: '16px 36px', fontSize: '1.1rem' }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Order Now (Pay on Delivery)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           SCIENCE & COMPOSITION
           ========================================================================== */}
      <section className="section" id="science-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-primary">Composition</span>
            <h2 className="section-title">Natural Science & Purity</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              We operate strict laboratory checks so that what is on the label is exactly what is inside the bottle.
            </p>
          </div>

          {/* Grid of Ingredients */}
          <div className="pillars-grid" style={{ marginBottom: '48px' }}>
            {product.ingredients && product.ingredients.slice(0, 3).map((ing, i) => (
              <div className="pillar-card" key={i}>
                <h3 className="pillar-title" style={{ color: 'var(--primary)' }}>{ing.name}</h3>
                <p className="pillar-desc">{ing.purpose}</p>
              </div>
            ))}
          </div>

          {/* If there are more ingredients, display as list */}
          {product.ingredients && product.ingredients.length > 3 && (
            <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 'var(--border-radius-lg)', padding: '30px', marginBottom: '48px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Complete Botanicals Breakdown</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {product.ingredients.slice(3).map((ing, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <strong style={{ color: 'var(--primary)' }}>{ing.name}</strong>: {ing.purpose}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage & Directions */}
          <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 'var(--border-radius-lg)', padding: '40px', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div>
              <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', fontWeight: 700 }}>📋 Usage Directions</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {product.directions || 'Take as recommended by your health practitioner.'}
              </p>
            </div>
            <div style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: '20px' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--danger)', fontWeight: 700 }}>⚠️ Safety Warnings & Diet</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {product.warnings || 'Keep out of the reach of children.'}
              </p>
              {product.id === 'grazer' && (
                <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid var(--warning)', borderRadius: '4px', fontSize: '0.85rem' }}>
                  <strong>Dietary Guideline:</strong> For visible results in 14 days, strictly limit junk food, late-night eating, and alcohol.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           DYNAMIC TESTIMONIAL VIDEOS
           ========================================================================== */}
      {product.testimonial_videos && product.testimonial_videos.length > 0 && (
        <section className="section" id="testimonials-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="badge badge-secondary">Success Stories</span>
              <h2 className="section-title">Verified Video Reviews</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Watch how our supplements have restored health and wellness.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {product.testimonial_videos.map((vidUrl, index) => (
                <div key={index} className="video-embed-container">
                  {renderVideo(vidUrl)}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================================
           PINTEREST STYLE GALLERY
           ========================================================================== */}
      {product.gallery_images && product.gallery_images.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--panel-bg)', borderTop: '1px solid var(--panel-border)', borderBottom: '1px solid var(--panel-border)' }}>
          <div className="container">
            <div className="section-header text-center">
              <span className="badge badge-primary">Gallery</span>
              <h2 className="section-title">Real Results</h2>
            </div>
            <div className="masonry-grid">
              {product.gallery_images.map((imgUrl, index) => (
                <div key={index} className="masonry-item">
                  <img src={imgUrl} alt={`Product Gallery ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================================
           FAQs SECTION
           ========================================================================== */}
      <section className="faq-section" id="faq-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-primary">Q&A</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}>
                Is this product certified by NAFDAC?
                <span className="faq-icon-arrow">▼</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: activeFaq === 0 ? '100px' : '0' }}>
                <div className="faq-answer-inner">
                  Yes, {product.name} is fully registered with NAFDAC under number **{product.nafdac}**. The active compositions and purity are regularly audited for safety.
                </div>
              </div>
            </div>

            <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}>
                How do I make payment and receive delivery?
                <span class="faq-icon-arrow">▼</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: activeFaq === 1 ? '100px' : '0' }}>
                <div className="faq-answer-inner">
                  We offer **Payment on Delivery (POD)** across all 36 states. You only pay (via cash or bank transfer) when the courier rider delivers the supplement directly to your doorstep.
                </div>
              </div>
            </div>

            <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}>
                What is your refund policy?
                <span class="faq-icon-arrow">▼</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: activeFaq === 2 ? '100px' : '0' }}>
                <div className="faq-answer-inner">
                  We back this product with a **100% 30-Day Money-Back Guarantee**. If you use the supplement as recommended for 30 days without seeing visible results, we will refund you in full.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           LEAD MAGNET / CHECKOUT
           ========================================================================== */}
      {product.lead_magnet && product.lead_magnet.title && (
        <section className="container" style={{ marginTop: '40px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, hsl(38,100%,94%), hsl(38,100%,88%))', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '30px', 
            color: 'var(--text-main)', 
            border: '1px dashed var(--secondary)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'block' }}>🎁 <strong>BONUS OFFER</strong></span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--secondary)', marginBottom: '12px' }}>{product.lead_magnet.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{product.lead_magnet.description}</p>
          </div>
        </section>
      )}

      {/* ==========================================================================
           SECURE CHECKOUT FORM
           ========================================================================== */}
      <section className="section" id="checkout-section" style={{ backgroundColor: 'rgba(0, 0, 0, 0.01)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-secondary">Order Form</span>
            <h2 className="section-title">Secure Doorstep Checkout</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Place your order for {product.name}. Delivery takes 24 to 72 hours with free cash on delivery.
            </p>
          </div>

          {placedOrder ? (
            <div className="success-card">
              <div className="success-icon-wrapper">✓</div>
              <h3 className="success-title">Order Received Successfully!</h3>
              <p>Thank you for shopping with Novacare. Your order is registered and will be dispatched shortly.</p>

              <div style={{ margin: '12px 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  YOUR UNIQUE ORDER ID
                </span>
                <div className="order-number">{placedOrder.id}</div>
              </div>

              <div style={{ backgroundColor: 'var(--primary-glow)', borderRadius: 'var(--border-radius-md)', padding: '18px', textAlign: 'left', fontSize: '0.9rem', border: '1px solid var(--panel-border)' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>⚡ Speedy Dispatch Request</strong>
                To confirm your shipping details immediately and expedite package transit, please tap the button below to text our dispatch agent directly on WhatsApp.
              </div>

              <a
                href={getWhatsAppLink(placedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="success-whatsapp-cta"
              >
                Confirm Order via WhatsApp <ArrowUpRight size={18} />
              </a>

              <button className="btn btn-primary" onClick={handleResetCheckout} style={{ marginTop: '12px' }}>
                Place Another Order
              </button>
            </div>
          ) : (
            <div className="checkout-wrapper">
              {/* Checkout Form */}
              <div className="checkout-card">
                <h3 className="checkout-section-title">
                  <span>📋</span> Delivery Information
                </h3>
                <form onSubmit={handleCheckoutSubmit}>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="checkout-name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder="e.g. Abubakar Bello"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="checkout-phone" className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                        placeholder="e.g. 08031234567"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="checkout-alt-phone" className="form-label">Alternative Phone</label>
                      <input
                        type="tel"
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        className="form-input"
                        placeholder="Alternative number for courier contact"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="checkout-state" class="form-label">State *</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="" disabled>Select your delivery state</option>
                        {NIGERIAN_STATES.map(s => <option value={s} key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="checkout-lga" class="form-label">LGA / Town *</label>
                      <input
                        type="text"
                        value={lga}
                        onChange={(e) => setLga(e.target.value)}
                        className="form-input"
                        placeholder="Local Government Area or Town"
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="checkout-address" class="form-label">Delivery Address *</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                        rows="3"
                        placeholder="Street Number, Building Name, and detailed landmarks"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-secondary btn-block" style={{ marginTop: '16px' }}>
                    Confirm & Place Order (Pay on Delivery)
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="checkout-summary-card">
                <h3 className="checkout-section-title">
                  <span>🛒</span> Order Summary
                </h3>
                <div id="checkout-summary-container">
                  <div className="summary-items-list">
                    <div className="summary-item">
                      <span>{product.name} <strong style={{ color: 'var(--primary)' }}>x1</strong></span>
                      <strong>₦{product.price.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-item">
                    <span>Shipping (Doorstep)</span>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-total">
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="payment-badge-pod">
                    <div className="pod-icon">🛡️</div>
                    <div className="pod-text">
                      <h4>Cash / Transfer on Delivery</h4>
                      <p>No prepayment needed. Pay safely to the logistics rider when products arrive at your doorstep.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================================================
           FIXED BOTTOM CTA
           ========================================================================== */}
      <div className={`fixed-bottom-cta ${showFixedCta ? 'visible' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Exclusive Offer</span>
          <span className="fixed-bottom-cta-price">₦{product.price.toLocaleString()}</span>
        </div>
        <button 
          className="btn btn-secondary fixed-bottom-cta-btn"
          onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Order Now (Pay on Delivery)
        </button>
      </div>
    </main>
  );
}
