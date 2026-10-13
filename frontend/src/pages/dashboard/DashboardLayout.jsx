import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar';
import { Menu, X } from 'lucide-react';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--bg-main)' }}>
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar" style={{ display: 'none' }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex'
          }}
        >
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1000,
              width: '280px',
              backgroundColor: '#ffffff',
              height: '100%',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>FarmShare AI</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {/* Mobile Sub-Header with toggle button */}
        <div
          className="mobile-header-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Menu size={18} /> Dashboard Menu
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            FarmShare Workspace
          </span>
        </div>

        <main style={{ flex: 1, padding: '2rem 1.5rem 4rem' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: block !important;
            position: sticky;
            top: 72px;
            align-self: flex-start;
            flex-shrink: 0;
            height: calc(100vh - 72px);
          }
          .mobile-header-bar { display: none !important; }
        }
      `}</style>
    </div>
  );
};
