describe('Complete User Workflow', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
  };

  beforeEach(() => {
    // Reset database to known state
    cy.request('POST', 'http://localhost:3001/api/test/reset');

    // Create test user
    cy.request('POST', 'http://localhost:3001/api/test/seed', {
      users: [testUser],
    });
  });

  it('should complete full workflow: login → create goal → add challenge → mark complete', () => {
    // 1. Login Flow
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();

    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.contains(`Welcome back, ${testUser.name}`);

    // 2. Create Goal Flow
    cy.get('[data-testid="create-goal-button"]').click();
    const goalTitle = 'Learn JavaScript Testing';
    cy.get('[data-testid="goal-title-input"]').type(goalTitle);
    cy.get('[data-testid="goal-description-input"]').type(
      'Master Jest and Cypress for comprehensive testing'
    );
    cy.get('[data-testid="goal-deadline-input"]').type('2025-12-31');
    cy.get('[data-testid="submit-goal-button"]').click();

    // Verify goal creation
    cy.contains(goalTitle).should('be.visible');

    // 3. Add Challenge Flow
    cy.get('[data-testid="add-challenge-button"]').click();
    const challengeTitle = 'Write First Test Suite';
    cy.get('[data-testid="challenge-title-input"]').type(challengeTitle);
    cy.get('[data-testid="challenge-description-input"]').type(
      'Create and run a basic test suite using Jest'
    );
    cy.get('[data-testid="challenge-difficulty-select"]').select('easy');
    cy.get('[data-testid="challenge-points-input"]').type('10');
    cy.get('[data-testid="submit-challenge-button"]').click();

    // Verify challenge creation
    cy.contains(challengeTitle).should('be.visible');

    // 4. Mark Challenge Complete Flow
    cy.get(`[data-testid="challenge-card-${challengeTitle}"]`)
      .find('[data-testid="start-challenge-button"]')
      .click();

    // Complete challenge steps
    cy.get('[data-testid="complete-step-button"]').click();
    cy.get('[data-testid="submit-completion-button"]').click();

    // Verify completion
    cy.get(`[data-testid="challenge-card-${challengeTitle}"]`).should(
      'have.attr',
      'data-status',
      'completed'
    );

    // Check Progress Bar
    cy.get('[data-testid="progress-bar"]').should('contain', '100%');
  });
});
