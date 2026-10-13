import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Tractor,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accountType: 'renter' // 'renter' or 'owner'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    if (!formData.accountType) {
      setError('Please select your account type.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(
        formData.email.trim(),
        formData.password,
        formData.accountType
      );

      addToast('Login successful! Welcome back.', 'success');

      // Role-based redirection according to accountType
      if (user.accountType === 'owner') {
        navigate('/equipment-owner/home');
      } else {
        navigate('/farmer/home');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (email, password, type) => {
    setFormData({ email, password, accountType: type });
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password, type);
      addToast('Logged in as Demo User!', 'success');
      if (user.accountType === 'owner') {
        navigate('/equipment-owner/home');
      } else {
        navigate('/farmer/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `linear-gradient(135deg, rgba(10, 25, 18, 0.82) 0%, rgba(15, 60, 30, 0.78) 100%), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}
      >
        {/* LEFT COLUMN: Agricultural Brand & Feature Showcase */}
        <div style={{ color: '#ffffff' }}>
          {/* Logo & Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#15803d',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.4)'
              }}
            >
              <Tractor size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                FarmShare <span style={{ color: '#4ade80' }}>AI</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>
                Smart Agricultural Marketplace
              </p>
            </div>
          </div>

          {/* Badge */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.775rem',
                fontWeight: 700,
                color: '#86efac',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              <Sparkles size={13} style={{ color: '#fbbf24' }} />
              SMART FARMING • SMART SHARING
            </span>
          </div>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em'
            }}
          >
            Share machinery.<br />
            <span style={{ color: '#4ade80' }}>Grow together.</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '1.05rem',
              color: '#cbd5e1',
              lineHeight: 1.65,
              marginBottom: '2.5rem',
              maxWidth: '520px'
            }}
          >
            Connect with nearby farmers and equipment owners. Rent the right machinery for your farming needs without the high cost of ownership.
          </p>

          {/* 3 Glass Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem', maxWidth: '520px' }}>
            {/* Card 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Tractor size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.15rem' }}>
                  Share Machinery
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Rent unused equipment and earn additional income.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <TrendingDown size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.15rem' }}>
                  Reduce Farming Costs
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Rent machinery instead of purchasing expensive equipment.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.15rem' }}>
                  Smart Recommendations
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Discover suitable machinery for your farming tasks.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            <ShieldCheck size={18} style={{ color: '#4ade80' }} />
            <span>Secure • Transparent • Built for Farmers</span>
          </div>
        </div>

        {/* RIGHT COLUMN: White/Glass Login Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            width: '100%',
            maxWidth: '520px',
            margin: '0 auto'
          }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <span
              style={{
                fontSize: '0.775rem',
                fontWeight: 800,
                color: '#15803d',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem'
              }}
            >
              WELCOME BACK
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Login to your account
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem' }}>
              Continue your journey with FarmShare AI
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '0.8rem 1rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: '10px',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                fontWeight: 600,
                border: '1px solid #fecaca'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Account Type Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                LOGIN AS
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {/* Farmer / Renter */}
                <div
                  onClick={() => setFormData({ ...formData, accountType: 'renter' })}
                  style={{
                    border: formData.accountType === 'renter' ? '2px solid #15803d' : '1.5px solid #e2e8f0',
                    backgroundColor: formData.accountType === 'renter' ? '#f0fdf4' : '#ffffff',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: formData.accountType === 'renter' ? '0 2px 8px rgba(21, 128, 61, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                        Farmer / Renter
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Rent machinery
                      </p>
                    </div>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: formData.accountType === 'renter' ? '5px solid #15803d' : '2px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    />
                  </div>
                </div>

                {/* Equipment Owner */}
                <div
                  onClick={() => setFormData({ ...formData, accountType: 'owner' })}
                  style={{
                    border: formData.accountType === 'owner' ? '2px solid #15803d' : '1.5px solid #e2e8f0',
                    backgroundColor: formData.accountType === 'owner' ? '#f0fdf4' : '#ffffff',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: formData.accountType === 'owner' ? '0 2px 8px rgba(21, 128, 61, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                        Equipment Owner
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        List & manage
                      </p>
                    </div>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: formData.accountType === 'owner' ? '5px solid #15803d' : '2px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', borderRadius: '10px', fontSize: '0.9rem' }}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', borderRadius: '10px', fontSize: '0.9rem' }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#15803d',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
              }}
            >
              {loading ? 'Logging in...' : 'Login to FarmShare →'}
            </button>
          </form>

          {/* Quick 1-Click Demo Buttons for Fast Testing */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem', textAlign: 'center' }}>
              Quick 1-Click Demo Accounts
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoFill('ramesh.patel@farmshare.in', 'farmshare123', 'owner')}
                style={{ fontSize: '0.775rem', padding: '0.45rem', justifyContent: 'center' }}
              >
                🚜 Owner: Ramesh
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoFill('suresh.kumar@farmshare.in', 'farmshare123', 'renter')}
                style={{ fontSize: '0.775rem', padding: '0.45rem', justifyContent: 'center' }}
              >
                🌾 Renter: Suresh
              </button>
            </div>
          </div>

          {/* Bottom Link to Signup */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              New to FarmShare?{' '}
            </span>
            <Link
              to="/signup"
              style={{
                fontSize: '0.875rem',
                color: '#15803d',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Create your account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
