// backend/src/routes/progress.js
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.get('/overview', progressController.getOverview);
router.get('/stats', progressController.getStats);

module.exports = router;
