// Clean AI service implementation used by aiService.js wrapper
const OpenAI = require('openai');
const promptTemplate = require('./promptTemplateService');

const buildMockChallenge = (category, difficulty, goalId) => ({
  id: `ai-${Date.now()}`,
  title: `${
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  } ${category} Challenge`,
  description: `An AI-generated ${difficulty} level challenge to test your ${category} skills.`,
  category,
  difficulty,
  points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50,
  estimatedTime: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 60,
  instructions: `Complete this ${category} challenge by solving the problem according to the requirements.`,
  goalId: goalId || null,
  generatedBy: 'AI',
  createdAt: new Date().toISOString(),
});

const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
let openaiClient = null;
if (hasOpenAIKey) {
  try {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('OpenAI client initialization failed:', err.message || err);
    openaiClient = null;
  }
}

const parseChatResponse = (resp) => {
  if (!resp) return null;
  if (resp.choices && resp.choices.length > 0 && resp.choices[0].message) {
    return resp.choices[0].message.content;
  }
  if (resp.choices && resp.choices.length > 0 && resp.choices[0].text) {
    return resp.choices[0].text;
  }
  if (resp.data && resp.data.choices && resp.data.choices.length > 0) {
    return resp.data.choices[0].message?.content || resp.data.choices[0].text;
  }
  return null;
};

const aiServiceImpl = {
  generateChallenge: async (_userId, options = {}) => {
    const { category = 'general', difficulty = 'medium', goalId } = options;
    if (openaiClient) {
      const prompt = promptTemplate.buildChallengePrompt({
        topic: category,
        language: 'javascript',
        difficulty,
      });
      try {
        const resp = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert coding instructor.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.7,
        });

        const text = parseChatResponse(resp) || '';
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        const title =
          lines[0] && lines[0].startsWith('TITLE:')
            ? lines[0].replace(/^TITLE:\s*/i, '')
            : `${
                difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
              } ${category} Challenge`;
        return {
          id: `ai-${Date.now()}`,
          title,
          description: text,
          category,
          difficulty,
          points:
            difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50,
          estimatedTime:
            difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 60,
          instructions: null,
          goalId: goalId || null,
          generatedBy: 'AI',
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('OpenAI generateChallenge error:', err.message || err);
        return buildMockChallenge(category, difficulty, goalId);
      }
    }
    return buildMockChallenge(category, difficulty, goalId);
  },

  generateFeedback: async ({
    _userId = null,
    submission = '',
    submissionType = 'text',
    _challengeId = null,
    context = 'General',
  } = {}) => {
    if (openaiClient) {
      const prompt = promptTemplate.buildFeedbackPrompt({
        submissionType,
        context,
        focusArea: 'overall',
      });
      try {
        const resp = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a constructive reviewer.' },
            {
              role: 'user',
              content: `${prompt}\n\nSubmission:\n${submission}`,
            },
          ],
          max_tokens: 800,
          temperature: 0.6,
        });

        const text = parseChatResponse(resp) || '';
        const strengthsMatch = text.match(
          /STRENGTHS:\s*([\s\S]*?)AREAS FOR IMPROVEMENT:/i
        );
        const improvementsMatch = text.match(
          /AREAS FOR IMPROVEMENT:\s*([\s\S]*?)ACTIONABLE NEXT STEPS:/i
        );
        const nextStepsMatch = text.match(
          /ACTIONABLE NEXT STEPS:\s*([\s\S]*)/i
        );
        const cleanupRegex = /^[-\d.)\s]+/;
        const strengths = strengthsMatch
          ? strengthsMatch[1]
              .split(/\r?\n/)
              .map((s) => s.replace(cleanupRegex, '').trim())
              .filter(Boolean)
          : [];
        const improvements = improvementsMatch
          ? improvementsMatch[1]
              .split(/\r?\n/)
              .map((s) => s.replace(cleanupRegex, '').trim())
              .filter(Boolean)
          : [];
        const nextSteps = nextStepsMatch
          ? nextStepsMatch[1]
              .split(/\r?\n/)
              .map((s) => s.replace(cleanupRegex, '').trim())
              .filter(Boolean)
          : [];
        return {
          strengths,
          improvements,
          nextSteps,
          rawFeedback: text,
          generatedAt: new Date().toISOString(),
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('OpenAI generateFeedback error:', err.message || err);
        throw err;
      }
    }
    // fallback mock
    return {
      strengths: ['Well-structured code', 'Clear variable names'],
      improvements: ['Add edge case handling', 'Add input validation'],
      nextSteps: ['Practice edge cases', 'Add unit tests'],
      rawFeedback:
        'Mock feedback: good job overall. Consider adding edge case handling.',
      generatedAt: new Date().toISOString(),
    };
  },

  generateHints: async (_challengeId, _userProgress) => ({
    hints: [
      'Break the problem down into smaller steps',
      'Consider common edge cases',
    ],
  }),

  analyzePattern: async (_userId, _learningData) => ({
    summary: 'Analysis not implemented yet',
  }),

  suggestNextChallenges: async (_userId) => [
    {
      id: 'ai-sugg-1',
      title: 'Practice: Data Structures',
      difficulty: 'medium',
    },
  ],
};

module.exports = aiServiceImpl;
