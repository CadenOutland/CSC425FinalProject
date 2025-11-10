// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();

// import controller functions
const {
  register,
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;

