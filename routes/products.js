const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Games', 'Consoles', 'Accessories', 'Controllers', 'Cases & Protection', 'Memory & Storage', 'Cables & Adapters', 'Stands & Grips'])
    .withMessage('Please select a valid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required')
];

// Review validation
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Comment must be between 5 and 500 characters')
];

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), productValidation, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews')
  .post(protect, reviewValidation, addReview);

module.exports = router;
