import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../../services/rentalService';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate, getWhatsAppLink } from '../../utils/formatters';
import {
  CalendarCheck,
  MessageCircle,
  Clock,
  Calendar,
  User,
  Shield,
  Phone,
  AlertCircle,
  CheckCheck
} from 'lucide-react';

export const MyRentals = () => {
  const { addToast } = useNotifications();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchMyRentals = async () => {
    try {
      setLoading(true);
      const res = await rentalService.getMyRequests();
      if (res.success) {
        setRentals(res.requests || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch your bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentals();
  }, []);

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      const res = await rentalService.cancel(id);
      if (res.success) {
        addToast('Rental request cancelled.', 'info');
        setRentals((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
        );
      }
    } catch (err) {
      addToast(err.message || 'Could not cancel request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      const res = await rentalService.complete(id);
      if (res.success) {
        addToast('Rental marked completed! Thank you for sharing machinery.', 'success');
        setRentals((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'completed' } : r))
        );
      }
    } catch (err) {
      addToast(err.message || 'Could not mark rental completed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching your rental history..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Renter Portal
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
          My Rental Bookings ({rentals.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Track requested machinery, access owner contacts on approval, and view rental invoices
        </p>
      </div>

      {rentals.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Rental Requests Yet"
          description="You haven't requested any agricultural machinery yet. Discover tractors and harvesters ready for field work."
          actionText="Browse Equipment Catalog"
          actionLink="/browse"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {rentals.map((rental) => {
            const isApproved = rental.status === 'approved';
            const isPending = rental.status === 'pending';
            const whatsAppUrl = getWhatsAppLink(rental.owner?.phone, rental.equipment?.equipmentName);

            return (
              <div
                key={rental._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `5px solid ${
                    isApproved ? '#22c55e' : isPending ? '#f59e0b' : '#cbd5e1'
                  }`
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={
                        rental.equipment?.images?.[0] ||
                        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80'
                      }
                      alt=""
                      style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {rental.equipment?.equipmentName || 'Equipment'}
                      </h3>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <User size={14} /> Owner: <strong style={{ color: 'var(--text-main)' }}>{rental.owner?.name}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={rental.status} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.4rem' }}>
                      {formatCurrency(rental.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rental Period</span>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} />
                      {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rental Type & Duration</span>
                    <strong style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Clock size={14} style={{ color: 'var(--primary)' }} />
                      {rental.rentalType} ({rental.duration} {rental.rentalType === 'daily' ? 'days' : 'hours'})
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Owner Phone</span>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Phone size={14} style={{ color: 'var(--primary)' }} />
                      {isApproved ? rental.owner?.phone : 'Visible upon approval'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Deposit Included</span>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Shield size={14} style={{ color: 'var(--primary)' }} />
                      {formatCurrency(rental.securityDeposit)}
                    </strong>
                  </div>
                </div>

                {/* Actions Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    paddingTop: '0.5rem'
                  }}
                >
                  {isPending && (
                    <button
                      onClick={() => handleCancel(rental._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                      disabled={actionLoading === rental._id}
                    >
                      Cancel Request
                    </button>
                  )}

                  {isApproved && (
                    <>
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: '#22c55e', color: '#15803d' }}
                      >
                        <MessageCircle size={16} /> Contact Owner on WhatsApp
                      </a>
                      <button
                        onClick={() => handleComplete(rental._id)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading === rental._id}
                      >
                        <CheckCheck size={16} /> Mark Completed
                      </button>
                    </>
                  )}

                  <Link to={`/equipment/${rental.equipment?._id || ''}`} className="btn btn-secondary btn-sm">
                    View Equipment Page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
