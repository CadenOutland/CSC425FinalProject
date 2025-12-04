// TODO: Implement peer review system controller
const peerReviewService = require('../services/peerReviewService');
const aiService = require('../services/aiService');
const progressService = require('../services/progressService');
const goalService = require('../services/goalService');

const peerReviewController = {
  // Submit solution for peer review (from AI challenge generator)
  submitForReview: async (req, res, next) => {
    try {
      const {
        challengeId,
        challengeTitle,
        challengeDescription,
        challengeInstructions,
        solutionCode,
        difficulty,
      } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!challengeTitle || !solutionCode) {
        return res.status(400).json({
          success: false,
          message: 'Challenge title and solution are required',
        });
      }

      // Get AI feedback on the solution
      let aiFeedback;
      try {
        aiFeedback = await aiService.generateFeedback(userId, {
          challengeTitle,
          challengeDescription,
          challengeInstructions,
          solutionCode,
          difficulty,
        });

        // Ensure feedback is never empty
        if (
          !aiFeedback ||
          !aiFeedback.feedback ||
          aiFeedback.feedback.trim() === ''
        ) {
          console.warn('AI feedback was empty, using fallback');
          aiFeedback = {
            feedback: `Thank you for submitting your solution to "${challengeTitle}"!\n\nSCORE: 7\n\nSTRENGTHS:\n- You took the initiative to complete the challenge\n- Your solution addresses the problem requirements\n\nIMPROVEMENTS:\n- Consider adding comments to explain your approach\n- Test your solution with different inputs to ensure it handles edge cases\n\nBEST PRACTICES:\n- Break down complex problems into smaller, manageable functions\n- Use meaningful variable and function names\n- Consider performance and scalability for larger inputs`,
            score: 7,
            generatedBy: 'Fallback',
          };
        }
      } catch (err) {
        console.error('Error generating AI feedback, using fallback:', err);
        aiFeedback = {
          feedback: `Thank you for submitting your solution to "${challengeTitle}"!\n\nSCORE: 7\n\nSTRENGTHS:\n- You completed the challenge and submitted your work\n- Shows engagement with the learning material\n\nIMPROVEMENTS:\n- Review the challenge requirements carefully\n- Consider different approaches to solving the problem\n- Test your code thoroughly before submission\n\nBEST PRACTICES:\n- Write clean, readable code\n- Add comments to explain complex logic\n- Handle potential errors gracefully`,
          score: 7,
          generatedBy: 'Fallback',
        };
      }

      // Create the submission
      const submission = await peerReviewService.createSubmission({
        userId,
        challengeId,
        challengeTitle,
        challengeDescription,
        solutionCode,
        difficulty,
        aiFeedback: aiFeedback.feedback,
        aiScore: aiFeedback.score,
      });

      // Award points if AI score >= 5
      let pointsAwarded = 0;
      let goalUpdated = null;
      if (aiFeedback.score >= 5) {
        // Calculate points based on difficulty
        const difficultyPoints = {
          easy: 10,
          beginner: 10,
          intermediate: 20,
          medium: 20,
          advanced: 30,
          hard: 30,
        };
        pointsAwarded = difficultyPoints[difficulty?.toLowerCase()] || 10;

        // Record progress event with points
        await progressService.trackEvent(userId, 'progress', {
          challengeId: challengeId || `ai-${Date.now()}`,
          score: aiFeedback.score,
          completed: true,
          points: pointsAwarded,
          timeSpent: 0,
        });

        // Update goal progress if goalId is available (from req.body)
        if (req.body.goalId) {
          try {
            goalUpdated = await goalService.incrementGoalProgress(
              req.body.goalId,
              difficulty
            );
            // If goal just completed, increment user_statistics goal count
            if (goalUpdated.completedJustNow) {
              await progressService.incrementGoalsCompleted(userId, 1);
            }
          } catch (err) {
            console.error('Error updating goal progress:', err);
          }
        }
      }

      res.status(201).json({
        success: true,
        message: 'Solution submitted successfully',
        data: {
          submission,
          aiFeedback,
          pointsAwarded,
          goalUpdated: goalUpdated
            ? {
                id: goalUpdated.id,
                progress: goalUpdated.progress_percentage,
                isCompleted: goalUpdated.is_completed,
              }
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user's own submissions
  getMySubmissions: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const submissions = await peerReviewService.getSubmissionsByUser(userId);

      res.json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get submissions available for peer review
  getReviewQueue: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { category } = req.query;

      const submissions = await peerReviewService.getAvailableForReview(
        userId,
        category
      );

      res.json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  },

  // TODO: Get reviews to complete
  getReviewAssignments: async (req, res, next) => {
    // Implementation needed
  },

  // TODO: Submit peer review
  submitReview: async (req, res, next) => {
    try {
      const { reviewText, rating } = req.body;
      const submissionId = req.params.submissionId || req.body.submissionId;
      const reviewerId = req.user.id;

      if (!reviewText || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Review text and rating are required',
        });
      }

      // Enforce rating range per DB constraint (1-5)
      const numericRating = Number(rating);
      if (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be an integer between 1 and 5',
        });
      }

      const review = await peerReviewService.addReview({
        submissionId,
        reviewerId,
        reviewText,
        rating: numericRating,
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  // TODO: Get received reviews
  getReceivedReviews: async (req, res, next) => {
    // Implementation needed
  },

  // TODO: Get review history
  getReviewHistory: async (req, res, next) => {
    // Implementation needed
  },
};

module.exports = peerReviewController;
