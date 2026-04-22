// src/components/Common/ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

// Category-aware fallback images (used when a service image_url fails to load)
const CATEGORY_FALLBACKS = {
  'AC & Appliance': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
  'Cleaning':       'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
  'Plumbing':       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  'Electrical':     'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
  'Carpentry':      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
  'Painting':       'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400',
  'Pest Control':   'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
  'Beauty & Wellness': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400';

const ServiceCard = ({ service }) => {
  const stars = '★'.repeat(Math.round(service.rating)) + '☆'.repeat(5 - Math.round(service.rating));

  return (
    <div className="service-card card">
      <div className="service-card__img-wrap">
        <img
          src={service.image_url || CATEGORY_FALLBACKS[service.category_name] || DEFAULT_FALLBACK}
          alt={service.name}
          className="service-card__img"
          loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.src = CATEGORY_FALLBACKS[service.category_name] || DEFAULT_FALLBACK;
          }}
        />
        <span className="service-card__category">{service.category_name}</span>
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{service.name}</h3>
        <p className="service-card__desc">{service.description?.slice(0, 80)}...</p>

        <div className="service-card__meta">
          <span className="stars" title={`${service.rating} stars`}>{stars}</span>
          <span className="service-card__reviews">({service.total_reviews?.toLocaleString()})</span>
        </div>

        <div className="service-card__footer">
          <div className="service-card__price">
            <span className="price-label">Starts at</span>
            <span className="price-value">₹{Number(service.price).toLocaleString()}</span>
          </div>
          <Link to={`/services/${service.id}`} className="btn btn-primary btn-sm">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
