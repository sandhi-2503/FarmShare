import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Tractor,
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Layers,
  Check
} from 'lucide-react';

export const Signup = () => {
  const { signup } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    accountType: '', // 'renter' or 'owner'
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', score: 0, color: '#e2e8f0' };
    if (pass.length < 6) return { label: 'Weak (min 6 chars)', score: 1, color: '#ef4444' };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    if (pass.length >= 8 && hasNum && hasSpecial) {
      return { label: 'Strong password', score: 3, color: '#15803d' };
    }
    if (pass.length >= 6 && (hasNum || hasSpecial)) {
      return { label: 'Good password', score: 2, color: '#f59e0b' };
    }
    return { label: 'Fair (add numbers & symbols)', score: 2, color: '#f59e0b' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Please enter your 10-digit phone number.');
      return;
    }

    if (!formData.location.trim()) {
      setError('Please enter your City / Village location.');
      return;
    }

    if (!formData.accountType) {
      setError('Please select either Farmer / Renter or Equipment Owner.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const user = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        accountType: formData.accountType,
        password: formData.password
      });

      addToast('Account created successfully! Welcome to FarmShare AI.', 'success');

      // Redirect user according to accountType
      if (user.accountType === 'owner') {
        navigate('/equipment-owner/home');
      } else {
        navigate('/farmer/home');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      addToast(err.message || 'Registration failed', 'error');
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
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s'
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
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s'
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
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s'
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

        {/* RIGHT COLUMN: White/Glass Signup Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            width: '100%',
            maxWidth: '560px',
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
              GET STARTED
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Create your account
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem' }}>
              Join FarmShare AI in a few simple steps.
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
            {/* Full Name & Phone Number */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', borderRadius: '10px', fontSize: '0.875rem' }}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <User
                    size={16}
                    style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', borderRadius: '10px', fontSize: '0.875rem' }}
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <Phone
                    size={16}
                    style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', borderRadius: '10px', fontSize: '0.875rem' }}
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

            {/* Location */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Location
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', borderRadius: '10px', fontSize: '0.875rem' }}
                  placeholder="City / Village"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                <MapPin
                  size={16}
                  style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
              </div>
            </div>

            {/* ACCOUNT TYPE SELECTION (Farmer/Renter OR Equipment Owner) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                SELECT ACCOUNT TYPE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {/* Farmer / Renter Option */}
                <div
                  onClick={() => setFormData({ ...formData, accountType: 'renter' })}
                  style={{
                    border: formData.accountType === 'renter' ? '2px solid #15803d' : '1.5px solid #e2e8f0',
                    backgroundColor: formData.accountType === 'renter' ? '#f0fdf4' : '#ffffff',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    boxShadow: formData.accountType === 'renter' ? '0 2px 8px rgba(21, 128, 61, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                        Farmer / Renter
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Find and rent equipment
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

                {/* Equipment Owner Option */}
                <div
                  onClick={() => setFormData({ ...formData, accountType: 'owner' })}
                  style={{
                    border: formData.accountType === 'owner' ? '2px solid #15803d' : '1.5px solid #e2e8f0',
                    backgroundColor: formData.accountType === 'owner' ? '#f0fdf4' : '#ffffff',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    boxShadow: formData.accountType === 'owner' ? '0 2px 8px rgba(21, 128, 61, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                        Equipment Owner
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        List and rent your machinery
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

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', borderRadius: '10px', fontSize: '0.875rem' }}
                    placeholder="Create password"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', borderRadius: '10px', fontSize: '0.875rem' }}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Lock
                    size={16}
                    style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '4px', height: '4px', margin: '0.4rem 0 0.3rem' }}>
                  <div style={{ flex: 1, backgroundColor: strength.score >= 1 ? strength.color : '#e2e8f0', borderRadius: '2px' }} />
                  <div style={{ flex: 1, backgroundColor: strength.score >= 2 ? strength.color : '#e2e8f0', borderRadius: '2px' }} />
                  <div style={{ flex: 1, backgroundColor: strength.score >= 3 ? strength.color : '#e2e8f0', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', margin: '1.15rem 0' }}>
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#15803d', marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="termsCheckbox" style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the <span style={{ color: '#15803d', fontWeight: 600 }}>Terms & Conditions</span> and <span style={{ color: '#15803d', fontWeight: 600 }}>Privacy Policy</span>.
              </label>
            </div>

            {/* Signup Submit Button */}
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
              {loading ? 'Creating account...' : 'Create FarmShare Account →'}
            </button>
          </form>

          {/* Bottom Link to Login */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Already have an account?{' '}
            </span>
            <Link
              to="/login"
              style={{
                fontSize: '0.875rem',
                color: '#15803d',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Login to your account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
