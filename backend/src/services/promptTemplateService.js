/**
 * Prompt Template Service
 * Generates reusable AI prompts with placeholders for topic, language, and difficulty
 */

const promptTemplate = {
  /**
   * Build a coding challenge prompt
   * @param {Object} options - { topic, language, difficulty }
   * @returns {string} The formatted prompt
   */
  buildChallengePrompt: (options = {}) => {
    const {
      topic = 'general',
      language = 'javascript',
      difficulty = 'medium',
    } = options;

    const difficultyDescriptions = {
      easy: 'beginner-friendly, with clear requirements',
      medium:
        'moderate complexity, requiring solid understanding of core concepts',
      hard: 'advanced, combining multiple concepts and edge cases',
    };

    const description =
      difficultyDescriptions[difficulty] || difficultyDescriptions.medium;

    return `
You are an expert ${language} instructor. Create a ${difficulty} level coding challenge focused on ${topic}.

Requirements:
1. The challenge should be ${description}.
2. Provide a clear title (one line).
3. Include a detailed description of the problem.
4. List the specific requirements and expected behavior.
5. Include example input/output if applicable.
6. Suggest ${
      difficulty === 'easy' ? '2-3' : difficulty === 'medium' ? '3-5' : '5-7'
    } test cases.
7. Provide hints for the solution approach (not the solution itself).

Format the response as follows:
TITLE: [Challenge Title]
DESCRIPTION: [Problem description]
REQUIREMENTS:
- [Requirement 1]
- [Requirement 2]
...
EXAMPLES:
Input: [example input]
Output: [example output]
...
HINTS:
- [Hint 1]
- [Hint 2]
...
`.trim();
  },

  /**
   * Build a feedback prompt
   * @param {Object} options - { submissionType, context, focusArea }
   * @returns {string} The formatted prompt
   */
  buildFeedbackPrompt: (options = {}) => {
    const {
      submissionType = 'code',
      context = 'General',
      focusArea = 'overall',
    } = options;

    return `
You are a constructive ${submissionType} reviewer. Provide feedback on the following submission in the context of: ${context}.

Focus areas:
- Code quality (readability, maintainability, efficiency)
- Correctness and completeness
- ${focusArea === 'overall' ? 'All aspects' : `Specific focus on ${focusArea}`}

Provide feedback in this format:
STRENGTHS:
- [Strength 1]
- [Strength 2]
...
AREAS FOR IMPROVEMENT:
- [Issue 1]: [Suggestion]
- [Issue 2]: [Suggestion]
...
ACTIONABLE NEXT STEPS:
1. [Step 1]
2. [Step 2]
...

Be encouraging while providing constructive criticism.
`.trim();
  },

  /**
   * Build a hints prompt
   * @param {Object} options - { challengeTitle, difficulty }
   * @returns {string} The formatted prompt
   */
  buildHintsPrompt: (options = {}) => {
    const { challengeTitle = 'the challenge', difficulty = 'medium' } = options;

    const hintCount =
      difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;

    return `
Given the challenge: "${challengeTitle}"

Provide ${hintCount} progressive hints that guide the solver without revealing the solution.
Each hint should build on the previous one.

Format:
HINT 1: [Initial guidance about approach]
HINT 2: [Suggest a specific technique or data structure]
HINT ${hintCount}: [Hint about edge cases or optimization]
`.trim();
  },
};

module.exports = promptTemplate;
