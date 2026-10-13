import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/formatters';
import { User, Mail, Phone, MapPin, Lock, Save, KeyRound, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotifications();

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [state, setState] = useState(user?.location?.state || '');
  const [city, setCity] = useState(user?.location?.city || '');
  const [area, setArea] = useState(user?.location?.area || '');
  const [pinCode, setPinCode] = useState(user?.location?.pinCode || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passError, setPassError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name,
        phone,
        bio,
        profileImage,
        location: { state, city, area, pinCode }
      });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      if (res.success) {
        addToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPassError(err.message || 'Failed to change password.');
      addToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Account Settings
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Farmer Profile & Security
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Update your contact details, operational base, and account credentials
        </p>
      </div>

      {/* Profile Card Header */}
      <div
        className="card"
        style={{
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          backgroundColor: '#ffffff'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.75rem',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {profileImage ? (
            <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name?.charAt(0) || 'U'
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-ai" style={{ textTransform: 'capitalize' }}>
              Role: {user?.role}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Joined {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleProfileSubmit} style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--primary)' }} />
            <span>Personal & Farming Details</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Farmer Bio / Crop Focus</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="e.g. Progressive organic farmer with 15 acres in Punjab..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '1.5rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span>Farming Base / Location</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City / District</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Area / Village</label>
              <input
                type="text"
                className="form-input"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">PIN Code</label>
              <input
                type="text"
                className="form-input"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingProfile}
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={16} /> {savingProfile ? 'Updating Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={18} style={{ color: 'var(--primary)' }} />
            <span>Security & Password</span>
          </h3>

          {passError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                fontWeight: 500
              }}
            >
              {passError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={changingPassword}
            style={{ marginTop: '0.5rem' }}
          >
            {changingPassword ? 'Updating Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
