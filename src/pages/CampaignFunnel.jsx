import React, { useState, useEffect } from 'react';
import { CheckCircle, Truck, ShieldCheck, ArrowLeft, Loader, CreditCard } from 'lucide-react';
import { dbService } from '../services/dbService';
import { NIGERIAN_STATES } from '../data/initialData';

export default function CampaignFunnel({ campaignId, setCurrentPage, addToast, onOrderSuccess }) {
  const [campaign, setCampaign] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);

  useEffect(() => {
    loadCampaignData();
  }, [campaignId]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const campaigns = await dbService.getCampaigns();
      const foundCampaign = campaigns.find(c => c.id === campaignId);
      
      if (!foundCampaign) {
        setLoading(false);
        return;
      }

      setCampaign(foundCampaign);

      const products = await dbService.getProducts();
      const foundProduct = products.find(p => p.id === foundCampaign.productId);
      setProduct(foundProduct);
    } catch (e) {
      console.error(e);
      addToast("Failed to load campaign information", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !state || !lga || !address) {
      addToast("Please fill all required delivery details", "error");
      return;
    }

    if (!product) {
      addToast("Target product not found", "error");
      return;
    }

    setSubmitting(true);
    const orderId = 'NC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const orderTotal = product.price * quantity;

    const payload = {
      id: orderId,
      customer_name: name,
      phone,
      alt_phone: altPhone,
      address,
      state,
      lga,
      items: [{ id: product.id, name: product.name, price: product.price, quantity }],
      total: orderTotal,
      status: 'Pending',
      campaignId: campaign.id
    };

    try {
      const created = await dbService.saveOrder(payload);
      setOrderCreated(created);
      addToast("Order placed successfully!", "success");
      if (onOrderSuccess) onOrderSuccess(created);
    } catch (err) {
      addToast(err.message || "Failed to submit order request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading promotional campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign || !product) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-color)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Offer Expired</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center', maxWidth: '400px' }}>
          This special promotional link is either inactive, expired, or has been archived by the site administrator.
        </p>
        <button className="btn btn-primary" onClick={() => setCurrentPage('home')}>
          Return to Home Store
        </button>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div style={{ minHeight: '90vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="animate-fade-in" style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '24px' }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Order Submitted!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Thank you <strong style={{ color: 'var(--text-main)' }}>{name}</strong>! We have received your order request and our team will contact you shortly to verify delivery.
          </p>

          <div style={{
            background: 'var(--bg-subtle, rgba(0,0,0,0.02))',
            border: '1px solid var(--panel-border)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{orderCreated.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Product:</span>
              <strong style={{ color: 'var(--text-main)' }}>{product.name} (x{quantity})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Payable:</span>
              <strong style={{ color: 'var(--success)', fontSize: '1.05rem' }}>₦{orderCreated.total.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <strong style={{ color: 'var(--primary)' }}>Payment on Delivery</strong>
            </div>
          </div>

          <button className="btn btn-primary btn-block" onClick={() => setCurrentPage('home')}>
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '40px 16px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setCurrentPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Store
        </button>

        {/* Promo Header */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
          borderRadius: '24px',
          padding: '40px 24px',
          color: '#fff',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '32px'
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Exclusive Campaign Promotion
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '12px', marginBottom: '8px', lineHeight: 1.2 }}>
            {campaign.title || product.name}
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>
            {campaign.description || product.tagline}
          </p>
        </div>

        {/* Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Product Summary */}
          <div style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
              Product Information
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--panel-border)' }} 
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{product.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{product.category}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₦{(product.price * 1.5).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                {product.description}
              </p>
            )}

            {product.benefits && product.benefits.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.benefits.slice(0, 4).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.88rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Checkout Form */}
          <div style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
              Shipping & Delivery Form
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Your Full Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="form-input" 
                  placeholder="e.g. John Obi" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Active Phone Number *</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="form-input" 
                  placeholder="e.g. 08012345678" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Alternate Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  value={altPhone} 
                  onChange={(e) => setAltPhone(e.target.value)} 
                  className="form-input" 
                  placeholder="In case your main line is unreachable" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>State *</label>
                  <select 
                    value={state} 
                    onChange={(e) => setState(e.target.value)} 
                    className="form-input" 
                    required
                  >
                    <option value="">Select</option>
                    {NIGERIAN_STATES.map(s => <option value={s} key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>LGA *</label>
                  <input 
                    type="text" 
                    value={lga} 
                    onChange={(e) => setLga(e.target.value)} 
                    className="form-input" 
                    placeholder="Local Govt Area" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Full Delivery Address *</label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="form-input" 
                  rows="3" 
                  placeholder="Provide complete street, building, house number details..." 
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle, rgba(0,0,0,0.02))', padding: '14px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--panel-border)' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantity</span>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    {[1, 2, 3, 4].map(q => (
                      <button 
                        key={q} 
                        type="button" 
                        onClick={() => setQuantity(q)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--panel-border)',
                          background: quantity === q ? 'var(--primary)' : 'var(--panel-bg)',
                          color: quantity === q ? '#fff' : 'var(--text-main)',
                          cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem'
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Payable</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--success)', marginTop: '4px' }}>
                    ₦{(product.price * quantity).toLocaleString()}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={submitting}
                style={{ height: '48px', fontWeight: 700 }}
              >
                {submitting ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  "Place Order (Pay on Delivery)"
                )}
              </button>
            </form>

            {/* Security Seals */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '24px', borderTop: '1px solid var(--panel-border)', paddingTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Truck size={18} style={{ color: 'var(--primary)' }} />
                <span>Free Delivery</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                <span>Pay on Delivery</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
