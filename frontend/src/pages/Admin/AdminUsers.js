// src/pages/Admin/AdminUsers.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/bookings/admin/users')
      .then(r => setUsers(r.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const admins = users.filter(u => u.role === 'admin').length;
  const customers = users.filter(u => u.role === 'user').length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>All Users</h1>
          <p>{customers} customer{customers !== 1 ? 's' : ''} · {admins} admin{admins !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input type="text" placeholder="🔍 Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input admin-search" />
        <div className="user-summary-chips">
          <span className="user-chip user-chip--total">Total: {users.length}</span>
          <span className="user-chip user-chip--customer">Customers: {customers}</span>
          <span className="user-chip user-chip--admin">Admins: {admins}</span>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td><span className="booking-id">#{u.id}</span></td>
                  <td>
                    <div className="td-user">
                      <span className="td-avatar" style={{
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                          : 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))'
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="td-name">{u.name}</div>
                        <div className="td-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="td-phone">{u.phone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-confirmed' : 'badge-completed'}`}>
                      {u.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                    </span>
                  </td>
                  <td>
                    <span className="td-email">
                      {new Date(u.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
