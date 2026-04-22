// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createBooking, getMyBookings, getBookingById, cancelBooking,
  getAllBookings, updateBookingStatus, getAllUsers, getDashboardStats
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
router.post('/', protect, [
  body('service_id').isInt().withMessage('Service is required'),
  body('booking_date').isDate().withMessage('Valid date is required'),
  body('booking_time').notEmpty().withMessage('Time is required'),
  body('address').notEmpty().withMessage('Address is required'),
], createBooking);

router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.put('/admin/:id/status', protect, adminOnly, updateBookingStatus);
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.get('/admin/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
