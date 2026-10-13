import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Tractor,
  PlusCircle,
  Inbox,
  CalendarCheck,
  Bell,
  User,
  LogOut,
  Compass
} from 'lucide-react';

export const Sidebar = ({ onCloseMobile }) => {
  const { user, isOwner, isRenter, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.925rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? 'var(--primary)' : 'var(--text-main)',
    backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    marginBottom: '0.25rem'
  });

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border)',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem'
      }}
    >
      <div>
        {/* User Card */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </h4>
            <span
              className="badge badge-ai"
              style={{ fontSize: '0.7rem', marginTop: '0.2rem', textTransform: 'capitalize' }}
            >
              {user?.accountType === 'owner' ? 'Equipment Owner' : 'Farmer / Renter'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.5rem' }}>
            Dashboard Menu
          </div>

          {/* Owner specific navigation */}
          {isOwner ? (
            <>
              <NavLink to="/equipment-owner/home" end style={navItemStyle} onClick={onCloseMobile}>
                <LayoutDashboard size={18} /> Owner Dashboard
              </NavLink>
              <NavLink to="/equipment-owner/my-machinery" style={navItemStyle} onClick={onCloseMobile}>
                <Tractor size={18} /> My Machinery
              </NavLink>
              <NavLink to="/equipment-owner/add-equipment" style={navItemStyle} onClick={onCloseMobile}>
                <PlusCircle size={18} /> Add Machinery
              </NavLink>
              <NavLink to="/equipment-owner/requests" style={navItemStyle} onClick={onCloseMobile}>
                <Inbox size={18} /> Rental Requests
              </NavLink>
            </>
          ) : (
            /* Farmer / Renter specific navigation */
            <>
              <NavLink to="/farmer/home" end style={navItemStyle} onClick={onCloseMobile}>
                <LayoutDashboard size={18} /> Farmer Dashboard
              </NavLink>
              <NavLink to="/farmer/browse" style={navItemStyle} onClick={onCloseMobile}>
                <Compass size={18} /> Browse Equipment
              </NavLink>
              <NavLink to="/farmer/rentals" style={navItemStyle} onClick={onCloseMobile}>
                <CalendarCheck size={18} /> My Bookings
              </NavLink>
            </>
          )}

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '1rem 0.5rem 0.5rem' }}>
            Account & Alerts
          </div>
          <NavLink to="/dashboard/notifications" style={navItemStyle} onClick={onCloseMobile}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Bell size={18} /> Notifications
              </div>
              {unreadCount > 0 && (
                <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </NavLink>
          <NavLink
            to={isOwner ? '/equipment-owner/profile' : '/farmer/profile'}
            style={navItemStyle}
            onClick={onCloseMobile}
          >
            <User size={18} /> Profile & Settings
          </NavLink>
        </div>
      </div>

      {/* Logout button */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.75rem 1rem',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'none',
            color: '#ef4444',
            fontSize: '0.925rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s'
          }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
