import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();

  let badgeClass = 'badge-pending';
  let Icon = Clock;
  let label = 'Pending';

  switch (normalized) {
    case 'approved':
      badgeClass = 'badge-approved';
      Icon = CheckCircle;
      label = 'Approved';
      break;
    case 'rejected':
      badgeClass = 'badge-rejected';
      Icon = XCircle;
      label = 'Rejected';
      break;
    case 'completed':
      badgeClass = 'badge-completed';
      Icon = CheckCheck;
      label = 'Completed';
      break;
    case 'cancelled':
      badgeClass = 'badge-cancelled';
      Icon = AlertCircle;
      label = 'Cancelled';
      break;
    case 'pending':
    default:
      badgeClass = 'badge-pending';
      Icon = Clock;
      label = 'Pending';
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={13} />
      {label}
    </span>
  );
};
