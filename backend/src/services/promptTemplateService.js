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
You are an expert coding instructor creating a practical ${difficulty} level challenge focused on ${topic}.

IMPORTANT: Create a UNIQUE and CREATIVE challenge. DO NOT create generic/repetitive challenges like:
- Tip calculators
- Simple shopping carts
- Basic todo lists
- Temperature converters
- Grade calculators

Instead, create interesting challenges such as:
- Game mechanics (card games, puzzles, board game logic)
- Data processing (parsing files, analyzing patterns, text manipulation)
- Algorithm challenges (sorting with constraints, pathfinding, optimization)
- Simulation problems (traffic systems, resource management, scheduling)
- Real-world scenarios (event scheduling, inventory systems, recommendation engines)
- Mathematical problems (prime numbers, geometry, statistics)
- String manipulation (text encryption, pattern matching, formatting)

Create a hands-on coding challenge that:
1. Is ${description}
2. Tests practical ${topic} skills
3. Has a clear problem to solve
4. Can be completed and tested by a student
5. Is CREATIVE and DIFFERENT from typical beginner exercises

Provide the challenge in this EXACT format:

TITLE: [A concise, specific challenge title - make it unique!]

DESCRIPTION: [A clear problem statement that explains what the student needs to build or solve. Be specific about the scenario and what they're creating. Make it engaging and interesting!]

REQUIREMENTS:
- [Specific requirement 1 - what the solution MUST do]
- [Specific requirement 2 - expected functionality]
- [Additional requirements - be detailed and testable]
${difficulty === 'easy' ? '(Include 2-4 requirements)' : difficulty === 'medium' ? '(Include 4-6 requirements)' : '(Include 6-8 requirements)'}

EXAMPLES:
[Provide ${difficulty === 'easy' ? '2-3' : difficulty === 'medium' ? '3-4' : '4-5'} concrete examples showing:]
Input: [What input or scenario]
Output: [What the expected result should be]
[Add more examples to cover different cases]

HINTS:
- [Helpful hint about approach - not the full solution]
- [Concept or technique to use]
${difficulty !== 'easy' ? '- [Consider edge cases or optimization]' : ''}
${difficulty === 'hard' ? '- [Advanced technique or pattern]' : ''}

Make this a REAL, practical challenge that students can actually implement and test.`.trim();
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
