import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { EmptyState } from '../../components/common/EmptyState';
import { getRelativeTime, formatDate } from '../../utils/formatters';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Alerts & Activity
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Notifications Center
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <CheckCheck size={16} /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up!"
          description="There are no new notifications. You will receive real-time updates when rental requests arrive or statuses change."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="card"
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: notif.isRead ? '#ffffff' : 'var(--primary-subtle)',
                borderLeft: `4px solid ${notif.isRead ? 'var(--border)' : 'var(--primary)'}`,
                cursor: notif.isRead ? 'default' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: notif.isRead ? 600 : 700, color: 'var(--text-main)' }}>
                    {notif.title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {getRelativeTime(notif.createdAt)}
                  </span>
                  {!notif.isRead && (
                    <span className="badge badge-pending" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                      Unread
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
