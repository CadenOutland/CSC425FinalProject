// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

// Register
router.post('/register', validation.registerValidation, authController.register);
router.post('/signup', validation.registerValidation, authController.register);

// Login
router.post('/login', validation.loginValidation, authController.login);

// Logout (revokes refresh token)
router.post('/logout', authController.logout);

// Refresh JWT
router.post('/refresh', authController.refresh);

module.exports = router;

