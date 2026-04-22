// src/pages/Admin/AdminBookings.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const STATUS_LABELS = {
  pending: 'Pending', confirmed: 'Confirmed',
  in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/bookings/admin/all${params}`);
      setBookings(data.bookings);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.put(`/bookings/admin/${id}/status`, { status: newStatus });
      toast.success(`Booking status updated to "${STATUS_LABELS[newStatus]}"`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatTime = t => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`;
  };

  const filtered = bookings.filter(b =>
    b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.service_name?.toLowerCase().includes(search.toLowerCase()) ||
    String(b.id).includes(search)
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Bookings</h1>
          <p>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="admin-filter-bar">
        <div className="status-tabs compact">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} className={`status-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <input type="text" placeholder="🔍 Search by customer, service, or ID..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input admin-search" style={{ maxWidth: 320 }} />
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
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
                  <td>
                    <div className="td-name">{b.service_name}</div>
                  </td>
                  <td>
                    <div className="td-name">{formatDate(b.booking_date)}</div>
                    <div className="td-email">{formatTime(b.booking_time)}</div>
                  </td>
                  <td>
                    <div className="td-address" title={b.address}>
                      {b.address?.slice(0, 35)}{b.address?.length > 35 ? '...' : ''}
                    </div>
                  </td>
                  <td><strong>₹{Number(b.total_amount).toLocaleString()}</strong></td>
                  <td>
                    <span className={`badge badge-${b.status}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={e => handleStatusChange(b.id, e.target.value)}
                      disabled={updating === b.id}
                      className="status-select"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-row">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
