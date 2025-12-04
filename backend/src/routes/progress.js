// TODO: Implement progress routes
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

// GET / - user progress overview (legacy)
router.get('/', auth, progressController.getProgress);

// GET /overview - explicit overview endpoint used by frontend
router.get('/overview', auth, progressController.getProgress);

// GET /activity - get recent activity events
router.get('/activity', auth, progressController.getActivity);

// TODO: Add POST /event route for tracking progress events
router.post('/event', auth, progressController.updateProgress);

// TODO: Add GET /analytics route for progress analytics
router.get('/analytics', auth, progressController.getAnalytics);

// TODO: Add GET /milestones route for milestone tracking
router.get('/milestones', auth, progressController.getMilestones);

module.exports = router;
