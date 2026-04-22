// controllers/bookingController.js - Booking Logic
const db = require('../config/db');
const { validationResult } = require('express-validator');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (User)
 */
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { service_id, booking_date, booking_time, address, notes } = req.body;
    const user_id = req.user.id;

    // Fetch service price
    const [svc] = await db.query('SELECT price FROM services WHERE id = ? AND is_active = TRUE', [service_id]);
    if (svc.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found or inactive.' });
    }

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, service_id, booking_date, booking_time, address, notes, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, service_id, booking_date, booking_time, address, notes || null, svc[0].price]
    );

    const [booking] = await db.query(
      `SELECT b.*, s.name AS service_name, s.image_url, u.name AS user_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Booking confirmed!', booking: booking[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Get logged-in user's bookings
 * @access  Private (User)
 */
const getMyBookings = async (req, res, next) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.*, s.name AS service_name, s.image_url, s.category_id, c.name AS category_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking detail
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, s.name AS service_name, s.description AS service_description, s.image_url,
              u.name AS user_name, u.email AS user_email, u.phone AS user_phone,
              c.name AS category_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = rows[0];

    // Ensure user can only view their own booking (unless admin)
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private (User)
 */
const cancelBooking = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    const booking = rows[0];

    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking.` });
    }

    await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: 'Booking cancelled.' });
  } catch (err) {
    next(err);
  }
};

// ── ADMIN CONTROLLERS ──────────────────────────────────────────────

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings (Admin)
 * @access  Admin
 */
const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT b.*, s.name AS service_name, u.name AS user_name, u.email AS user_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
    `;
    const params = [];
    if (status) { query += ' WHERE b.status = ?'; params.push(status); }
    query += ' ORDER BY b.created_at DESC';

    const [bookings] = await db.query(query, params);
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/admin/bookings/:id/status
 * @desc    Update booking status (Admin)
 * @access  Admin
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Booking status updated.' });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (Admin)
 * @access  Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Dashboard stats
 * @access  Admin
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role='user'");
    const [[{ totalBookings }]] = await db.query("SELECT COUNT(*) AS totalBookings FROM bookings");
    const [[{ totalServices }]] = await db.query("SELECT COUNT(*) AS totalServices FROM services WHERE is_active=TRUE");
    const [[{ totalRevenue }]] = await db.query("SELECT SUM(total_amount) AS totalRevenue FROM bookings WHERE status='completed'");
    const [[{ pendingBookings }]] = await db.query("SELECT COUNT(*) AS pendingBookings FROM bookings WHERE status='pending'");

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalServices,
        totalRevenue: totalRevenue || 0,
        pendingBookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking, getMyBookings, getBookingById, cancelBooking,
  getAllBookings, updateBookingStatus, getAllUsers, getDashboardStats,
};
