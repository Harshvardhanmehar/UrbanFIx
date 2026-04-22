// src/components/Common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <Link to="/" className="footer__logo">⚡ Urban<strong>Serve</strong></Link>
        <p>Your trusted partner for home services. Quality work, guaranteed.</p>
        <div className="footer__socials">
          <a href="#!" aria-label="Facebook">📘</a>
          <a href="#!" aria-label="Twitter">🐦</a>
          <a href="#!" aria-label="Instagram">📸</a>
        </div>
      </div>

      <div className="footer__col">
        <h4>Services</h4>
        <ul>
          <li><Link to="/services?category=AC & Appliance">AC Repair</Link></li>
          <li><Link to="/services?category=Cleaning">Cleaning</Link></li>
          <li><Link to="/services?category=Plumbing">Plumbing</Link></li>
          <li><Link to="/services?category=Electrical">Electrical</Link></li>
          <li><Link to="/services?category=Painting">Painting</Link></li>
        </ul>
      </div>

      <div className="footer__col">
        <h4>Company</h4>
        <ul>
          <li><a href="#!">About Us</a></li>
          <li><a href="#!">Careers</a></li>
          <li><a href="#!">Blog</a></li>
          <li><a href="#!">Press</a></li>
        </ul>
      </div>

      <div className="footer__col">
        <h4>Support</h4>
        <ul>
          <li><a href="#!">Help Center</a></li>
          <li><a href="#!">Contact Us</a></li>
          <li><a href="#!">Privacy Policy</a></li>
          <li><a href="#!">Terms of Service</a></li>
        </ul>
      </div>
    </div>

    <div className="footer__bottom">
      <div className="container">
        <p>© {new Date().getFullYear()} UrbanServe. All rights reserved. Built with ❤️ for college submission.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
