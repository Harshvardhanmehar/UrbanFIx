// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: 'calc(100vh - 68px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
  }}>
    <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, marginBottom: 8 }}>404</h1>
    <h2 style={{ fontSize: 22, marginBottom: 12, color: 'var(--text-primary)' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, maxWidth: 400 }}>
      The page you are looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: 'flex', gap: 12 }}>
      <Link to="/" className="btn btn-primary">Go Home</Link>
      <Link to="/services" className="btn btn-secondary">Browse Services</Link>
    </div>
  </div>
);

export default NotFound;
