// src/pages/Profile.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return; }
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser(data.user);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
    { label: 'Account Type', value: user?.role === 'admin' ? '👑 Admin' : '👤 Customer' },
    { label: 'Email Status', value: '✅ Verified' },
  ];

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-grid">
          {/* ── Left: Avatar + Stats ── */}
          <div className="profile-left">
            <div className="card profile-avatar-card">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              {user?.phone && <p className="profile-phone">📞 {user?.phone}</p>}
            </div>

            <div className="card profile-stats-card">
              {stats.map(s => (
                <div key={s.label} className="profile-stat">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Edit Form ── */}
          <div className="profile-right">
            <div className="card profile-form-card">
              <h3>Personal Information</h3>
              <form onSubmit={handleSave} noValidate>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      className={`form-input ${errors.name ? 'input-error' : ''}`} />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" value={user?.email} disabled
                      className="form-input form-input--disabled" />
                    <span className="form-hint">Email cannot be changed</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="10-digit phone number" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Role</label>
                    <input type="text" value={user?.role === 'admin' ? 'Administrator' : 'Customer'}
                      disabled className="form-input form-input--disabled" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary save-btn" disabled={saving}>
                  {saving ? <><span className="btn-spinner" /> Saving...</> : '💾 Save Changes'}
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="card profile-links-card">
              <h3>Quick Actions</h3>
              <div className="quick-links">
                <a href="/bookings" className="quick-link">
                  <span className="ql-icon">📋</span>
                  <span>View My Bookings</span>
                  <span className="ql-arrow">→</span>
                </a>
                <a href="/services" className="quick-link">
                  <span className="ql-icon">🛠️</span>
                  <span>Browse Services</span>
                  <span className="ql-arrow">→</span>
                </a>
                {user?.role === 'admin' && (
                  <a href="/admin" className="quick-link">
                    <span className="ql-icon">⚙️</span>
                    <span>Admin Panel</span>
                    <span className="ql-arrow">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
