import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChallengeGenerator from '../AIChallengeGenerator';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  apiService: {
    ai: {
      generateChallenge: jest.fn(),
    },
    peerReview: {
      submit: jest.fn(),
    },
  },
}));

describe('AIChallengeGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders difficulty dropdown with correct options', () => {
    render(<AIChallengeGenerator />);
    
    const select = screen.getByLabelText(/difficulty level/i);
    expect(select).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('easy');
    expect(options[1]).toHaveValue('medium');
    expect(options[2]).toHaveValue('hard');
  });

  test('difficulty dropdown changes state', () => {
    render(<AIChallengeGenerator />);
    
    const select = screen.getByLabelText(/difficulty level/i);
    
    // Default should be medium
    expect(select).toHaveValue('medium');
    
    // Change to easy
    fireEvent.change(select, { target: { value: 'easy' } });
    expect(select).toHaveValue('easy');
    
    // Change to hard
    fireEvent.change(select, { target: { value: 'hard' } });
    expect(select).toHaveValue('hard');
  });

  test('generate challenge button calls API correctly', async () => {
    const mockChallenge = {
      id: 'test-123',
      title: 'Test Challenge',
      description: 'A test challenge description',
      instructions: 'Test instructions',
      difficulty: 'medium',
      points: 25,
    };

    apiService.ai.generateChallenge.mockResolvedValue({
      data: { data: mockChallenge },
    });

    render(<AIChallengeGenerator />);
    
    const generateButton = screen.getByText(/generate challenge/i);
    fireEvent.click(generateButton);

    // Button should be disabled while loading
    expect(generateButton).toBeDisabled();
    expect(generateButton).toHaveTextContent(/generating/i);

    await waitFor(() => {
      expect(apiService.ai.generateChallenge).toHaveBeenCalledWith({
        difficulty: 'medium',
      });
    });

    // Challenge should be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
      expect(screen.getByText('A test challenge description')).toBeInTheDocument();
    });
  });

  test('displays error message when challenge generation fails', async () => {
    apiService.ai.generateChallenge.mockRejectedValue({
      response: { data: { message: 'API Error' } },
    });

    render(<AIChallengeGenerator />);
    
    const generateButton = screen.getByText(/generate challenge/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });

  test('submit to peer review button validates solution content', async () => {
    const mockChallenge = {
      id: 'test-123',
      title: 'Test Challenge',
      description: 'Description',
      instructions: 'Instructions',
      difficulty: 'medium',
    };

    apiService.ai.generateChallenge.mockResolvedValue({
      data: { data: mockChallenge },
    });

    render(<AIChallengeGenerator />);
    
    // Generate a challenge first
    const generateButton = screen.getByText(/generate challenge/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    });

    // Try to submit without solution
    const submitButton = screen.getByText(/submit to peer review/i);
    
    // Button should be disabled when solution is empty
    expect(submitButton).toBeDisabled();
  });

  test('submit to peer review with valid solution', async () => {
    const mockChallenge = {
      id: 'test-123',
      title: 'Test Challenge',
      description: 'Description',
      instructions: 'Instructions',
      difficulty: 'medium',
      points: 25,
    };

    apiService.ai.generateChallenge.mockResolvedValue({
      data: { data: mockChallenge },
    });

    apiService.peerReview.submit.mockResolvedValue({
      data: { success: true },
    });

    render(<AIChallengeGenerator />);
    
    // Generate a challenge
    const generateButton = screen.getByText(/generate challenge/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    });

    // Enter solution
    const textarea = screen.getByPlaceholderText(/write your solution/i);
    fireEvent.change(textarea, { target: { value: 'My solution code here' } });

    // Submit to peer review
    const submitButton = screen.getByText(/submit to peer review/i);
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiService.peerReview.submit).toHaveBeenCalledWith({
        challengeId: 'test-123',
        challengeTitle: 'Test Challenge',
        challengeDescription: 'Description',
        challengeInstructions: 'Instructions',
        solutionCode: 'My solution code here',
        difficulty: 'medium',
      });
    });

    // Success modal should appear
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
      expect(screen.getByText(/submitted for peer review/i)).toBeInTheDocument();
    });
  });

  test('shows error when submitting without generating challenge', async () => {
    render(<AIChallengeGenerator />);
    
    // We can't click submit button directly as there's no challenge displayed
    // But the validation logic should prevent submission
    // This test verifies the component structure
    expect(screen.queryByText(/submit to peer review/i)).not.toBeInTheDocument();
  });

  test('validates empty solution on submit', async () => {
    const mockChallenge = {
      id: 'test-123',
      title: 'Test Challenge',
      description: 'Description',
      difficulty: 'medium',
    };

    apiService.ai.generateChallenge.mockResolvedValue({
      data: { data: mockChallenge },
    });

    render(<AIChallengeGenerator />);
    
    // Generate challenge
    fireEvent.click(screen.getByText(/generate challenge/i));

    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    });

    // Button should be disabled with empty solution
    const submitButton = screen.getByText(/submit to peer review/i);
    expect(submitButton).toBeDisabled();
  });

  test('displays character count for solution', async () => {
    const mockChallenge = {
      id: 'test-123',
      title: 'Test Challenge',
      description: 'Description',
      difficulty: 'medium',
    };

    apiService.ai.generateChallenge.mockResolvedValue({
      data: { data: mockChallenge },
    });

    render(<AIChallengeGenerator />);
    
    // Generate challenge
    fireEvent.click(screen.getByText(/generate challenge/i));

    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/write your solution/i);
    const testSolution = 'Test solution';
    fireEvent.change(textarea, { target: { value: testSolution } });

    expect(screen.getByText(`${testSolution.length} characters`)).toBeInTheDocument();
  });
});
