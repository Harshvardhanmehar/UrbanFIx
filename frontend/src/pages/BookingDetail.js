// src/pages/BookingDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './BookingDetail.css';

const STATUS_LABELS = {
  pending: 'Pending', confirmed: 'Confirmed',
  in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled',
};

const STATUS_STEPS = ['pending', 'confirmed', 'in_progress', 'completed'];

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(r => setBooking(r.data.booking))
      .catch(() => { toast.error('Booking not found'); navigate('/bookings'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!booking) return null;

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = t => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`;
  };

  const stepIndex = STATUS_STEPS.indexOf(booking.status);
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="booking-detail-page">
      <div className="container">
        <div className="bd-breadcrumb">
          <Link to="/bookings">← My Bookings</Link>
          <span>/</span>
          <span>Booking #{booking.id}</span>
        </div>

        <div className="bd-grid">
          {/* ── Main ── */}
          <div className="bd-main">
            {/* Status Progress */}
            {!isCancelled && (
              <div className="card bd-progress">
                <h3>Booking Status</h3>
                <div className="progress-steps">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className={`progress-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}>
                      <div className="step-circle">{i < stepIndex ? '✓' : i + 1}</div>
                      <span className="step-name">{STATUS_LABELS[step]}</span>
                      {i < STATUS_STEPS.length - 1 && <div className={`step-line ${i < stepIndex ? 'done' : ''}`} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isCancelled && (
              <div className="cancel-notice">
                ❌ This booking has been cancelled
              </div>
            )}

            {/* Service Info */}
            <div className="card bd-service">
              <img
                src={booking.image_url || 'https://via.placeholder.com/120'}
                alt={booking.service_name}
                className="bd-service-img"
                onError={e => { e.target.src = 'https://via.placeholder.com/120'; }}
              />
              <div className="bd-service-info">
                <span className="bd-category">{booking.category_name}</span>
                <h2>{booking.service_name}</h2>
                <p className="bd-service-desc">{booking.service_description}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="card bd-details">
              <h3>Booking Details</h3>
              <div className="bd-details-grid">
                <div className="bd-detail-item">
                  <span className="bd-detail-icon">📅</span>
                  <div>
                    <span className="bd-detail-label">Date</span>
                    <span className="bd-detail-value">{formatDate(booking.booking_date)}</span>
                  </div>
                </div>
                <div className="bd-detail-item">
                  <span className="bd-detail-icon">🕐</span>
                  <div>
                    <span className="bd-detail-label">Time</span>
                    <span className="bd-detail-value">{formatTime(booking.booking_time)}</span>
                  </div>
                </div>
                <div className="bd-detail-item">
                  <span className="bd-detail-icon">📍</span>
                  <div>
                    <span className="bd-detail-label">Service Address</span>
                    <span className="bd-detail-value">{booking.address}</span>
                  </div>
                </div>
                {booking.notes && (
                  <div className="bd-detail-item">
                    <span className="bd-detail-icon">📝</span>
                    <div>
                      <span className="bd-detail-label">Special Instructions</span>
                      <span className="bd-detail-value">{booking.notes}</span>
                    </div>
                  </div>
                )}
                <div className="bd-detail-item">
                  <span className="bd-detail-icon">🗓️</span>
                  <div>
                    <span className="bd-detail-label">Booked On</span>
                    <span className="bd-detail-value">
                      {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="bd-sidebar">
            {/* Amount Card */}
            <div className="card bd-amount-card">
              <h3>Payment Summary</h3>
              <div className="amount-row">
                <span>Service Charge</span>
                <span>₹{Number(booking.total_amount).toLocaleString()}</span>
              </div>
              <div className="amount-row">
                <span>Platform Fee</span>
                <span>₹0</span>
              </div>
              <div className="amount-divider" />
              <div className="amount-row amount-total">
                <span>Total</span>
                <span>₹{Number(booking.total_amount).toLocaleString()}</span>
              </div>
              <span className={`badge badge-${booking.status} full-badge`}>
                {STATUS_LABELS[booking.status]}
              </span>
            </div>

            {/* Actions */}
            <div className="bd-actions">
              {['pending', 'confirmed'].includes(booking.status) && (
                <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : '✕ Cancel Booking'}
                </button>
              )}
              <Link to="/services" className="btn btn-secondary">Book Another Service</Link>
            </div>

            {/* Support */}
            <div className="card bd-support">
              <h4>Need Help?</h4>
              <p>Our support team is available 24/7 to assist you with any questions about your booking.</p>
              <a href="tel:+918000000000" className="btn btn-primary btn-sm">📞 Call Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
