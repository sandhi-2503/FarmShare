import React from 'react';
import { Tractor, Sparkles, Target, Heart, Award, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Our Mission & Impact
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.4rem', marginBottom: '1rem' }}>
            Empowering Indian Agriculture Through Smart Sharing
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            FarmShare AI was built to solve one of the greatest challenges in smallholder farming: modern machinery is indispensable for high yields, yet too capital-intensive for individual ownership.
          </p>
        </div>

        {/* Story Section */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '3rem',
            backgroundColor: '#ffffff'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            The FarmShare AI Vision
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            In rural farming hubs, expensive tractors and harvesters sit idle for nearly 65% of the annual agricultural calendar once an owner completes their sowing or harvesting. Meanwhile, adjacent farmers struggle with manual labor or exorbitant third-party broker commissions.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
            FarmShare AI connects farmers directly in a peer-to-peer equipment-sharing network powered by smart machine recommendations, live availability tracking, and zero middleman markups.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Precision Access</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Enabling every farmer to access high-horsepower 4WD tractors and automated seeders for their exact field schedule.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Matching Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Rule-based and machine-learning recommendation models matching machinery by proximity, soil type, and crop cycle.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Rural Prosperity</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Boosting farmer profitability by reducing capital debt while maximizing equipment utilization and returns.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          className="card"
          style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: '#ffffff'
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Be Part of India's Agritech Revolution
          </h2>
          <p style={{ color: '#dcfce7', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join thousands of farming families who share machinery, cut production costs, and grow together.
          </p>
          <Link to="/signup" className="btn btn-secondary btn-lg">
            Join FarmShare AI Today
          </Link>
        </div>
      </div>
    </div>
  );
};
