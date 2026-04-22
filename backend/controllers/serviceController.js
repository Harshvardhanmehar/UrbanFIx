// controllers/serviceController.js - Services CRUD Logic
const db = require('../config/db');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/services
 * @desc    Get all active services (with optional filters)
 * @access  Public
 */
const getAllServices = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = `
      SELECT s.*, c.name AS category_name
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.is_active = TRUE
    `;
    const params = [];

    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (s.name LIKE ? OR s.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      query += ' AND s.price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND s.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc') query += ' ORDER BY s.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY s.price DESC';
    else if (sort === 'rating') query += ' ORDER BY s.rating DESC';
    else query += ' ORDER BY s.created_at DESC';

    const [services] = await db.query(query, params);

    res.json({ success: true, count: services.length, services });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/services/:id
 * @desc    Get single service by ID
 * @access  Public
 */
const getServiceById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, c.name AS category_name
       FROM services s LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.json({ success: true, service: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/services/categories/all
 * @desc    Get all categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/services
 * @desc    Create a new service (Admin)
 * @access  Admin
 */
const createService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, category_id, price, duration, description, image_url } = req.body;

    const [result] = await db.query(
      'INSERT INTO services (name, category_id, price, duration, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id, price, duration || 60, description, image_url]
    );

    const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Service created.', service: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/services/:id
 * @desc    Update a service (Admin)
 * @access  Admin
 */
const updateService = async (req, res, next) => {
  try {
    const { name, category_id, price, duration, description, image_url, is_active } = req.body;

    const [existing] = await db.query('SELECT id FROM services WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await db.query(
      `UPDATE services SET name=?, category_id=?, price=?, duration=?, description=?, image_url=?, is_active=? WHERE id=?`,
      [name, category_id, price, duration, description, image_url, is_active, req.params.id]
    );

    const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Service updated.', service: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service (Admin)
 * @access  Admin
 */
const deleteService = async (req, res, next) => {
  try {
    const [existing] = await db.query('SELECT id FROM services WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllServices, getServiceById, getCategories, createService, updateService, deleteService };
