import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/equipment/SearchBar';
import { FilterPanel } from '../components/equipment/FilterPanel';
import { EquipmentGrid } from '../components/equipment/EquipmentGrid';
import { RentalRequestModal } from '../components/rental/RentalRequestModal';
import { equipmentService } from '../services/equipmentService';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const BrowseEquipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedForRent, setSelectedForRent] = useState(null);

  // Filters State derived from query params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    available: searchParams.get('available') || ''
  });

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = { ...filters };
      // Remove empty params
      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const res = await equipmentService.getAll(queryParams);
      if (res.success) {
        setEquipment(res.equipment || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(updated).forEach((k) => {
      if (updated[k]) newParams.set(k, updated[k]);
    });
    setSearchParams(newParams);
  };

  const handleSearch = (query) => {
    handleFilterChange('search', query);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      available: ''
    };
    setFilters(resetFilters);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header section */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Sparkles size={15} /> Verified Agricultural Machinery
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.65rem' }}>
            Find the Right Equipment for Your Farm
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Discover high-performance tractors, harvesters, tillers, and sprayers available for flexible daily & hourly rental near you.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.75rem' }}>
            <SearchBar onSearch={handleSearch} placeholder="Search by name, brand, tractor model, or city..." />
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

        {/* Results Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-main)' }}>{equipment.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-main)' }}>{total}</strong> available machines
          </div>
        </div>

        {/* Equipment Grid */}
        <EquipmentGrid
          equipment={equipment}
          loading={loading}
          onRentClick={(eq) => setSelectedForRent(eq)}
          emptyTitle="No Equipment Matches Your Search"
          emptyDescription="Try clearing some filters or searching with a different equipment category or city name."
          emptyActionText="Reset All Filters"
          onEmptyAction={handleReset}
        />
      </div>

      {/* Rental Modal */}
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
