import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = 'Search tractors, harvesters, brands, city...' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border)',
        padding: '0.4rem 0.6rem 0.4rem 1.25rem',
        boxShadow: 'var(--shadow-sm)',
        width: '100%',
        maxWidth: '650px',
        transition: 'all 0.2s'
      }}
    >
      <Search size={20} style={{ color: 'var(--text-muted)', flexShrink: 0, marginRight: '0.75rem' }} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          fontSize: '0.95rem',
          color: 'var(--text-main)',
          backgroundColor: 'transparent'
        }}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-subtle)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            marginRight: '0.5rem'
          }}
        >
          <X size={16} />
        </button>
      )}
      <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
        Search
      </button>
    </form>
  );
};
