import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle }) => {
  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0
        }}
      >
        {Icon && <Icon size={26} />}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
