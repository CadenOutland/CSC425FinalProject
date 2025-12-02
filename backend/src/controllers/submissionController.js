const submissionService = require('../services/submissionService');
const { AppError } = require('../middleware/errorHandler');

const submissionController = {
  // POST /submissions
  submitWork: async (req, res, next) => {
    try {
      const { challengeId, submissionText, submissionFiles } = req.body;

      if (!challengeId) throw new AppError('challengeId is required', 400);
      if (!submissionText) throw new AppError('submissionText is required', 400);

      const submission = await submissionService.submitSolution({
        userId: req.user.id,
        challengeId,
        submissionText,
        submissionFiles: submissionFiles || null,
      });

      res.status(201).json({
        message: 'Submission created successfully',
        submission,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /submissions/:id
  getSubmission: async (req, res, next) => {
    try {
      const result = await submissionService.getSubmissionById(req.params.id);

      if (!result) throw new AppError('Submission not found', 404);

      res.json({ submission: result });
    } catch (err) {
      next(err);
    }
  },

  // GET /submissions/user/:userId
  getUserSubmissions: async (req, res, next) => {
    try {
      const list = await submissionService.getUserSubmissions(req.params.userId);

      res.json({ submissions: list });
    } catch (err) {
      next(err);
    }
  },

  // PUT /submissions/:id
  updateSubmission: async (req, res, next) => {
    try {
      const updated = await submissionService.updateSubmissionStatus(
        req.params.id,
        req.body.status
      );

      res.json({
        message: 'Submission updated successfully',
        submission: updated,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = submissionController;

