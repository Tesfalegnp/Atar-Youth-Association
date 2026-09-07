const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation rules for registration (NO password field required)
const validateRegistration = [
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').matches(/^\+211\d{9}$/).withMessage('Valid South Sudan phone required (+211XXXXXXXXX)'),
  body('full_name').trim().notEmpty().withMessage('Full name required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender required'),
  body('date_of_birth').isISO8601().toDate().withMessage('Valid date required'),
  body('county').trim().notEmpty().withMessage('County required'),
  body('payam').trim().notEmpty().withMessage('Payam required')
];

// Validation rules for login
const validateLogin = [
  body('email').notEmpty().withMessage('Email or phone required'),
  body('password').notEmpty().withMessage('Password required')
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('full_name').trim().notEmpty().withMessage('Full name required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender required'),
  body('date_of_birth').isISO8601().toDate().withMessage('Valid date required'),
  body('county').trim().notEmpty().withMessage('County required'),
  body('payam').trim().notEmpty().withMessage('Payam required')
];

// Validation rules for password update
const validatePasswordUpdate = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Validation rules for password reset request
const validateForgot = [
  body('email').isEmail().withMessage('Valid email required')
];

// Validation rules for reset with token
const validateReset = [
  body('token').notEmpty().withMessage('Reset token required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// ========== PUBLIC ROUTES ==========

// User registration (generates temporary password & sends email)
router.post('/register', validateRegistration, authController.registerUser);

// User login
router.post('/login', validateLogin, authController.loginUser);

// Password reset request (Forgot Password)
router.post('/forgot-password', validateForgot, authController.requestPasswordReset);

// Reset password with token
router.post('/reset-password', validateReset, authController.resetPasswordWithToken);

// ========== PROTECTED ROUTES (require authentication) ==========

// Get current user profile
router.get('/me', authenticateToken, authController.getProfile);

// Update user profile (with photo upload)
router.put(
  '/profile',
  authenticateToken,
  authController.upload,
  authController.handleUploadError,
  validateProfileUpdate,
  authController.updateProfile
);

// Update user password
router.put(
  '/password',
  authenticateToken,
  validatePasswordUpdate,
  authController.updatePassword
);

module.exports = router;