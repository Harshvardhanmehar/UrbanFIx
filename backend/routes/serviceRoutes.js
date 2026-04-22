// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllServices, getServiceById, getCategories,
  createService, updateService, deleteService
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllServices);
router.get('/categories/all', getCategories);
router.get('/:id', getServiceById);

// Admin-only routes
router.post('/', protect, adminOnly, [
  body('name').notEmpty().withMessage('Service name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category_id').isInt().withMessage('Category is required'),
], createService);

router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
