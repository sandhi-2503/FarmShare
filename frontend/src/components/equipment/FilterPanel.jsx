import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
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

export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        backgroundColor: '#ffffff'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          <span>Filters & Sorting</span>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RotateCcw size={13} /> Reset All
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Machinery Category
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All') === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange('category', cat === 'All' ? '' : cat)}
                style={{
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.825rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* City Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">City / Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ludhiana, Nashik"
            value={filters.city || ''}
            onChange={(e) => onFilterChange('city', e.target.value)}
          />
        </div>

        {/* Min Price */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Min Price / Day (₹)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Min ₹"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Max Price / Day (₹)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Max ₹"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          />
        </div>

        {/* Sorting */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sort By</label>
          <select
            className="form-select"
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>
    </div>
  );
};
