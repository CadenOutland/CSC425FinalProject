// backend/src/routes/submissions.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');

// Submit work
router.post('/', auth, submissionController.submitWork);

// Get specific submission
router.get('/:id', auth, submissionController.getSubmission);

// User submissions
router.get('/user/:userId', auth, submissionController.getUserSubmissions);

// Update submission
router.put('/:id', auth, submissionController.updateSubmission);

module.exports = router;

