describe('Core User Flow', () => {
  beforeEach(() => {
    // Reset database state between tests
    cy.request('POST', 'http://localhost:3001/api/test/reset');
  });

  it('completes full user journey', () => {
    // Login
    cy.visit('http://localhost:3000/login');
    cy.findByLabelText('Email').type('test@example.com');
    cy.findByLabelText('Password').type('password123');
    cy.findByRole('button', { name: /sign in/i }).click();

    // Create a new goal
    cy.findByRole('link', { name: /goals/i }).click();
    cy.findByRole('button', { name: /new goal/i }).click();
    cy.findByLabelText('Title').type('Learn Testing');
    cy.findByLabelText('Description').type('Master Cypress and Jest testing');
    cy.findByLabelText('Target Date').type('2025-12-31');
    cy.findByRole('button', { name: /create/i }).click();

    // Add a challenge to the goal
    cy.findByRole('button', { name: /add challenge/i }).click();
    cy.findByLabelText('Title').type('Write first Cypress test');
    cy.findByLabelText('Description').type('Create and run a smoke test');
    cy.findByRole('button', { name: /add/i }).click();

    // Mark challenge as complete
    cy.findByRole('button', { name: /complete/i }).click();

    // Verify progress update
    cy.findByRole('progressbar').should('have.attr', 'aria-valuenow', '100');
  });
});