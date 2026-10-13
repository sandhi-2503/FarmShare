import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { useNotifications } from '../../context/NotificationContext';
import { ImageUploader } from '../../components/equipment/ImageUploader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Tractor, ArrowLeft, Shield } from 'lucide-react';

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

export const EditMachinery = () => {
  const { id } = useParams();
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
    securityDeposit: '0',
    fuelPolicy: 'Renter pays actual fuel used',
    isAvailable: true,
    state: '',
    city: '',
    area: '',
    pinCode: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        const res = await equipmentService.getById(id);
        if (res.success && res.equipment) {
          const eq = res.equipment;
          setFormData({
            equipmentName: eq.equipmentName || '',
            category: eq.category || 'Tractor',
            brand: eq.brand || '',
            model: eq.model || '',
            yearOfPurchase: eq.yearOfPurchase || new Date().getFullYear(),
            description: eq.description || '',
            pricePerHour: eq.pricePerHour || '',
            pricePerDay: eq.pricePerDay || '',
            securityDeposit: eq.securityDeposit || '0',
            fuelPolicy: eq.fuelPolicy || 'Renter pays actual fuel used',
            isAvailable: eq.isAvailable !== false,
            state: eq.state || '',
            city: eq.city || '',
            area: eq.area || '',
            pinCode: eq.pinCode || ''
          });
          setExistingImages(eq.images || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load equipment');
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.equipmentName.trim()) {
      setError('Equipment name is required.');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      imageFiles.forEach((file) => {
        data.append('images', file);
      });

      data.append('existingImages', JSON.stringify(existingImages));

      const res = await equipmentService.update(id, data);
      if (res.success) {
        addToast('Equipment updated successfully!', 'success');
        navigate('/dashboard/machinery');
      }
    } catch (err) {
      setError(err.message || 'Unable to update equipment.');
      addToast(err.message || 'Unable to update equipment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading machinery specifications..." />;
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Edit Equipment Details</h1>
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
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Equipment Information
          </h3>

          <div className="form-group">
            <label className="form-label">Equipment Name *</label>
            <input
              type="text"
              name="equipmentName"
              className="form-input"
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
              <label className="form-label">Brand</label>
              <input
                type="text"
                name="brand"
                className="form-input"
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
                value={formData.yearOfPurchase}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Availability Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="isAvailable" style={{ fontWeight: 600, fontSize: '0.925rem', cursor: 'pointer' }}>
              Currently Available for Booking & Field Work
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Machinery Photos
          </h3>
          <ImageUploader
            files={imageFiles}
            setFiles={setImageFiles}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
            maxFiles={5}
          />
        </div>

        {/* Pricing */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Rental Rates & Deposit
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price Per Day (₹) *</label>
              <input
                type="number"
                name="pricePerDay"
                className="form-input"
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
                value={formData.securityDeposit}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Location
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-input"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/dashboard/machinery" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : 'Update Equipment Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
