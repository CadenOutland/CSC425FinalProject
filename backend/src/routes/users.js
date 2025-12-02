// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Profile
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Statistics
router.get('/statistics', auth, userController.getStatistics);

// Delete account
router.delete('/account', auth, userController.deleteAccount);

module.exports = router;

