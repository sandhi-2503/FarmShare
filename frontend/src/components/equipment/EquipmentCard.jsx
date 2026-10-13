import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, User, Edit3, Trash2, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const EquipmentCard = ({
  equipment,
  isOwnerView = false,
  onEdit,
  onDelete,
  onRentClick
}) => {
  const mainImage =
    equipment.images && equipment.images.length > 0
      ? equipment.images[0]
      : 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';

  const isAvailable = equipment.isAvailable !== false;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden' }}>
        <img
          src={mainImage}
          alt={equipment.equipmentName}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)'
          }}
        >
          {equipment.category}
        </div>

        {/* Availability Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: isAvailable ? '#dcfce7' : '#fee2e2',
            color: isAvailable ? '#15803d' : '#b91c1c',
            fontSize: '0.725rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isAvailable ? <CheckCircle size={12} /> : <Clock size={12} />}
          {isAvailable ? 'Available' : 'Booked'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* AI Recommendation Reason Banner */}
        {equipment.aiReason && (
          <div
            className="badge-ai"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.75rem'
            }}
          >
            <Sparkles size={13} style={{ color: '#059669', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {equipment.aiReason}
            </span>
          </div>
        )}

        <h4
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.35rem',
            lineHeight: 1.3
          }}
        >
          {equipment.equipmentName}
        </h4>

        {/* Brand & Model */}
        {(equipment.brand || equipment.model) && (
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            {[equipment.brand, equipment.model].filter(Boolean).join(' • ')}
          </p>
        )}

        {/* Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem'
          }}
        >
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>
            {[equipment.area, equipment.city, equipment.state].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Owner Info if not owner view */}
        {!isOwnerView && equipment.owner && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border)'
            }}
          >
            <User size={14} />
            <span>Listed by <strong style={{ color: 'var(--text-main)' }}>{equipment.owner.name}</strong></span>
          </div>
        )}

        {/* Price & Action Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Daily Rate
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatCurrency(equipment.pricePerDay)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
          </div>

          {isOwnerView ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onEdit && onEdit(equipment)}
                className="btn btn-secondary btn-sm"
                title="Edit Equipment"
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(equipment)}
                className="btn btn-danger btn-sm"
                title="Delete Equipment"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Link
                to={`/equipment/${equipment._id}`}
                className="btn btn-secondary btn-sm"
              >
                View
              </Link>
              <button
                onClick={() => onRentClick && onRentClick(equipment)}
                className="btn btn-primary btn-sm"
              >
                Rent Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
