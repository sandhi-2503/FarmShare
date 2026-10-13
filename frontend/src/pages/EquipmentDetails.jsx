import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { equipmentService } from '../services/equipmentService';
import { RentalRequestModal } from '../components/rental/RentalRequestModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getWhatsAppLink } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  Shield,
  Fuel,
  Star,
  CheckCircle,
  MessageCircle,
  Phone,
  ArrowLeft,
  ChevronRight,
  Share2,
  Tag,
  Tractor,
  Layers,
  Sparkles
} from 'lucide-react';

export const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rentModalOpen, setRentModalOpen] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        const res = await equipmentService.getById(id);
        if (res.success && res.equipment) {
          setEquipment(res.equipment);
        } else {
          setError('Equipment not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load equipment');
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading machinery specifications..." />;
  }

  if (error || !equipment) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Equipment Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'This machinery listing may have been removed or is unavailable.'}</p>
        <Link to="/browse" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const images = equipment.images && equipment.images.length > 0
    ? equipment.images
    : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80'];

  const isOwner = user?._id && equipment.owner?._id && user._id === equipment.owner._id;
  const whatsAppUrl = getWhatsAppLink(equipment.owner?.phone, equipment.equipmentName);

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem'
          }}
        >
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/browse" style={{ color: 'var(--text-muted)' }}>Equipment</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{equipment.equipmentName}</span>
        </div>

        {/* 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2.5rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column: Image Gallery & Description */}
          <div>
            {/* Main Image */}
            <div
              className="card"
              style={{
                overflow: 'hidden',
                borderRadius: 'var(--radius-xl)',
                aspectRatio: '16/10',
                position: 'relative',
                marginBottom: '1rem'
              }}
            >
              <img
                src={images[activeImageIndex]}
                alt={equipment.equipmentName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {equipment.category}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: `2px solid ${activeImageIndex === index ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      padding: 0,
                      background: 'none'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Machinery Description & Specs */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                About This Machinery
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                {equipment.description}
              </p>

              {/* Technical Specifications */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Key Technical Specifications
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Brand</span>
                  <strong style={{ fontSize: '0.95rem' }}>{equipment.brand || 'Standard'}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Model</span>
                  <strong style={{ fontSize: '0.95rem' }}>{equipment.model || 'N/A'}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Year of Purchase</span>
                  <strong style={{ fontSize: '0.95rem' }}>{equipment.yearOfPurchase || 2022}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Horse Power</span>
                  <strong style={{ fontSize: '0.95rem' }}>{equipment.specifications?.horsePower || 'Standard HP'}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Fuel Policy</span>
                  <strong style={{ fontSize: '0.85rem' }}>{equipment.fuelPolicy}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Condition</span>
                  <strong style={{ fontSize: '0.95rem' }}>{equipment.specifications?.condition || 'Excellent'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Owner Card & Rental Action */}
          <div>
            {/* Header info */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-approved" style={{ fontSize: '0.8rem' }}>
                  <CheckCircle size={14} /> Ready for Field Work
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#d97706', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Star size={16} fill="#d97706" /> {equipment.rating || 4.9} ({equipment.totalRentals || 8} completed rentals)
                </div>
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.25 }}>
                {equipment.equipmentName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>{[equipment.area, equipment.city, equipment.state, equipment.pinCode].filter(Boolean).join(', ')}</span>
              </div>

              {/* Pricing breakdown box */}
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--primary-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #bbf7d0',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Daily Rate</span>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {formatCurrency(equipment.pricePerDay)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / day</span>
                  </div>
                  <div style={{ borderLeft: '1px solid #bbf7d0', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Hourly Rate</span>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {formatCurrency(equipment.pricePerHour)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / hour</span>
                  </div>
                </div>

                <div style={{ paddingTop: '0.85rem', borderTop: '1px dashed #86efac', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Shield size={14} style={{ color: 'var(--primary)' }} /> Refundable Deposit:
                  </span>
                  <strong>{formatCurrency(equipment.securityDeposit)}</strong>
                </div>
              </div>

              {/* Rental Buttons */}
              {isOwner ? (
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    You own this machinery listing.
                  </p>
                  <Link
                    to={`/dashboard/machinery/${equipment._id}/edit`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Edit Equipment Details
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => setRentModalOpen(true)}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    <Calendar size={18} /> Continue to Rent
                  </button>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', borderColor: '#22c55e', color: '#15803d' }}
                  >
                    <MessageCircle size={18} /> Contact Owner on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Owner Information Card */}
            {equipment.owner && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                  Machinery Owner
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {equipment.owner.profileImage ? (
                      <img src={equipment.owner.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      equipment.owner.name?.charAt(0) || 'O'
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{equipment.owner.name}</h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      Member since {formatDate(equipment.owner.createdAt || equipment.createdAt)}
                    </p>
                    <span className="badge badge-approved" style={{ marginTop: '0.25rem' }}>
                      Verified Owner
                    </span>
                  </div>
                </div>

                {equipment.owner.bio && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    "{equipment.owner.bio}"
                  </p>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <MapPin size={15} style={{ color: 'var(--primary)' }} />
                    <span>Location: {equipment.owner.location?.city || equipment.city}, {equipment.owner.location?.state || equipment.state}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Phone size={15} style={{ color: 'var(--primary)' }} />
                    <span>Phone: {equipment.owner.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rent Modal */}
      {rentModalOpen && (
        <RentalRequestModal
          isOpen={rentModalOpen}
          equipment={equipment}
          onClose={() => setRentModalOpen(false)}
          onSuccess={() => {
            navigate('/dashboard/rentals');
          }}
        />
      )}
    </div>
  );
};
