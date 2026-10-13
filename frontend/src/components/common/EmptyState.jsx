import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Data Found',
  description = 'There is nothing to display at the moment.',
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-subtle)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <Icon size={36} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.925rem', marginBottom: actionText ? '1.5rem' : '0' }}>
        {description}
      </p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary">
            {actionText}
          </Link>
        ) : (
          <button onClick={onActionClick} className="btn btn-primary">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
