import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { rentalService } from '../../services/rentalService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, Clock, Info, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RentalRequestModal = ({ isOpen, onClose, equipment, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  // Get tomorrow's date string as default min
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [rentalType, setRentalType] = useState('daily'); // 'hourly' or 'daily'
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfterTomorrow);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Real-time rental calculation
  const calculations = useMemo(() => {
    if (!equipment || !startDate || !endDate) {
      return { duration: 0, rentalAmount: 0, securityDeposit: 0, totalAmount: 0, unit: 'days' };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return { duration: 0, rentalAmount: 0, securityDeposit: 0, totalAmount: 0, unit: 'days', invalidDates: true };
    }

    const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);
    let duration = diffDays;
    let rentalAmount = 0;
    let unit = 'days';

    if (rentalType === 'daily') {
      rentalAmount = diffDays * (equipment.pricePerDay || 0);
      unit = diffDays === 1 ? 'day' : 'days';
    } else if (rentalType === 'hourly') {
      const [startH] = startTime.split(':').map(Number);
      const [endH] = endTime.split(':').map(Number);
      let hoursPerDay = Math.max(1, endH - startH);
      duration = diffDays * hoursPerDay;
      rentalAmount = duration * (equipment.pricePerHour || 0);
      unit = duration === 1 ? 'hour' : 'hours';
    }

    const securityDeposit = equipment.securityDeposit || 0;
    const totalAmount = rentalAmount + securityDeposit;

    return {
      duration,
      rentalAmount,
      securityDeposit,
      totalAmount,
      unit,
      invalidDates: false
    };
  }, [equipment, rentalType, startDate, endDate, startTime, endTime]);

  if (!equipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      addToast('Please login to submit a rental request', 'info');
      onClose();
      navigate('/login');
      return;
    }

    if (calculations.invalidDates) {
      setError('Start date cannot be after end date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        equipmentId: equipment._id,
        rentalType,
        startDate,
        endDate,
        startTime: rentalType === 'hourly' ? startTime : '09:00',
        endTime: rentalType === 'hourly' ? endTime : '18:00',
        message
      };

      const res = await rentalService.create(payload);
      if (res.success) {
        addToast('Rental request submitted successfully!', 'success');
        if (onSuccess) onSuccess(res.rentalRequest);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Unable to submit rental request.');
      addToast(err.message || 'Unable to submit rental request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rent Agricultural Equipment" maxWidth="600px">
      <form onSubmit={handleSubmit}>
        {/* Machinery Summary Header */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            alignItems: 'center'
          }}
        >
          <img
            src={equipment.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=300&q=80'}
            alt=""
            style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{equipment.equipmentName}</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {equipment.category} • {equipment.city}, {equipment.state}
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.25rem' }}>
              {formatCurrency(equipment.pricePerDay)}/day • {formatCurrency(equipment.pricePerHour)}/hr
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        {/* Rental Type Selection */}
        <div className="form-group">
          <label className="form-label">Rental Duration Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setRentalType('daily')}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${rentalType === 'daily' ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: rentalType === 'daily' ? 'var(--primary-subtle)' : '#ffffff',
                color: rentalType === 'daily' ? 'var(--primary-dark)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Calendar size={18} /> Daily Rental ({formatCurrency(equipment.pricePerDay)}/day)
            </button>
            <button
              type="button"
              onClick={() => setRentalType('hourly')}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${rentalType === 'hourly' ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: rentalType === 'hourly' ? 'var(--primary-subtle)' : '#ffffff',
                color: rentalType === 'hourly' ? 'var(--primary-dark)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Clock size={18} /> Hourly Rental ({formatCurrency(equipment.pricePerHour)}/hr)
            </button>
          </div>
        </div>

        {/* Dates Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              min={startDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Time row if hourly */}
        {rentalType === 'hourly' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Daily Start Time</label>
              <input
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Daily End Time</label>
              <input
                type="time"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Message */}
        <div className="form-group">
          <label className="form-label">Message to Owner (Optional)</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="Describe your intended agricultural use or field location details..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Automatic Cost Calculation Box (Section 14) */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Estimated Rental Cost Breakdown
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Rental Duration ({calculations.duration} {calculations.unit}):
            </span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(calculations.rentalAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} style={{ color: 'var(--primary)' }} /> Refundable Security Deposit:
            </span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(calculations.securityDeposit)}</span>
          </div>
          <div
            style={{
              paddingTop: '0.75rem',
              borderTop: '1px dashed var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Estimated Total:</span>
            <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--primary)' }}>
              {formatCurrency(calculations.totalAmount)}
            </span>
          </div>
        </div>

        {/* Review notice */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem' }}>
          Please review your rental request before submitting. The owner will review and confirm availability.
        </p>

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || calculations.invalidDates}
            style={{ flex: 2 }}
          >
            {submitting ? 'Submitting Request...' : 'Confirm & Send Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
