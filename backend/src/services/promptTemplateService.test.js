import promptTemplate from '../promptTemplateService';

describe('Prompt Template Service', () => {
  describe('buildChallengePrompt', () => {
    it('should generate challenge prompt with default options', () => {
      const prompt = promptTemplate.buildChallengePrompt();

      expect(prompt).toContain('expert javascript instructor');
      expect(prompt).toContain('medium level');
      expect(prompt).toContain('general');
    });

    it('should include difficulty level in prompt description', () => {
      const easyPrompt = promptTemplate.buildChallengePrompt({
        difficulty: 'easy',
      });
      const hardPrompt = promptTemplate.buildChallengePrompt({
        difficulty: 'hard',
      });

      expect(easyPrompt).toContain('beginner-friendly');
      expect(hardPrompt).toContain('advanced');
    });

    it('should include topic in prompt', () => {
      const prompt = promptTemplate.buildChallengePrompt({
        topic: 'array-manipulation',
      });
      expect(prompt).toContain('array-manipulation');
    });

    it('should include language in prompt', () => {
      const prompt = promptTemplate.buildChallengePrompt({
        language: 'python',
      });
      expect(prompt).toContain('python');
    });

    it('should include all required sections', () => {
      const prompt = promptTemplate.buildChallengePrompt();

      expect(prompt).toContain('TITLE:');
      expect(prompt).toContain('DESCRIPTION:');
      expect(prompt).toContain('REQUIREMENTS:');
      expect(prompt).toContain('EXAMPLES:');
      expect(prompt).toContain('HINTS:');
    });

    it('should suggest appropriate number of test cases based on difficulty', () => {
      const easyPrompt = promptTemplate.buildChallengePrompt({
        difficulty: 'easy',
      });
      const hardPrompt = promptTemplate.buildChallengePrompt({
        difficulty: 'hard',
      });

      expect(easyPrompt).toContain('2-3');
      expect(hardPrompt).toContain('5-7');
    });

    it('should match snapshot for easy difficulty', () => {
      const prompt = promptTemplate.buildChallengePrompt({
        topic: 'loops',
        language: 'javascript',
        difficulty: 'easy',
      });

      expect(prompt).toMatchSnapshot();
    });

    it('should match snapshot for hard difficulty', () => {
      const prompt = promptTemplate.buildChallengePrompt({
        topic: 'dynamic-programming',
        language: 'python',
        difficulty: 'hard',
      });

      expect(prompt).toMatchSnapshot();
    });
  });

  describe('buildFeedbackPrompt', () => {
    it('should generate feedback prompt with default options', () => {
      const prompt = promptTemplate.buildFeedbackPrompt();

      expect(prompt).toContain('code reviewer');
      expect(prompt).toContain('General');
    });

    it('should include submission type in prompt', () => {
      const prompt = promptTemplate.buildFeedbackPrompt({
        submissionType: 'design-doc',
      });
      expect(prompt).toContain('design-doc reviewer');
    });

    it('should include focus area in prompt', () => {
      const prompt = promptTemplate.buildFeedbackPrompt({
        focusArea: 'performance',
      });
      expect(prompt).toContain('performance');
    });

    it('should include all feedback sections', () => {
      const prompt = promptTemplate.buildFeedbackPrompt();

      expect(prompt).toContain('STRENGTHS:');
      expect(prompt).toContain('AREAS FOR IMPROVEMENT:');
      expect(prompt).toContain('ACTIONABLE NEXT STEPS:');
    });

    it('should match feedback prompt snapshot', () => {
      const prompt = promptTemplate.buildFeedbackPrompt({
        submissionType: 'code',
        context: 'Algorithm Implementation',
        focusArea: 'optimization',
      });

      expect(prompt).toMatchSnapshot();
    });
  });

  describe('buildHintsPrompt', () => {
    it('should generate hints prompt with default options', () => {
      const prompt = promptTemplate.buildHintsPrompt();

      expect(prompt).toContain('HINT 1:');
      expect(prompt).toContain('HINT 3:');
    });

    it('should adjust number of hints based on difficulty', () => {
      const easyHints = promptTemplate.buildHintsPrompt({ difficulty: 'easy' });
      const hardHints = promptTemplate.buildHintsPrompt({ difficulty: 'hard' });

      expect(easyHints).toContain('HINT 2:');
      expect(easyHints).not.toContain('HINT 3:');

      expect(hardHints).toContain('HINT 4:');
    });

    it('should include challenge title in hints prompt', () => {
      const prompt = promptTemplate.buildHintsPrompt({
        challengeTitle: 'Array Reversal',
        difficulty: 'medium',
      });

      expect(prompt).toContain('Array Reversal');
    });

    it('should match hints prompt snapshot', () => {
      const prompt = promptTemplate.buildHintsPrompt({
        challengeTitle: 'Binary Search Tree',
        difficulty: 'hard',
      });

      expect(prompt).toMatchSnapshot();
    });
  });

  describe('Prompt structure consistency', () => {
    it('should always return a string', () => {
      expect(typeof promptTemplate.buildChallengePrompt()).toBe('string');
      expect(typeof promptTemplate.buildFeedbackPrompt()).toBe('string');
      expect(typeof promptTemplate.buildHintsPrompt()).toBe('string');
    });

    it('should not be empty', () => {
      expect(promptTemplate.buildChallengePrompt().length).toBeGreaterThan(0);
      expect(promptTemplate.buildFeedbackPrompt().length).toBeGreaterThan(0);
      expect(promptTemplate.buildHintsPrompt().length).toBeGreaterThan(0);
    });

    it('should be trimmed (no leading/trailing whitespace)', () => {
      const challengePrompt = promptTemplate.buildChallengePrompt();
      const feedbackPrompt = promptTemplate.buildFeedbackPrompt();
      const hintsPrompt = promptTemplate.buildHintsPrompt();

      expect(challengePrompt).toBe(challengePrompt.trim());
      expect(feedbackPrompt).toBe(feedbackPrompt.trim());
      expect(hintsPrompt).toBe(hintsPrompt.trim());
    });
  });
});
