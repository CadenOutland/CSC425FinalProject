// Clean AI service implementation used by aiService.js wrapper
const OpenAI = require('openai');
const axios = require('axios');
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

// Check which AI provider is configured
const hasOpenAIKey =
  !!process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY !== 'your-openai-api-key';
const hasGeminiKey =
  !!process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'your-gemini-api-key';

let openaiClient = null;
let aiProvider = 'none';

if (hasGeminiKey) {
  aiProvider = 'gemini';
  // eslint-disable-next-line no-console
  console.log('✅ Using Google Gemini for AI generation');
} else if (hasOpenAIKey) {
  try {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    aiProvider = 'openai';
    // eslint-disable-next-line no-console
    console.log('✅ Using OpenAI for AI generation');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('OpenAI client initialization failed:', err.message || err);
    openaiClient = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('⚠️  No AI API key configured. Using mock challenges.');
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
    const {
      category = 'general',
      difficulty = 'medium',
      goalId,
      customPrompt,
      goalTitle,
      goalCategory,
    } = options;

    // Use goalTitle and goalCategory if provided, otherwise fall back to category
    const topic = goalTitle || goalCategory || category;
    const topicCategory = goalCategory || category;

    // Detect language/technology from topic
    const topicLower = topic.toLowerCase();
    let language = 'programming';
    if (topicLower.includes('sql')) language = 'SQL';
    else if (topicLower.includes('python')) language = 'Python';
    else if (topicLower.includes('java') && !topicLower.includes('javascript'))
      language = 'Java';
    else if (topicLower.includes('javascript') || topicLower.includes('js'))
      language = 'JavaScript';
    else if (topicLower.includes('react')) language = 'React';
    else if (topicLower.includes('node')) language = 'Node.js';
    else if (topicLower.includes('html') || topicLower.includes('css'))
      language = 'HTML/CSS';

    // eslint-disable-next-line no-console
    console.log(
      '🎯 AI Challenge Generation - topic:',
      topic,
      'category:',
      topicCategory,
      'difficulty:',
      difficulty,
      'language:',
      language
    );

    // Build the prompt
    const userContent =
      customPrompt && customPrompt.trim().length > 0
        ? customPrompt
        : promptTemplate.buildChallengePrompt({
            topic: topic,
            language: language,
            difficulty,
          });

    // Try Gemini first if configured
    if (aiProvider === 'gemini') {
      try {
        // eslint-disable-next-line no-console
        console.log('🤖 Calling Gemini API...');
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert coding instructor.\n\n${userContent}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 2048,
            },
          }
        );

        // Check for safety blocks or empty responses
        const finishReason = response.data?.candidates?.[0]?.finishReason;
        if (
          finishReason &&
          finishReason !== 'STOP' &&
          finishReason !== 'MAX_TOKENS'
        ) {
          // eslint-disable-next-line no-console
          console.warn(
            `⚠️  Gemini blocked response: ${finishReason}, using fallback`
          );
          const fallback = buildMockChallenge(
            topicCategory,
            difficulty,
            goalId
          );
          if (customPrompt)
            fallback.description += `\n\n[User prompt]: ${customPrompt}`;
          return fallback;
        }

        if (finishReason === 'MAX_TOKENS') {
          // eslint-disable-next-line no-console
          console.warn('⚠️  Gemini hit MAX_TOKENS, using partial response');
        }

        const text =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // eslint-disable-next-line no-console
        console.log('✅ Gemini response received, length:', text.length);

        // Check if response is empty or blocked
        if (!text || text.trim().length === 0) {
          // eslint-disable-next-line no-console
          console.warn('⚠️  Gemini returned empty response, using fallback');
          const fallback = buildMockChallenge(
            topicCategory,
            difficulty,
            goalId
          );
          if (customPrompt)
            fallback.description += `\n\n[User prompt]: ${customPrompt}`;
          return fallback;
        }

        // eslint-disable-next-line no-console
        console.log('📝 Response preview:', text.substring(0, 200));

        // Parse the structured response
        const titleMatch = text.match(/TITLE:\s*(.+)/i);
        const descMatch = text.match(
          /DESCRIPTION:\s*([\s\S]*?)(?=REQUIREMENTS:|EXAMPLES:|HINTS:|$)/i
        );
        const reqMatch = text.match(
          /REQUIREMENTS:\s*([\s\S]*?)(?=EXAMPLES:|HINTS:|$)/i
        );
        const examplesMatch = text.match(/EXAMPLES:\s*([\s\S]*?)(?=HINTS:|$)/i);
        const hintsMatch = text.match(/HINTS:\s*([\s\S]*?)$/i);

        const title = titleMatch
          ? titleMatch[1].trim()
          : `${
              difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            } ${topic} Challenge`;

        const description = descMatch
          ? descMatch[1].trim()
          : text.substring(0, 200);

        // Build instructions from requirements, examples, and hints
        let instructions = '';
        if (reqMatch) {
          instructions += '### Requirements\n' + reqMatch[1].trim() + '\n\n';
        }
        if (examplesMatch) {
          instructions += '### Examples\n' + examplesMatch[1].trim() + '\n\n';
        }
        if (hintsMatch) {
          instructions += '### Hints\n' + hintsMatch[1].trim();
        }

        // If parsing failed, use the full text as instructions
        if (!instructions) {
          instructions = text;
        }

        return {
          id: `ai-${Date.now()}`,
          title,
          description,
          category: topicCategory,
          difficulty,
          points:
            difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50,
          estimatedTime:
            difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 60,
          instructions: instructions || description,
          goalId: goalId || null,
          generatedBy: 'AI-Gemini',
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(
          'Gemini generateChallenge error:',
          err.response?.data || err.message || err
        );
        const fallback = buildMockChallenge(topicCategory, difficulty, goalId);
        if (customPrompt)
          fallback.description += `\n\n[User prompt]: ${customPrompt}`;
        return fallback;
      }
    }

    // Try OpenAI if configured
    if (openaiClient) {
      try {
        const resp = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert coding instructor.' },
            { role: 'user', content: userContent },
          ],
          max_tokens: 800,
          temperature: 0.7,
        });

        const text = parseChatResponse(resp) || '';

        // Parse the structured response
        const titleMatch = text.match(/TITLE:\s*(.+)/i);
        const descMatch = text.match(
          /DESCRIPTION:\s*([\s\S]*?)(?=REQUIREMENTS:|EXAMPLES:|HINTS:|$)/i
        );
        const reqMatch = text.match(
          /REQUIREMENTS:\s*([\s\S]*?)(?=EXAMPLES:|HINTS:|$)/i
        );
        const examplesMatch = text.match(/EXAMPLES:\s*([\s\S]*?)(?=HINTS:|$)/i);
        const hintsMatch = text.match(/HINTS:\s*([\s\S]*?)$/i);

        const title = titleMatch
          ? titleMatch[1].trim()
          : `${
              difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            } ${topic} Challenge`;

        const description = descMatch
          ? descMatch[1].trim()
          : text.substring(0, 200);

        // Build instructions from requirements, examples, and hints
        let instructions = '';
        if (reqMatch) {
          instructions += '### Requirements\n' + reqMatch[1].trim() + '\n\n';
        }
        if (examplesMatch) {
          instructions += '### Examples\n' + examplesMatch[1].trim() + '\n\n';
        }
        if (hintsMatch) {
          instructions += '### Hints\n' + hintsMatch[1].trim();
        }

        // If parsing failed, use the full text as instructions
        if (!instructions) {
          instructions = text;
        }

        return {
          id: `ai-${Date.now()}`,
          title,
          description,
          category: topicCategory,
          difficulty,
          points:
            difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50,
          estimatedTime:
            difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 60,
          instructions: instructions || description,
          goalId: goalId || null,
          generatedBy: 'AI',
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('OpenAI generateChallenge error:', err.message || err);
        const fallback = buildMockChallenge(topicCategory, difficulty, goalId);
        // if customPrompt provided, include it in description for clarity
        if (customPrompt)
          fallback.description += `\n\n[User prompt]: ${customPrompt}`;
        return fallback;
      }
    }
    const fallback = buildMockChallenge(topicCategory, difficulty, goalId);
    if (customPrompt)
      fallback.description += `\n\n[User prompt]: ${customPrompt}`;
    return fallback;
  },

  generateFeedback: async (_userId = null, options = {}) => {
    const {
      challengeTitle = '',
      challengeDescription = '',
      challengeInstructions = '',
      solutionCode = '',
      difficulty = 'medium',
    } = options;

    const prompt = `You are an expert code reviewer providing constructive feedback on a student's solution.

Challenge: ${challengeTitle}
${challengeDescription ? `Description: ${challengeDescription}` : ''}
${challengeInstructions ? `Instructions: ${challengeInstructions}` : ''}
Difficulty: ${difficulty}

Student's Solution:
${solutionCode}

IMPORTANT: First, determine if this is a legitimate coding solution attempt:
- If the submission is NOT actual code or programming logic, give it a score of 1-2
- If it's just random text, explanations without code, or placeholder text, give it a score of 1-2
- If it's code but completely incorrect or doesn't attempt the challenge, give it a score of 3-4
- Only give scores of 5+ for actual code that makes a reasonable attempt at solving the problem

Provide detailed feedback with:
1. **Validity Check**: Is this a genuine code submission attempting to solve the challenge?
2. **Strengths**: What the student did well (if applicable)
3. **Areas for Improvement**: Specific suggestions with examples
4. **Best Practices**: Tips for better code quality
5. **Score**: Rate the solution from 1-10 based on:
   - Is it actual code? (if no, max score is 2)
   - Does it attempt to solve the challenge? (if no, max score is 4)
   - Correctness of the solution
   - Code quality and approach

Format your response as:
SCORE: [number 1-10]

VALIDITY:
[Is this a genuine code submission? Yes/No and why]

STRENGTHS:
[What was done well, or "None - this is not a valid code submission"]

IMPROVEMENTS:
[Specific areas to improve, emphasizing the need for actual code if missing]

BEST PRACTICES:
[Tips and recommendations]`;

    // Try Gemini first
    if (aiProvider === 'gemini') {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1000,
            },
          }
        );

        const text =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse score
        const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

        return {
          feedback: text,
          score: score,
          strengths:
            text
              .match(
                /STRENGTHS:\s*([\s\S]*?)(?=IMPROVEMENTS:|BEST PRACTICES:|$)/i
              )?.[1]
              ?.trim() || '',
          improvements:
            text
              .match(/IMPROVEMENTS:\s*([\s\S]*?)(?=BEST PRACTICES:|$)/i)?.[1]
              ?.trim() || '',
          bestPractices:
            text.match(/BEST PRACTICES:\s*([\s\S]*?)$/i)?.[1]?.trim() || '',
          generatedBy: 'AI-Gemini',
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(
          'Gemini generateFeedback error:',
          err.response?.data || err.message || err
        );
      }
    }

    // Try OpenAI if configured
    if (openaiClient) {
      try {
        const resp = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert code reviewer.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1000,
          temperature: 0.6,
        });

        const text = parseChatResponse(resp) || '';
        const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

        return {
          feedback: text,
          score: score,
          strengths:
            text
              .match(
                /STRENGTHS:\s*([\s\S]*?)(?=IMPROVEMENTS:|BEST PRACTICES:|$)/i
              )?.[1]
              ?.trim() || '',
          improvements:
            text
              .match(/IMPROVEMENTS:\s*([\s\S]*?)(?=BEST PRACTICES:|$)/i)?.[1]
              ?.trim() || '',
          bestPractices:
            text.match(/BEST PRACTICES:\s*([\s\S]*?)$/i)?.[1]?.trim() || '',
          generatedBy: 'AI-OpenAI',
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('OpenAI generateFeedback error:', err.message || err);
      }
    }

    // Fallback mock feedback
    return {
      feedback:
        'Thank you for submitting your solution!\n\nSCORE: 7\n\nSTRENGTHS:\n- Solution addresses the core requirements\n- Code is readable\n\nIMPROVEMENTS:\n- Consider edge cases\n- Add error handling\n\nBEST PRACTICES:\n- Add comments for clarity\n- Consider code organization',
      score: 7,
      strengths: 'Solution addresses the core requirements. Code is readable.',
      improvements: 'Consider edge cases. Add error handling.',
      bestPractices: 'Add comments for clarity. Consider code organization.',
      generatedBy: 'Mock',
      createdAt: new Date().toISOString(),
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
