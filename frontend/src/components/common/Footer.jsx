import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Sparkles, Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '4.5rem 0 2rem',
        borderTop: '1px solid #1e293b',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Column 1: Brand & Tagline */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Tractor size={22} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                FARM SHARE <span style={{ color: '#4ade80' }}>AI</span>
                <Sparkles size={14} style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.925rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}
            >
              "Empowering farmers through smarter equipment sharing."
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'all 0.2s'
                }}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'all 0.2s'
                }}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'all 0.2s'
                }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em'
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  Browse Equipment
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Equipment Categories */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em'
              }}
            >
              Top Machinery
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/browse?category=Tractor" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  High-HP Tractors
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Harvester" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Combine Harvesters
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Rotavator" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Rotary Tillers & Rotavators
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Sprayer" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Boom & Orchard Sprayers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em'
              }}
            >
              Contact Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <MapPin size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
                <span>Agricultural Hub, New Delhi, India</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <Phone size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
                <span>+91 1800-FARM-SHARE</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <Mail size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
                <span>support@farmshare.ai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748b'
          }}
        >
          <p>© 2026 FarmShare AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
