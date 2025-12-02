// frontend/src/services/ai.js
// Client-side helpers for talking to the AI endpoints

import api from './api';

export const aiService = {
  // POST /api/ai/feedback
  submitForFeedback: (payload) => api.post('/ai/feedback', payload),

  // GET /api/ai/hints/:challengeId
  getHints: (challengeId) => api.get(`/ai/hints/${challengeId}`),

  // GET /api/ai/suggestions
  suggestChallenges: (params) => api.get('/ai/suggestions', { params }),

  // GET /api/ai/analysis
  getAnalysis: () => api.get('/ai/analysis'),

  // POST /api/ai/generateChallenge (Sprint-3 alias)
  generateChallenge: (body = {}) =>
    api.post('/ai/generateChallenge', body),
};

export default aiService;
