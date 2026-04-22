// src/pages/Services.js
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/Common/ServiceCard';
import './Services.css';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'rating',
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.sort) params.set('sort', filters.sort);

      const { data } = await api.get(`/services?${params}`);
      setServices(data.services);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    api.get('/services/categories/all').then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'rating' });
    setSearchParams({});
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    fetchServices();
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <h1>All Services</h1>
          <p>Find and book trusted professionals for any home service need</p>
          <form className="services-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="🔍  Search services..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              className="form-input services-search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container services-layout">
        {/* ── Sidebar Filters ── */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="clear-btn" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input type="radio" name="category" value="" checked={!filters.category}
                  onChange={() => handleFilter('category', '')} />
                All Categories
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input type="radio" name="category" value={cat.name}
                    checked={filters.category === cat.name}
                    onChange={() => handleFilter('category', cat.name)} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <div className="price-field">
                <label>Minimum</label>
                <div className="price-field-inner">
                  <span className="price-prefix">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={e => handleFilter('minPrice', e.target.value)}
                    className="price-input"
                    min="0"
                  />
                </div>
              </div>
              <div className="price-divider">to</div>
              <div className="price-field">
                <label>Maximum</label>
                <div className="price-field-inner">
                  <span className="price-prefix">₹</span>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChange={e => handleFilter('maxPrice', e.target.value)}
                    className="price-input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <h4>Sort By</h4>
            {[
              { val: 'rating', label: '⭐ Highest Rated' },
              { val: 'price_asc', label: '💰 Price: Low to High' },
              { val: 'price_desc', label: '💰 Price: High to Low' },
              { val: '', label: '🕒 Newest First' },
            ].map(s => (
              <label key={s.val} className="filter-option">
                <input type="radio" name="sort" value={s.val}
                  checked={filters.sort === s.val}
                  onChange={() => handleFilter('sort', s.val)} />
                {s.label}
              </label>
            ))}
          </div>
        </aside>

        {/* ── Services Grid ── */}
        <main className="services-main">
          <div className="services-toolbar">
            <p className="results-count">
              {loading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''} found`}
              {filters.category && <span className="active-filter">{filters.category}</span>}
            </p>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No services found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="services-grid-main">
              {services.map((svc, i) => (
                <div key={svc.id} className={`fade-in-up delay-${(i % 4) + 1}`}>
                  <ServiceCard service={svc} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Services;
