import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rentalService } from '../../services/rentalService';
import { equipmentService } from '../../services/equipmentService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { RentalRequestModal } from '../../components/rental/RentalRequestModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Tractor,
  CalendarCheck,
  Inbox,
  CheckCircle,
  IndianRupee,
  Sparkles,
  PlusCircle,
  Compass,
  ArrowRight,
  TrendingUp,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';

export const DashboardHome = () => {
  const { user, isOwner, isRenter } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForRent, setSelectedForRent] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, recRes, reqsRes] = await Promise.all([
          rentalService.getDashboardStats().catch(() => null),
          equipmentService.getRecommendations().catch(() => null),
          (isOwner ? rentalService.getOwnerRequests() : rentalService.getMyRequests()).catch(() => null)
        ]);

        if (statsRes?.success) {
          setStats(statsRes);
        }
        if (recRes?.success) {
          setRecommendations(recRes.recommendations || []);
        }
        if (reqsRes?.success) {
          setRecentRequests((reqsRes.requests || []).slice(0, 5));
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isOwner]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading real-time farm dashboard..." />;
  }

  const ownerStats = stats?.ownerStats || {
    totalMachinery: 0,
    availableMachinery: 0,
    pendingRequests: 0,
    activeRentals: 0,
    completedRentals: 0,
    totalEarnings: 0
  };

  const renterStats = stats?.renterStats || {
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    totalSpent: 0
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 1. Welcome Header (Section 8) */}
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
            Agricultural Operations Dashboard
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Here is your live machinery utilization and rental performance summary.
          </p>
        </div>

        {/* Quick Actions Header */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isOwner && (
            <Link to="/dashboard/machinery/add" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> + Add Equipment
            </Link>
          )}
          <Link to="/browse" className="btn btn-secondary btn-sm">
            <Compass size={16} /> Browse Machinery
          </Link>
        </div>
      </div>

      {/* 2. Owner Statistics Grid (Strictly from MongoDB) */}
      {isOwner && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tractor size={18} style={{ color: 'var(--primary)' }} />
            <span>Equipment Owner Metrics</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <StatCard
              title="Total Machinery"
              value={ownerStats.totalMachinery}
              icon={Tractor}
              color="#15803d"
              subtitle="Registered machines"
            />
            <StatCard
              title="Available Now"
              value={ownerStats.availableMachinery}
              icon={CheckCircle}
              color="#059669"
              subtitle="Ready for rental"
            />
            <StatCard
              title="Pending Requests"
              value={ownerStats.pendingRequests}
              icon={Clock}
              color="#d97706"
              subtitle="Awaiting your approval"
            />
            <StatCard
              title="Active Rentals"
              value={ownerStats.activeRentals}
              icon={CalendarCheck}
              color="#2563eb"
              subtitle="Currently in field"
            />
            <StatCard
              title="Total Earnings"
              value={formatCurrency(ownerStats.totalEarnings)}
              icon={IndianRupee}
              color="#0d9488"
              subtitle="From approved bookings"
            />
          </div>
        </div>
      )}

      {/* 3. Renter Statistics Grid (Strictly from MongoDB) */}
      {isRenter && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck size={18} style={{ color: 'var(--primary)' }} />
            <span>Renter Activity Metrics</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <StatCard
              title="Total Requests"
              value={renterStats.totalRequests}
              icon={Inbox}
              color="#15803d"
              subtitle="All-time bookings"
            />
            <StatCard
              title="Pending Approval"
              value={renterStats.pending}
              icon={Clock}
              color="#d97706"
              subtitle="With machine owners"
            />
            <StatCard
              title="Approved Rentals"
              value={renterStats.approved}
              icon={CheckCircle}
              color="#059669"
              subtitle="Confirmed for use"
            />
            <StatCard
              title="Completed"
              value={renterStats.completed}
              icon={ShieldCheck}
              color="#2563eb"
              subtitle="Finished operations"
            />
            <StatCard
              title="Total Invested"
              value={formatCurrency(renterStats.totalSpent)}
              icon={IndianRupee}
              color="#475569"
              subtitle="Rental & security deposits"
            />
          </div>
        </div>
      )}

      {/* 4. AI Smart Recommendations Section (Sections 41 & 42) */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Sparkles size={16} /> AI Smart Recommendations
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>
                Recommended For You
              </h3>
            </div>
            <Link to="/browse" className="btn btn-secondary btn-sm">
              Explore More <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {recommendations.slice(0, 3).map((eq) => (
              <div
                key={eq._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0
                }}
              >
                <div style={{ height: '140px', position: 'relative' }}>
                  <img
                    src={eq.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {eq.category}
                  </div>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {eq.aiReason && (
                    <div
                      className="badge-ai"
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Sparkles size={11} style={{ color: '#059669', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {eq.aiReason}
                      </span>
                    </div>
                  )}
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {eq.equipmentName}
                  </h4>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {eq.city}, {eq.state}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {formatCurrency(eq.pricePerDay)}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
                    </span>
                    <button
                      onClick={() => setSelectedForRent(eq)}
                      className="btn btn-primary btn-sm"
                    >
                      Rent
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recent Activity / Requests Table */}
      <div className="card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {isOwner ? 'Recent Machinery Requests' : 'My Recent Rental Bookings'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Latest updates on equipment schedules and confirmations
            </p>
          </div>
          <Link
            to={isOwner ? '/dashboard/requests' : '/dashboard/rentals'}
            className="btn btn-secondary btn-sm"
          >
            View All
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No recent rental activity recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Equipment</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{isOwner ? 'Renter' : 'Owner'}</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Schedule</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Total Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
                      {req.equipment?.equipmentName || 'Machinery'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {isOwner ? req.renter?.name : req.owner?.name}
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

      {/* Rent Modal */}
      {selectedForRent && (
        <RentalRequestModal
          isOpen={!!selectedForRent}
          equipment={selectedForRent}
          onClose={() => setSelectedForRent(null)}
          onSuccess={() => {
            navigate('/dashboard/rentals');
          }}
        />
      )}
    </div>
  );
};
