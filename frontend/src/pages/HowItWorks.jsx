import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  UserCheck,
  Calendar,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MessageCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('renter');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the rental pricing calculation work?',
      a: 'Rental costs are calculated based on the owner’s hourly or daily rates multiplied by your requested duration. A refundable security deposit is held to ensure machinery safety and refunded upon successful completion.'
    },
    {
      q: 'How do I contact the equipment owner?',
      a: 'Once you submit a rental request, the owner is immediately notified. You can reach them directly via one-click WhatsApp messaging or phone call to finalize pickup and field schedules.'
    },
    {
      q: 'What happens if the equipment is already booked for my dates?',
      a: 'FarmShare AI includes real-time booking conflict prevention. If a tractor or harvester is approved for overlapping dates, our system immediately alerts you and suggests alternative available machines nearby.'
    },
    {
      q: 'Can I both own equipment and rent other machinery?',
      a: 'Yes! Select the "Owner & Renter" role during signup or in your settings. You can list your tractors during idle weeks and rent specialized harvesters during your peak crop season.'
    }
  ];

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Empowering Modern Agriculture
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.4rem', marginBottom: '0.75rem' }}>
            How FarmShare AI Works
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Whether you want to rent machinery for your farm or monetize your idle equipment, our AI-powered platform makes agricultural sharing simple, secure, and profitable.
          </p>

          {/* Role Toggle Switch */}
          <div
            style={{
              display: 'inline-flex',
              padding: '0.35rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              marginTop: '2rem'
            }}
          >
            <button
              onClick={() => setActiveTab('renter')}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'renter' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'renter' ? '#ffffff' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              For Farmers Renting Equipment
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'owner' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'owner' ? '#ffffff' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              For Equipment Owners
            </button>
          </div>
        </div>

        {/* Steps Content */}
        {activeTab === 'renter' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Search & Filter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Search high-grade tractors, combine harvesters, seeders, or rotavators by category, city, or daily budget.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Review Details</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Check specifications, horsepower, fuel policies, verified owner ratings, and transparent hourly/daily rates.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Send Request</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Pick start and end dates. The system auto-calculates total costs and checks for zero booking conflicts.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                4
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Connect & Farm</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Upon owner approval, connect via WhatsApp, receive the equipment, and complete your farming operations.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>List Machinery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Upload photos, specify model, brand, horsepower, and location in under 2 minutes.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Set Your Rates</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Choose hourly and daily rental prices, security deposit amount, and fuel policies that fit your preferences.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Accept Bookings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Receive instant notifications when farmers request your machinery. Accept or decline with one tap.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>
                4
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Earn Steady Income</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Monetize your tractors between sowing and harvest cycles, earning substantial recurring revenue.
              </p>
            </div>
          </div>
        )}

        {/* FAQ Accordion Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-muted)' }}>Everything you need to know about FarmShare AI</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
