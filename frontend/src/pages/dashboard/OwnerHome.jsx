import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rentalService } from '../../services/rentalService';
import { equipmentService } from '../../services/equipmentService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Tractor,
  CalendarCheck,
  Inbox,
  CheckCircle,
  IndianRupee,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  TrendingUp
} from 'lucide-react';

export const OwnerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [myEquipment, setMyEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOwnerData = async () => {
      try {
        setLoading(true);
        const [statsRes, reqsRes, eqRes] = await Promise.all([
          rentalService.getDashboardStats().catch(() => null),
          rentalService.getOwnerRequests().catch(() => null),
          equipmentService.getMyEquipment().catch(() => null)
        ]);

        if (statsRes?.success) setStats(statsRes.ownerStats);
        if (reqsRes?.success) setRecentRequests((reqsRes.requests || []).slice(0, 5));
        if (eqRes?.success) setMyEquipment((eqRes.equipment || []).slice(0, 4));
      } catch (err) {
        console.error('Owner dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOwnerData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading Owner Dashboard..." />;
  }

  const ownerStats = stats || {
    totalMachinery: 0,
    availableMachinery: 0,
    pendingRequests: 0,
    activeRentals: 0,
    completedRentals: 0,
    totalEarnings: 0
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
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
            Equipment Owner Portal
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Welcome back, {user?.name}! 🚜
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage machinery inventory, accept incoming farmer bookings, and track rental earnings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/equipment-owner/add-equipment" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> + Add Machinery
          </Link>
          <Link to="/equipment-owner/my-machinery" className="btn btn-secondary btn-sm">
            <Tractor size={16} /> My Machinery
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <StatCard
          title="Total Machinery"
          value={ownerStats.totalMachinery}
          icon={Tractor}
          color="#15803d"
          subtitle="Listed in catalog"
        />
        <StatCard
          title="Available Now"
          value={ownerStats.availableMachinery}
          icon={CheckCircle}
          color="#059669"
          subtitle="Ready for hire"
        />
        <StatCard
          title="Pending Requests"
          value={ownerStats.pendingRequests}
          icon={Clock}
          color="#d97706"
          subtitle="Needs approval"
        />
        <StatCard
          title="Active Rentals"
          value={ownerStats.activeRentals}
          icon={CalendarCheck}
          color="#2563eb"
          subtitle="In field operations"
        />
        <StatCard
          title="Total Earnings"
          value={formatCurrency(ownerStats.totalEarnings)}
          icon={IndianRupee}
          color="#0d9488"
          subtitle="Revenue generated"
        />
      </div>

      {/* Recent Rental Requests Section */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Rental Requests</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Latest incoming equipment bookings from nearby farmers
            </p>
          </div>
          <Link to="/equipment-owner/requests" className="btn btn-secondary btn-sm">
            View All Requests <ArrowRight size={14} />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No incoming rental requests at the moment.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Equipment</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Renter</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Schedule</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Rental Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
                      {req.equipment?.equipmentName || 'Equipment'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {req.renter?.name || 'Farmer'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {formatDate(req.startDate)} - {formatDate(req.endDate)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatCurrency(req.totalAmount)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Machinery Inventory Quick Overview */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Machinery Fleet</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Active equipment listings currently visible to farmers
            </p>
          </div>
          <Link to="/equipment-owner/my-machinery" className="btn btn-secondary btn-sm">
            Manage All Fleet <ArrowRight size={14} />
          </Link>
        </div>

        {myEquipment.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No machinery added yet.</p>
            <Link to="/equipment-owner/add-equipment" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Add Your First Tractor or Implement
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {myEquipment.map((eq) => (
              <div key={eq._id} style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={eq.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  style={{ width: '100%', height: '130px', objectFit: 'cover' }}
                />
                <div style={{ padding: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {eq.equipmentName}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                      {formatCurrency(eq.pricePerDay)}/day
                    </span>
                    <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                      {eq.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
