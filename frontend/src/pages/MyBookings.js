// src/pages/MyBookings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './MyBookings.css';

const STATUS_LABELS = {
  pending: 'Pending', confirmed: 'Confirmed',
  in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled',
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (t) => {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`;
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="bookings-header">
          <div>
            <h1>My Bookings</h1>
            <p>Track and manage all your service bookings</p>
          </div>
          <Link to="/services" className="btn btn-primary">+ Book New Service</Link>
        </div>

        {/* Status Tabs */}
        <div className="status-tabs">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => {
            const count = s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length;
            return (
              <button key={s} className={`status-tab ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}>
                {s === 'all' ? 'All' : STATUS_LABELS[s]}
                {count > 0 && <span className="tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{filter === 'all' ? "No bookings yet" : `No ${STATUS_LABELS[filter] || filter} bookings`}</h3>
            <p>{filter === 'all' ? 'Book your first home service today!' : 'Try viewing all bookings'}</p>
            {filter === 'all'
              ? <Link to="/services" className="btn btn-primary">Explore Services</Link>
              : <button className="btn btn-secondary" onClick={() => setFilter('all')}>View All</button>
            }
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(b => (
              <div key={b.id} className="booking-card card fade-in-up">
                <div className="booking-card__img">
                  <img
                    src={b.image_url || 'https://via.placeholder.com/100'}
                    alt={b.service_name}
                    onError={e => { e.target.src = 'https://via.placeholder.com/100'; }}
                  />
                </div>
                <div className="booking-card__info">
                  <div className="booking-card__top">
                    <div>
                      <h3>{b.service_name}</h3>
                      <p className="booking-category">{b.category_name}</p>
                    </div>
                    <span className={`badge badge-${b.status}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                  <div className="booking-card__details">
                    <span>📅 {formatDate(b.booking_date)}</span>
                    <span>🕐 {formatTime(b.booking_time)}</span>
                    <span>📍 {b.address?.slice(0, 45)}{b.address?.length > 45 ? '...' : ''}</span>
                  </div>
                  <div className="booking-card__footer">
                    <span className="booking-amount">₹{Number(b.total_amount).toLocaleString()}</span>
                    <div className="booking-actions">
                      <Link to={`/bookings/${b.id}`} className="btn btn-secondary btn-sm">View Details</Link>
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelling === b.id}
                        >
                          {cancelling === b.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
