// src/components/Admin/AdminLayout.js
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { to: '/admin/services', icon: '🛠️', label: 'Services' },
  { to: '/admin/bookings', icon: '📋', label: 'Bookings' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
];

const AdminLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span>⚡</span> Admin Panel
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(n => {
            const isActive = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="s-icon">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <span className="s-icon">🏠</span> Back to Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
