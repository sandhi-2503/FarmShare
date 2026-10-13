import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import {
  Tractor,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const homePath = isAuthenticated
    ? (isOwner ? '/equipment-owner/home' : '/farmer/home')
    : '/';

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}
      >
        {/* Brand Logo */}
        <Link
          to={homePath}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
            }}
          >
            <Tractor size={24} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              FARM SHARE <span style={{ color: 'var(--primary)' }}>AI</span>
              <Sparkles size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Share Machinery. Grow Together.
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav"
        >
          <NavLink
            to={homePath}
            style={({ isActive }) => ({
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/browse"
            style={({ isActive }) => ({
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s'
            })}
          >
            Browse Equipment
          </NavLink>
          <NavLink
            to="/how-it-works"
            style={({ isActive }) => ({
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s'
            })}
          >
            How It Works
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s'
            })}
          >
            About
          </NavLink>
        </nav>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {isOwner && (
                <Link
                  to="/equipment-owner/add-equipment"
                  className="btn btn-outline-primary btn-sm"
                  style={{ display: 'none' }}
                  id="nav-add-btn"
                >
                  <PlusCircle size={16} /> List Equipment
                </Link>
              )}

              <NotificationBell />

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'none',
                    border: '1px solid var(--border)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      overflow: 'hidden'
                    }}
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '210px',
                      zIndex: 1000,
                      padding: '0.5rem 0',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                      <span className="badge badge-ai" style={{ marginTop: '0.35rem' }}>
                        {user?.accountType === 'owner' ? 'Equipment Owner' : 'Farmer / Renter'}
                      </span>
                    </div>
                    <Link
                      to={isOwner ? "/equipment-owner/home" : "/farmer/home"}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <div style={{ borderTop: '1px solid var(--border)', margin: '0.35rem 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              padding: '0.35rem'
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <Link
            to={homePath}
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600 }}
          >
            Home
          </Link>
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600 }}
          >
            Browse Equipment
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600 }}
          >
            How It Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600 }}
          >
            About
          </Link>
          {isAuthenticated && (
            <Link
              to={isOwner ? "/equipment-owner/home" : "/farmer/home"}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.5rem 0',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <LayoutDashboard size={16} /> Open Dashboard
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          #nav-add-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};
