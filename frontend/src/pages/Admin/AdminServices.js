// src/pages/Admin/AdminServices.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const EMPTY_FORM = { name: '', category_id: '', price: '', duration: 60, description: '', image_url: '', is_active: true };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try {
      const [sRes, cRes] = await Promise.all([api.get('/services'), api.get('/services/categories/all')]);
      setServices(sRes.data.services);
      setCategories(cRes.data.categories);
    } catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (svc) => {
    setForm({ name: svc.name, category_id: svc.category_id, price: svc.price, duration: svc.duration,
      description: svc.description || '', image_url: svc.image_url || '', is_active: svc.is_active });
    setEditId(svc.id); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setEditId(null); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      if (editId) { await api.put(`/services/${editId}`, form); toast.success('Service updated!'); }
      else { await api.post('/services', form); toast.success('Service created!'); }
      closeModal(); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      setServices(prev => prev.filter(s => s.id !== id));
    } catch { toast.error('Delete failed'); }
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Services</h1>
          <p>{services.length} services in the catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service</button>
      </div>

      <div className="admin-toolbar">
        <input type="text" placeholder="🔍 Search services..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input admin-search" />
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr><th>Service</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="td-service">
                      <img src={s.image_url || 'https://via.placeholder.com/44'} alt={s.name}
                        className="td-service-img"
                        onError={e => { e.target.src = 'https://via.placeholder.com/44'; }} />
                      <div>
                        <div className="td-name">{s.name}</div>
                        <div className="td-email">{s.description?.slice(0, 40)}...</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="cat-pill">{s.category_name}</span></td>
                  <td><strong>₹{Number(s.price).toLocaleString()}</strong></td>
                  <td><span className="stars">★</span> {Number(s.rating).toFixed(1)}</td>
                  <td>
                    <span className={`badge ${s.is_active ? 'badge-completed' : 'badge-cancelled'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="empty-row">No services found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal card">
            <div className="modal-header">
              <h2>{editId ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Service Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-input" required placeholder="e.g. AC Deep Cleaning" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category_id" value={form.category_id} onChange={handleChange} className="form-input" required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className="form-input" required min="0" placeholder="499" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input name="duration" type="number" value={form.duration} onChange={handleChange} className="form-input" min="15" placeholder="60" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="image_url" value={form.image_url} onChange={handleChange} className="form-input" placeholder="https://..." />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="form-input" placeholder="Describe what this service includes..." />
              </div>

              {editId && (
                <label className="toggle-label">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                  <span>Service is Active (visible to customers)</span>
                </label>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
