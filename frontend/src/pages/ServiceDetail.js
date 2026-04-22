// src/pages/ServiceDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './ServiceDetail.css';

// Category-aware fallback images — same map as ServiceCard for consistency
const CATEGORY_FALLBACKS = {
  'AC & Appliance':   'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700',
  'Cleaning':         'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=700',
  'Plumbing':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700',
  'Electrical':       'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700',
  'Carpentry':        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700',
  'Painting':         'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=700',
  'Pest Control':     'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700',
  'Beauty & Wellness':'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    booking_date: '',
    booking_time: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/services/${id}`)
      .then(r => setService(r.data.service))
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.booking_date) errs.booking_date = 'Please select a date';
    else {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(form.booking_date) < today) errs.booking_date = 'Date must be today or later';
    }
    if (!form.booking_time) errs.booking_time = 'Please select a time slot';
    if (!form.address.trim()) errs.address = 'Service address is required';
    return errs;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleBook = async e => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book a service'); navigate('/login'); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await api.post('/bookings', { service_id: id, ...form });
      toast.success('🎉 Booking confirmed! We\'ll see you soon.');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!service) return null;

  return (
    <div className="service-detail-page">
      <div className="container service-detail-layout">
        {/* ── Left: Service Info ── */}
        <div className="service-info">
          <div className="service-img-wrap">
            <img
              src={service.image_url || CATEGORY_FALLBACKS[service.category_name] || DEFAULT_FALLBACK}
              alt={service.name}
              className="service-img"
              onError={e => {
                e.target.onerror = null;
                e.target.src = CATEGORY_FALLBACKS[service.category_name] || DEFAULT_FALLBACK;
              }}
            />
            <span className="service-category-badge">{service.category_name}</span>
          </div>

          <div className="service-info-body">
            <h1 className="service-name">{service.name}</h1>
            <div className="service-meta-row">
              <span className="stars">{'★'.repeat(Math.round(service.rating))}</span>
              <span className="rating-val">{Number(service.rating).toFixed(1)}</span>
              <span className="rating-count">({service.total_reviews?.toLocaleString()} reviews)</span>
              <span className="meta-sep">•</span>
              <span className="meta-item">⏱️ {service.duration} mins</span>
            </div>

            <div className="service-price-row">
              <span className="detail-price">₹{Number(service.price).toLocaleString()}</span>
              <span className="price-note">All inclusive, no hidden charges</span>
            </div>

            <div className="service-description">
              <h3>About this service</h3>
              <p>{service.description}</p>
            </div>

            {/* Highlights */}
            <div className="service-highlights">
              {['Verified Professional', 'Insured Service', 'Warranty Included', 'On-time Guarantee'].map(h => (
                <span key={h} className="highlight-tag">✅ {h}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Booking Form ── */}
        <div className="booking-panel card">
          <h2 className="booking-title">Book This Service</h2>
          <div className="booking-price-summary">
            <span>{service.name}</span>
            <span className="booking-price-val">₹{Number(service.price).toLocaleString()}</span>
          </div>

          {!user ? (
            <div className="login-prompt">
              <p>Please login to book this service</p>
              <button className="btn btn-primary" onClick={() => navigate('/login', { state: { from: `/services/${id}` } })}>
                Login to Book
              </button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="booking-form" noValidate>
              <div className="form-group">
                <label className="form-label">📅 Select Date</label>
                <input type="date" name="booking_date" value={form.booking_date}
                  onChange={handleChange} min={minDate}
                  className={`form-input ${errors.booking_date ? 'input-error' : ''}`} />
                {errors.booking_date && <span className="form-error">{errors.booking_date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">🕐 Select Time Slot</label>
                <div className="time-slots">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t} type="button"
                      className={`time-slot ${form.booking_time === t ? 'time-slot--active' : ''}`}
                      onClick={() => { setForm(p => ({ ...p, booking_time: t })); setErrors(p => ({ ...p, booking_time: '' })); }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.booking_time && <span className="form-error">{errors.booking_time}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">📍 Service Address</label>
                <textarea name="address" value={form.address} onChange={handleChange}
                  placeholder="Enter your complete address with flat/house number, street, city..."
                  rows={3} className={`form-input ${errors.address ? 'input-error' : ''}`} />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">📝 Special Instructions <span className="optional">(optional)</span></label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any special requests or instructions for the professional..."
                  rows={2} className="form-input" />
              </div>

              <div className="booking-total">
                <span>Total Amount</span>
                <span className="total-val">₹{Number(service.price).toLocaleString()}</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg booking-submit" disabled={submitting}>
                {submitting ? <><span className="btn-spinner" /> Booking...</> : '⚡ Confirm Booking'}
              </button>
              <p className="booking-note">Free cancellation up to 2 hours before the service</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
