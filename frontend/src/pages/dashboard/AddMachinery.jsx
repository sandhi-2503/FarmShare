import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { useNotifications } from '../../context/NotificationContext';
import { ImageUploader } from '../../components/equipment/ImageUploader';
import { Tractor, ArrowLeft, Sparkles, CheckCircle2, Shield } from 'lucide-react';

const CATEGORIES = [
  'Tractor',
  'Harvester',
  'Cultivator',
  'Plough',
  'Seeder',
  'Sprayer',
  'Rotavator',
  'Thresher',
  'Trailer',
  'Irrigation Equipment',
  'Other'
];

const FUEL_POLICIES = [
  'Renter pays actual fuel used',
  'Included in price',
  'Full to full tank policy',
  'Not applicable / Electric'
];

export const AddMachinery = () => {
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    equipmentName: '',
    category: 'Tractor',
    brand: '',
    model: '',
    yearOfPurchase: new Date().getFullYear(),
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    securityDeposit: '3000',
    fuelPolicy: 'Renter pays actual fuel used',
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    state: '',
    city: '',
    area: '',
    pinCode: '',
    horsePower: '50 HP',
    fuelType: 'Diesel',
    condition: 'Excellent'
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validations
    if (!formData.equipmentName.trim()) {
      setError('Equipment name is required.');
      return;
    }
    if (Number(formData.pricePerHour) <= 0 || Number(formData.pricePerDay) <= 0) {
      setError('Hourly and daily rental rates must be positive amounts.');
      return;
    }
    if (!formData.state.trim() || !formData.city.trim()) {
      setError('State and City are required to help local farmers locate your machinery.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append image files if any
      imageFiles.forEach((file) => {
        data.append('images', file);
      });

      // Append existing image URLs if any
      if (existingImages.length > 0) {
        data.append('existingImages', JSON.stringify(existingImages));
      }

      const res = await equipmentService.create(data);
      if (res.success) {
        addToast('Equipment added successfully!', 'success');
        navigate('/dashboard/machinery');
      }
    } catch (err) {
      setError(err.message || 'Unable to add equipment.');
      addToast(err.message || 'Unable to add equipment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/dashboard/machinery"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}
        >
          <ArrowLeft size={16} /> Back to My Machinery
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>List New Agricultural Equipment</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Provide accurate details about your tractor or farm implement to attract verified renters.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            fontWeight: 500
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Machinery Info */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tractor size={20} style={{ color: 'var(--primary)' }} />
            <span>Equipment Details</span>
          </h3>

          <div className="form-group">
            <label className="form-label">Equipment Name *</label>
            <input
              type="text"
              name="equipmentName"
              className="form-input"
              placeholder="e.g. John Deere 5050D 50 HP 4WD Tractor"
              value={formData.equipmentName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand / Manufacturer</label>
              <input
                type="text"
                name="brand"
                className="form-input"
                placeholder="e.g. Mahindra, John Deere, Sonalika"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                type="text"
                name="model"
                className="form-input"
                placeholder="e.g. 5050D PowerPro"
                value={formData.model}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Purchase</label>
              <input
                type="number"
                name="yearOfPurchase"
                className="form-input"
                min="1990"
                max={new Date().getFullYear()}
                value={formData.yearOfPurchase}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Machinery Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              placeholder="Detail implement attachments, condition, ideal crops/soil, clutch features, and power steering..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Section 2: Photos */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Machinery Photos
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Clear pictures increase rental inquiries by over 80%.
          </p>
          <ImageUploader
            files={imageFiles}
            setFiles={setImageFiles}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
            maxFiles={5}
          />
        </div>

        {/* Section 3: Pricing & Deposit */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--primary)' }} />
            <span>Pricing & Rental Policies</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price Per Day (₹) *</label>
              <input
                type="number"
                name="pricePerDay"
                className="form-input"
                placeholder="e.g. 3200"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price Per Hour (₹) *</label>
              <input
                type="number"
                name="pricePerHour"
                className="form-input"
                placeholder="e.g. 450"
                value={formData.pricePerHour}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit (₹)</label>
              <input
                type="number"
                name="securityDeposit"
                className="form-input"
                placeholder="e.g. 5000"
                value={formData.securityDeposit}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fuel Policy</label>
              <select
                name="fuelPolicy"
                className="form-select"
                value={formData.fuelPolicy}
                onChange={handleChange}
              >
                {FUEL_POLICIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Machinery Location */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Machinery Location
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-input"
                placeholder="e.g. Punjab, Maharashtra, Tamil Nadu"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City / District *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="e.g. Ludhiana, Nashik, Coimbatore"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Area / Village / Tehsil</label>
              <input
                type="text"
                name="area"
                className="form-input"
                placeholder="e.g. Samrala Road"
                value={formData.area}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">PIN Code</label>
              <input
                type="text"
                name="pinCode"
                className="form-input"
                placeholder="e.g. 141001"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/dashboard/machinery" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Adding Equipment...' : 'Publish Equipment Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
