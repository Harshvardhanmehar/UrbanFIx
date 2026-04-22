// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/Common/ServiceCard';
import './Home.css';

// ── Category Config: photo image + SVG icon + accent color per category ─
const CATEGORY_CONFIG = {
  'AC & Appliance': {
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    accent: '#0ea5e9',
    tag: '5 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="8" rx="2"/>
        <path d="M7 14v4M12 14v4M17 14v4"/>
        <path d="M6 10h.01M10 10h4"/>
      </svg>
    ),
  },
  'Cleaning': {
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80',
    accent: '#16a34a',
    tag: '5 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l9-9"/>
        <path d="M12.5 4.5a4.5 4.5 0 0 1 6 6l-1 1-6-6 1-1z"/>
        <path d="M12 12l-8.5 8.5a1 1 0 0 0 1.5 1.5L13 13"/>
      </svg>
    ),
  },
  'Plumbing': {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    accent: '#2563eb',
    tag: '5 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/>
        <path d="M14 9h2l4 4-4 4h-2"/>
        <path d="M6 12v0"/>
      </svg>
    ),
  },
  'Electrical': {
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
    accent: '#d97706',
    tag: '5 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  'Carpentry': {
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
    accent: '#ea580c',
    tag: '3 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20"/>
        <path d="M5 20V8l7-6 7 6v12"/>
        <path d="M9 20v-6h6v6"/>
      </svg>
    ),
  },
  'Painting': {
    image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80',
    accent: '#9333ea',
    tag: '3 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
        <path d="M7 14l3-3 2 2 3-4 3 5"/>
      </svg>
    ),
  },
  'Pest Control': {
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    accent: '#15803d',
    tag: '3 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8"/>
        <path d="M12 2v4"/>
        <ellipse cx="12" cy="12" rx="4" ry="6"/>
        <path d="M8 8l-4-2M16 8l4-2"/>
        <path d="M8 12H4M20 12h-4"/>
        <path d="M8 16l-4 2M16 16l4 2"/>
      </svg>
    ),
  },
  'Beauty & Wellness': {
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    accent: '#e11d48',
    tag: '3 Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
};

const HERO_STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '200+', label: 'Skilled Professionals' },
  { value: '25+', label: 'Service Categories' },
  { value: '4.8★', label: 'Average Rating' },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services/categories/all').then(r => setCategories(r.data.categories)).catch(() => {});
    api.get('/services?sort=rating').then(r => setFeatured(r.data.services.slice(0, 8))).catch(() => {});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="home">
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
        </div>
        <div className="container hero__content">
          <div className="hero__text fade-in-up">
            <span className="hero__tag">🏆 India's #1 Home Services App</span>
            <h1 className="hero__title">
              Expert Home Services<br />
              <span className="hero__title--accent">At Your Doorstep</span>
            </h1>
            <p className="hero__subtitle">
              Book trusted professionals for AC repair, cleaning, plumbing,
              electrical work & more — in just 60 seconds.
            </p>
            <form className="hero__search" onSubmit={handleSearch}>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search for a service (e.g. AC repair, cleaning...)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-primary search-btn">Search</button>
              </div>
            </form>
            <div className="hero__tags">
              {['CoolBreeze AC', 'PureHome Cleaning', 'LeakStop Plumbing', 'SafeWire Electrical'].map(tag => (
                <Link key={tag} to={`/services?search=${tag}`} className="hero__tag-pill">{tag}</Link>
              ))}
            </div>
          </div>
          <div className="hero__visual fade-in-up delay-2">
            <div className="hero__img-card">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600" alt="Professional home services" />
              <div className="hero__badge hero__badge--1">✅ Verified Pros</div>
              <div className="hero__badge hero__badge--2">⚡ 60-min Booking</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="hero__stats">
          <div className="container stats-inner">
            {HERO_STATS.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-sub">Find the right service for your home</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => {
              const cfg = CATEGORY_CONFIG[cat.name] || {};
              return (
                <Link
                  key={cat.id}
                  to={`/services?category=${encodeURIComponent(cat.name)}`}
                  className={`cat-card fade-in-up delay-${(i % 4) + 1}`}
                >
                  {/* Background photo */}
                  {cfg.image && (
                    <img
                      src={cfg.image}
                      alt={cat.name}
                      className="cat-bg-img"
                      loading="lazy"
                    />
                  )}
                  {/* Dark gradient overlay */}
                  <div className="cat-overlay" />
                  {/* Content on top */}
                  <div className="cat-content">
                    <div
                      className="cat-icon-wrap"
                      style={{ background: cfg.accent ? `${cfg.accent}cc` : 'rgba(99,102,241,0.8)' }}
                    >
                      {cfg.icon || <span style={{ fontSize: 22, color: '#fff' }}>🛠️</span>}
                    </div>
                    <span className="cat-name">{cat.name}</span>
                    {cfg.tag && <span className="cat-tag">{cfg.tag}</span>}
                    <span className="cat-cta">Explore →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose UrbanServe?</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: '🛡️', title: 'Verified Professionals', desc: 'All our service providers are background-checked, trained, and certified.' },
              { icon: '💳', title: 'Transparent Pricing', desc: 'No hidden charges. Pay exactly what you see before booking.' },
              { icon: '🔁', title: 'Service Guarantee', desc: "Not satisfied? We'll redo the job for free or give you a full refund." },
              { icon: '📞', title: '24/7 Support', desc: 'Our customer care team is always ready to assist you at any time.' },
            ].map((w, i) => (
              <div key={w.title} className={`why-card card fade-in-up delay-${i + 1}`}>
                <span className="why-icon">{w.icon}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Services ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Services</h2>
            <Link to="/services" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          <div className="services-grid">
            {featured.map((svc, i) => (
              <div key={svc.id} className={`fade-in-up delay-${(i % 4) + 1}`}>
                <ServiceCard service={svc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">Book a service in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', icon: '🔍', title: 'Choose a Service', desc: 'Browse our wide range of home services and pick what you need.' },
              { step: '02', icon: '📅', title: 'Select Date & Time', desc: 'Pick a convenient slot that works perfectly for your schedule.' },
              { step: '03', icon: '🏠', title: 'Relax at Home', desc: 'Our verified professional will arrive and get the job done.' },
            ].map(s => (
              <div key={s.step} className="step-card">
                <div className="step-num">{s.step}</div>
                <span className="step-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to book your first service?</h2>
            <p>Join 50,000+ happy customers who trust UrbanServe</p>
          </div>
          <div className="cta-actions">
            <Link to="/services" className="btn btn-primary btn-lg">Explore Services</Link>
            <Link to="/register" className="btn cta-secondary-btn btn-lg">Sign Up Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
