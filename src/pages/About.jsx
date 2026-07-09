import React, { useEffect } from 'react';
import { ShieldCheck, Truck, Users, PhoneCall, TrendingUp, Building } from 'lucide-react';

export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="animate-fade-in-up" style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section className="section" style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--panel-border)', paddingTop: '100px' }}>
        <div className="container text-center">
          <span className="badge badge-primary">Who We Are</span>
          <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '20px' }}>About Novacare Limited</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Novacare is a premier Quality Marketer of NAFDAC-certified herbal supplements. 
            Our mission is to bridge the gap between ancient herbal remedies and modern, transparent, and trustworthy distribution. 
            We guarantee purity, safety, and a seamless customer experience across all 36 states of Nigeria.
          </p>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Our Organizational Structure</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              The dedicated teams that make our nationwide promise a reality.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '40px'
          }}>

            {/* Core Leadership / Management */}
            <div className="pillar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(145,70%,92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                <Building size={28} />
              </div>
              <h3 className="pillar-title">Executive Management</h3>
              <p className="pillar-desc">
                Governing the strategic direction, ensuring strict regulatory compliance (NAFDAC), and maintaining our core philosophy of "Label Matches Bottle".
              </p>
            </div>

            {/* Logistics */}
            <div className="pillar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(38,100%,92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--secondary)' }}>
                <Truck size={28} />
              </div>
              <h3 className="pillar-title">Nationwide Logistics</h3>
              <p className="pillar-desc">
                The backbone of our Pay-On-Delivery promise. Operating across all 36 states to ensure swift, secure, and trackable deliveries straight to our customers' doorsteps.
              </p>
            </div>

            {/* Sales & Marketers */}
            <div className="pillar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(145,70%,92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                <TrendingUp size={28} />
              </div>
              <h3 className="pillar-title">Sales & Marketers</h3>
              <p className="pillar-desc">
                Our dynamic field experts who educate the public on herbal wellness, expanding our reach and ensuring that over 1 million products are distributed monthly.
              </p>
            </div>

            {/* Customer Care */}
            <div className="pillar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(145,70%,92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                <PhoneCall size={28} />
              </div>
              <h3 className="pillar-title">Customer Care</h3>
              <p className="pillar-desc">
                A dedicated 24/7 support team providing post-purchase guidance, managing the 30-day guarantee process, and answering dosage or health-related inquiries.
              </p>
            </div>

            {/* Quality Assurance */}
            <div className="pillar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(145,70%,92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 className="pillar-title">Quality Assurance</h3>
              <p className="pillar-desc">
                The critical oversight team that audits inventory from our manufacturing partners to guarantee pure, unadulterated herbal formulas.
              </p>
            </div>

            {/* Operations */}
            <div className="pillar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(145,70%,92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                <Users size={28} />
              </div>
              <h3 className="pillar-title">Internal Operations</h3>
              <p className="pillar-desc">
                Ensuring seamless day-to-day business flow, from inventory management to coordinating between our marketing funnels and field dispatchers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="container" style={{ marginTop: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, hsl(145,70%,25%), hsl(145,80%,15%))', 
          borderRadius: '24px', 
          padding: '40px', 
          color: 'white', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>A Commitment to Excellence</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9, lineHeight: 1.6 }}>
            Every single department at Novacare operates under one unified goal: 
            delivering premium, verified herbal health solutions without compromise. 
            Your health is our ultimate priority.
          </p>
        </div>
      </section>

    </main>
  );
}
