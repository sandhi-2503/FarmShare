import React, { useState, useEffect } from 'react';
import { rentalService } from '../../services/rentalService';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate, getWhatsAppLink } from '../../utils/formatters';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Phone,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

export const OwnerRequests = () => {
  const { addToast } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await rentalService.getOwnerRequests();
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch incoming requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await rentalService.approve(id);
      if (res.success) {
        addToast('Rental request approved! Renter notified.', 'success');
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'approved' } : r))
        );
      }
    } catch (err) {
      addToast(err.message || 'Could not approve request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      const res = await rentalService.reject(id, 'Equipment unavailable for selected schedule');
      if (res.success) {
        addToast('Rental request rejected.', 'info');
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'rejected' } : r))
        );
      }
    } catch (err) {
      addToast(err.message || 'Could not reject request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      const res = await rentalService.complete(id);
      if (res.success) {
        addToast('Rental marked as completed!', 'success');
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'completed' } : r))
        );
      }
    } catch (err) {
      addToast(err.message || 'Could not complete rental', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading rental requests..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Rental Management
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Incoming Rental Requests ({requests.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Review farmer booking requests for your machinery and coordinate schedules
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Rental Requests Yet"
          description="When other farmers request to rent your tractors or equipment, their requests will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => {
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';
            const whatsAppUrl = getWhatsAppLink(req.renter?.phone, req.equipment?.equipmentName);

            return (
              <div
                key={req._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `5px solid ${
                    isPending ? '#f59e0b' : isApproved ? '#22c55e' : '#cbd5e1'
                  }`
                }}
              >
                {/* Header row */}
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
                        req.equipment?.images?.[0] ||
                        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80'
                      }
                      alt=""
                      style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {req.equipment?.equipmentName || 'Equipment'}
                      </h3>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <User size={14} /> Requested by <strong style={{ color: 'var(--text-main)' }}>{req.renter?.name}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={req.status} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.4rem' }}>
                      {formatCurrency(req.totalAmount)}
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
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rental Schedule</span>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} />
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rental Type & Duration</span>
                    <strong style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Clock size={14} style={{ color: 'var(--primary)' }} />
                      {req.rentalType} ({req.duration} {req.rentalType === 'daily' ? 'days' : 'hours'})
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Renter Phone</span>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Phone size={14} style={{ color: 'var(--primary)' }} />
                      {req.renter?.phone || 'Not provided'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Renter Location</span>
                    <strong>{req.renter?.location?.city || 'Local area'}, {req.renter?.location?.state}</strong>
                  </div>
                </div>

                {req.message && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Message from Renter: </span>
                    <span style={{ color: 'var(--text-main)' }}>"{req.message}"</span>
                  </div>
                )}

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
                    <>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                        disabled={actionLoading === req._id}
                      >
                        <XCircle size={16} /> Decline
                      </button>
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading === req._id}
                      >
                        <CheckCircle2 size={16} /> {actionLoading === req._id ? 'Approving...' : 'Accept & Approve'}
                      </button>
                    </>
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
                        <MessageCircle size={16} /> WhatsApp Renter
                      </a>
                      <button
                        onClick={() => handleComplete(req._id)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading === req._id}
                      >
                        <CheckCheck size={16} /> Mark Rental Completed
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
