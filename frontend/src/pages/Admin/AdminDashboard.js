// src/pages/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/admin/stats'),
      api.get('/bookings/admin/all'),
    ]).then(([statsRes, bookingsRes]) => {
      setStats(statsRes.data.stats);
      setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    pending: '#F59E0B', confirmed: '#3B82F6',
    in_progress: '#8B5CF6', completed: '#10B981', cancelled: '#EF4444',
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#EFF6FF', tcolor: '#2563EB' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📋', color: '#FFF7ED', tcolor: '#EA580C' },
    { label: 'Active Services', value: stats.totalServices, icon: '🛠️', color: '#F0FDF4', tcolor: '#16A34A' },
    { label: 'Total Revenue', value: `₹${Number(stats.totalRevenue).toLocaleString()}`, icon: '💰', color: '#FDF4FF', tcolor: '#9333EA' },
  ] : [];

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with UrbanServe.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={s.label} className={`stat-card card fade-in-up delay-${i+1}`}
            style={{ '--card-bg': s.color, '--card-color': s.tcolor }}>
            <div className="stat-card__icon">{s.icon}</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label">{s.label}</span>
            </div>
          </div>
        ))}
        {stats?.pendingBookings > 0 && (
          <div className="pending-alert">
            ⚠️ <strong>{stats.pendingBookings}</strong> pending booking{stats.pendingBookings > 1 ? 's' : ''} need attention
            <Link to="/admin/bookings" className="btn btn-primary btn-sm">Review →</Link>
          </div>
        )}
      </div>

      {/* ── Quick Nav ── */}
      <div className="quick-nav">
        {[
          { to: '/admin/services', icon: '🛠️', title: 'Manage Services', desc: 'Add, edit, or remove service listings' },
          { to: '/admin/bookings', icon: '📋', title: 'All Bookings', desc: 'View and update booking statuses' },
          { to: '/admin/users', icon: '👥', title: 'All Users', desc: 'View registered customer accounts' },
        ].map(n => (
          <Link key={n.to} to={n.to} className="quick-nav-card card">
            <span className="qn-icon">{n.icon}</span>
            <div>
              <h3>{n.title}</h3>
              <p>{n.desc}</p>
            </div>
            <span className="qn-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* ── Recent Bookings ── */}
      <div className="card recent-bookings">
        <div className="section-header" style={{ padding: '24px 24px 0', marginBottom: 0 }}>
          <h3>Recent Bookings</h3>
          <Link to="/admin/bookings" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map(b => (
              <tr key={b.id}>
                <td><span className="booking-id">#{b.id}</span></td>
                <td>
                  <div className="td-user">
                    <span className="td-avatar">{b.user_name?.charAt(0)}</span>
                    <div>
                      <div className="td-name">{b.user_name}</div>
                      <div className="td-email">{b.user_email}</div>
                    </div>
                  </div>
                </td>
                <td>{b.service_name}</td>
                <td>{new Date(b.booking_date).toLocaleDateString('en-IN')}</td>
                <td>₹{Number(b.total_amount).toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${b.status}`}
                    style={{ '--dot': STATUS_COLORS[b.status] }}>
                    {b.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
            {recentBookings.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
