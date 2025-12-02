// backend/src/routes/progress.js
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

// Overview
router.get('/', auth, progressController.getProgress);

// /overview (frontend uses this)
router.get('/overview', auth, progressController.getProgress);

// Create event
router.post('/event', auth, progressController.updateProgress);

// Analytics
router.get('/analytics', auth, progressController.getAnalytics);

// Milestones
router.get('/milestones', auth, progressController.getMilestones);

module.exports = router;

