// TODO: Implement authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

// POST /login
router.post('/login', validation.loginValidation, authController.login);

// POST /register (legacy) and POST /signup (preferred)
router.post('/register', validation.registerValidation, authController.register);
router.post('/signup', validation.registerValidation, authController.register);

// TODO: Add POST /logout route
router.post('/logout', authController.logout);

// TODO: Add POST /refresh route
router.post('/refresh', authController.refreshToken);

// TODO: Add POST /forgot-password route
// router.post('/forgot-password', authController.forgotPassword);

// TODO: Add POST /reset-password route
// router.post('/reset-password', authController.resetPassword);

module.exports = router;