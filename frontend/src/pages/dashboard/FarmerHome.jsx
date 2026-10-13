import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { equipmentService } from '../../services/equipmentService';
import { rentalService } from '../../services/rentalService';
import { SearchBar } from '../../components/equipment/SearchBar';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { RentalRequestModal } from '../../components/rental/RentalRequestModal';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import {
  Tractor,
  Sparkles,
  CalendarCheck,
  Inbox,
  CheckCircle,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tractor',
  'Harvester',
  'Cultivator',
  'Plough',
  'Seeder',
  'Sprayer',
  'Rotavator'
];

export const FarmerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [nearbyEquipment, setNearbyEquipment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedForRent, setSelectedForRent] = useState(null);

  useEffect(() => {
    const loadFarmerData = async () => {
      try {
        setLoading(true);
        const [statsRes, recRes, nearbyRes] = await Promise.all([
          rentalService.getDashboardStats().catch(() => null),
          equipmentService.getRecommendations().catch(() => null),
          equipmentService.getAll({ limit: 6, available: true }).catch(() => null)
        ]);

        if (statsRes?.success) setStats(statsRes.renterStats);
        if (recRes?.success) setRecommendations(recRes.recommendations || []);
        if (nearbyRes?.success) setNearbyEquipment(nearbyRes.equipment || []);
      } catch (err) {
        console.error('Farmer dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFarmerData();
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/farmer/browse?search=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    navigate(`/farmer/browse?category=${cat === 'All' ? '' : cat}`);
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading Farmer Dashboard..." />;
  }

  const renterStats = stats || {
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    totalSpent: 0
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with Search */}
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
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Farmer Operations Hub
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Good day, {user?.name}! 🌾
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            What agricultural machinery do you need for your fields today?
          </p>
        </div>

        <Link to="/farmer/browse" className="btn btn-primary btn-sm">
          <Compass size={16} /> Explore All Equipment
        </Link>
      </div>

      {/* Hero Search Box */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          color: '#ffffff',
          borderRadius: '18px',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          Find Agricultural Machinery Near You
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#dcfce7', marginBottom: '1.25rem' }}>
          Search by machinery name, model, HP specifications, or location
        </p>
        <SearchBar onSearch={handleSearch} placeholder="Search tractors, combine harvesters, boom sprayers, rotavators..." />
      </div>

      {/* Activity Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <StatCard
          title="Total Bookings"
          value={renterStats.totalRequests}
          icon={Inbox}
          color="#15803d"
          subtitle="All requests"
        />
        <StatCard
          title="Pending Approval"
          value={renterStats.pending}
          icon={Clock}
          color="#d97706"
          subtitle="Awaiting owner"
        />
        <StatCard
          title="Approved Bookings"
          value={renterStats.approved}
          icon={CheckCircle}
          color="#059669"
          subtitle="Ready for pickup"
        />
        <StatCard
          title="Completed Operations"
          value={renterStats.completed}
          icon={ShieldCheck}
          color="#2563eb"
          subtitle="Past operations"
        />
      </div>

      {/* Category Pills */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Browse by Machinery Category</h3>
          <Link to="/farmer/browse" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            View Catalog →
          </Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1.5px solid var(--border)',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Smart Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.825rem' }}>
                <Sparkles size={15} /> AI Match Engine
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Recommended For Your Farm</h3>
            </div>
            <Link to="/farmer/browse" className="btn btn-secondary btn-sm">
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <EquipmentGrid
            equipment={recommendations.slice(0, 3)}
            loading={false}
            onRentClick={(eq) => setSelectedForRent(eq)}
          />
        </div>
      )}

      {/* Available Machinery Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Available Machinery For Hire</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Verified equipment ready for immediate field scheduling
            </p>
          </div>
          <Link to="/farmer/browse" className="btn btn-secondary btn-sm">
            View All Machinery <ArrowRight size={14} />
          </Link>
        </div>

        <EquipmentGrid
          equipment={nearbyEquipment}
          loading={false}
          onRentClick={(eq) => setSelectedForRent(eq)}
        />
      </div>

      {/* Rental Request Modal */}
      {selectedForRent && (
        <RentalRequestModal
          isOpen={!!selectedForRent}
          equipment={selectedForRent}
          onClose={() => setSelectedForRent(null)}
          onSuccess={() => {
            navigate('/farmer/rentals');
          }}
        />
      )}
    </div>
  );
};
