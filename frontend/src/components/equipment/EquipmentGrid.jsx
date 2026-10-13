import React from 'react';
import { EquipmentCard } from './EquipmentCard';
import { EmptyState } from '../common/EmptyState';
import { Tractor } from 'lucide-react';

export const EquipmentGrid = ({
  equipment = [],
  loading = false,
  isOwnerView = false,
  onEdit,
  onDelete,
  onRentClick,
  emptyTitle = 'No Equipment Found',
  emptyDescription = 'No machinery matched your selected criteria.',
  emptyActionText,
  emptyActionLink,
  onEmptyAction
}) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card" style={{ height: '360px', overflow: 'hidden' }}>
            <div style={{ height: '180px', backgroundColor: 'var(--bg-surface)', animation: 'pulse 1.5s infinite' }} />
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ height: '20px', width: '70%', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} />
              <div style={{ height: '14px', width: '40%', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} />
              <div style={{ height: '14px', width: '55%', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} />
              <div style={{ height: '35px', marginTop: 'auto', backgroundColor: 'var(--bg-surface)', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <EmptyState
        icon={Tractor}
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        actionLink={emptyActionLink}
        onActionClick={onEmptyAction}
      />
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}
    >
      {equipment.map((item) => (
        <EquipmentCard
          key={item._id}
          equipment={item}
          isOwnerView={isOwnerView}
          onEdit={onEdit}
          onDelete={onDelete}
          onRentClick={onRentClick}
        />
      ))}
    </div>
  );
};
