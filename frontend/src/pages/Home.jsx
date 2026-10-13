import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/equipment/SearchBar';
import { EquipmentGrid } from '../components/equipment/EquipmentGrid';
import { RentalRequestModal } from '../components/rental/RentalRequestModal';
import { equipmentService } from '../services/equipmentService';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  Sparkles,
  Users,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  ArrowRight,
  Leaf,
  Layers
} from 'lucide-react';

export const Home = () => {
  const { isOwner } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ farmers: 500, machines: 250, rentals: 1000, locations: 50 });
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [recommendedEquipment, setRecommendedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipmentForRent, setSelectedEquipmentForRent] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [statsRes, equipmentRes, recRes] = await Promise.all([
          equipmentService.getGlobalStats().catch(() => null),
          equipmentService.getAll({ limit: 6, sort: 'popularity' }).catch(() => null),
          equipmentService.getRecommendations().catch(() => null)
        ]);

        if (statsRes?.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (equipmentRes?.success && equipmentRes.equipment) {
          setFeaturedEquipment(equipmentRes.equipment);
        }
        if (recRes?.success && recRes.recommendations) {
          setRecommendedEquipment(recRes.recommendations.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #14532d 100%)',
          color: '#ffffff',
          padding: '5rem 0 6rem',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Decorative Farm Graphic Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            {/* Tag / Badge */}
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#86efac',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Sparkles size={15} style={{ color: '#fbbf24' }} />
                India's Next-Gen Agricultural Equipment Sharing Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}
            >
              Smart Equipment Sharing for Modern Farmers
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: '#cbd5e1',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '720px',
                margin: '0 auto 2.5rem'
              }}
            >
              "Access the agricultural machinery you need, when you need it — or earn more by sharing equipment you already own."
            </p>

            {/* Search Bar in Hero */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <SearchBar onSearch={handleSearch} placeholder="Search tractors, harvesters, rotavators, sprayers, city..." />
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <Link to="/browse" className="btn btn-primary btn-lg">
                Browse Equipment <ArrowRight size={18} />
              </Link>
              <Link
                to={isOwner ? '/dashboard/machinery/add' : '/signup?role=owner'}
                className="btn btn-secondary btn-lg"
              >
                List Your Equipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section (Real DB Stats) */}
      <section
        style={{
          marginTop: '-2rem',
          position: 'relative',
          zIndex: 10,
          marginBottom: '4rem'
        }}
      >
        <div className="container">
          <div
            className="card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              padding: '2rem',
              gap: '2rem',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {stats.farmers}+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>
                Verified Farmers
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {stats.machines}+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>
                Listed Machines
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {stats.rentals}+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>
                Successful Rentals
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {stats.locations}+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>
                Farming Hubs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Smart Recommendation Spotlight */}
      {recommendedEquipment.length > 0 && (
        <section style={{ padding: '2rem 0 4rem' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Sparkles size={16} /> AI Smart Matching
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  Recommended For Your Farm
                </h2>
              </div>
              <Link to="/browse" className="btn btn-secondary btn-sm">
                View All Machinery <ArrowRight size={14} />
              </Link>
            </div>

            <EquipmentGrid
              equipment={recommendedEquipment}
              loading={loading}
              onRentClick={(eq) => setSelectedEquipmentForRent(eq)}
            />
          </div>
        </section>
      )}

      {/* 4. How It Works Section (Section 5) */}
      <section
        style={{
          padding: '5rem 0',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple & Transparent
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', marginBottom: '0.75rem' }}>
              How FarmShare AI Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Rent verified agricultural machinery in four seamless steps or start earning from your idle tractors.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Step 1 */}
            <div
              className="card"
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 800
                }}
              >
                <Users size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Step 01
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0 0.65rem' }}>
                Create Your Account
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Sign up as an equipment owner, renter, or both with fast verification.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card"
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <Tractor size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Step 02
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0 0.65rem' }}>
                Find or List Equipment
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Browse verified tractors and harvesters nearby or list your own machinery with custom pricing.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card"
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CalendarCheck size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Step 03
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0 0.65rem' }}>
                Send a Rental Request
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Select daily or hourly schedule with automatic price calculation and submit instantly.
              </p>
            </div>

            {/* Step 4 */}
            <div
              className="card"
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Step 04
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0 0.65rem' }}>
                Rent & Get Job Done
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Connect directly on WhatsApp, execute field operations efficiently, and grow farm yields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Equipment Showcase */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Listings
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.3rem' }}>
                Popular Farm Machinery
              </h2>
            </div>
            <Link to="/browse" className="btn btn-primary">
              Explore All Equipment <ArrowRight size={16} />
            </Link>
          </div>

          <EquipmentGrid
            equipment={featuredEquipment}
            loading={loading}
            onRentClick={(eq) => setSelectedEquipmentForRent(eq)}
          />
        </div>
      </section>

      {/* 6. Farmer Trust & Value Proposition */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '5rem 0',
          borderTop: '1px solid var(--border)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Built for Rural Communities
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0 1.25rem', lineHeight: 1.25 }}>
                Why Indian Farmers Trust FarmShare AI
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                High-capacity machinery can cost ₹15 Lakhs to ₹40 Lakhs to purchase. FarmShare AI democratizes mechanization by allowing smallholders to rent equipment on-demand while enabling owners to generate up to ₹1.5 Lakhs/month in extra income.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Zero Overlapping Bookings</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Our automated conflict detection ensures machinery is never double-booked.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Zap size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Instant WhatsApp Direct Connect</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Reach equipment owners via 1-click WhatsApp messaging upon rental approval.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <TrendingUp size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Dynamic AI Recommendations</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Smart machine matching based on proximity, soil operations, and crop seasons.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"
                alt="Agricultural Tractor"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-xl)',
                  aspectRatio: '4/3',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          color: '#ffffff',
          padding: '4.5rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Transform Your Farming Operations?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#dcfce7', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of progressive farmers across India. Rent equipment at transparent rates or list your idle machinery today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-secondary btn-lg">
              Get Started Free
            </Link>
            <Link to="/browse" className="btn btn-outline-primary btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>

      {/* Rental Modal */}
      {selectedEquipmentForRent && (
        <RentalRequestModal
          isOpen={!!selectedEquipmentForRent}
          equipment={selectedEquipmentForRent}
          onClose={() => setSelectedEquipmentForRent(null)}
          onSuccess={() => {
            navigate('/dashboard/rentals');
          }}
        />
      )}
    </div>
  );
};
