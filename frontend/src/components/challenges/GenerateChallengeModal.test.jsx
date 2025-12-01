/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenerateChallengeModal from './GenerateChallengeModal';
import api from '../../../services/api';

// Mock the api service
jest.mock('../../../services/api');

describe('GenerateChallengeModal', () => {
  const mockOnClose = jest.fn();
  const mockOnChallengeGenerated = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onChallengeGenerated: mockOnChallengeGenerated,
    goalId: null,
  };

  const mockChallenge = {
    id: 'ai-123',
    title: 'Medium Programming Challenge',
    description:
      'An AI-generated medium level challenge to test your programming skills.',
    category: 'programming',
    difficulty: 'medium',
    points: 25,
    estimatedTime: 30,
    instructions: 'Complete this programming challenge by solving the problem.',
    generatedBy: 'AI',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal visibility', () => {
    it('should not render when isOpen is false', () => {
      render(<GenerateChallengeModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<GenerateChallengeModal {...defaultProps} />);
      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('should display modal header with title', () => {
      render(<GenerateChallengeModal {...defaultProps} />);
      expect(screen.getByText('Generate AI Challenge')).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('should display the challenge form initially', () => {
      render(<GenerateChallengeModal {...defaultProps} />);
      expect(screen.getByTestId('challenge-form')).toBeInTheDocument();
      expect(screen.getByTestId('generate-btn')).toBeInTheDocument();
    });

    it('should have difficulty and category selectors', () => {
      render(<GenerateChallengeModal {...defaultProps} />);
      const difficultySelect = screen.getByLabelText('Difficulty Level');
      const categorySelect = screen.getByLabelText('Category');

      expect(difficultySelect).toBeInTheDocument();
      expect(categorySelect).toBeInTheDocument();
      expect(difficultySelect).toHaveValue('medium');
      expect(categorySelect).toHaveValue('general');
    });

    it('should update difficulty selection', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const difficultySelect = screen.getByLabelText('Difficulty Level');
      await user.selectOptions(difficultySelect, 'hard');

      expect(difficultySelect).toHaveValue('hard');
    });

    it('should update category selection', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'programming');

      expect(categorySelect).toHaveValue('programming');
    });
  });

  describe('Generate button click', () => {
    it('should call API when generate button is clicked', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/ai/generateChallenge', {
          category: 'general',
          difficulty: 'medium',
          goalId: null,
        });
      });
    });

    it('should show loading state while generating', async () => {
      api.post.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    success: true,
                    data: mockChallenge,
                  },
                }),
              100
            )
          )
      );

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      expect(screen.getByText(/Generating/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('challenge-display')).toBeInTheDocument();
      });
    });

    it('should display generated challenge after success', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('challenge-display')).toBeInTheDocument();
        expect(screen.getByText(mockChallenge.title)).toBeInTheDocument();
        expect(screen.getByText(mockChallenge.description)).toBeInTheDocument();
      });
    });

    it('should call onChallengeGenerated callback', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(mockOnChallengeGenerated).toHaveBeenCalledWith(mockChallenge);
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message on API failure', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(
          screen.getByText(/Failed to generate challenge/i)
        ).toBeInTheDocument();
      });
    });

    it('should display custom error message from API', async () => {
      const errorMessage = 'Invalid difficulty level';
      api.post.mockResolvedValue({
        data: {
          success: false,
          message: errorMessage,
        },
      });

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should clear error when attempting new generation', async () => {
      api.post.mockRejectedValueOnce(new Error('Network error'));
      api.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      // First attempt - fails
      let generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });

      // Clear error by clicking generate again
      generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Challenge display and actions', () => {
    beforeEach(() => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });
    });

    it('should display challenge metadata correctly', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByText(/Medium/i)).toBeInTheDocument();
        expect(screen.getByText(/25 pts/i)).toBeInTheDocument();
        expect(screen.getByText(/~30 min/i)).toBeInTheDocument();
      });
    });

    it('should have "Generate Another" button to regenerate', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByText('Generate Another')).toBeInTheDocument();
      });

      const generateAnotherBtn = screen.getByText('Generate Another');
      await user.click(generateAnotherBtn);

      expect(screen.getByTestId('challenge-form')).toBeInTheDocument();
    });

    it('should have "Accept Challenge" button', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByText('Accept Challenge')).toBeInTheDocument();
      });
    });
  });

  describe('Modal closing', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const closeBtn = screen.getByLabelText('Close modal');
      await user.click(closeBtn);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const overlay = screen.getByTestId('modal-overlay');
      await user.click(overlay);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close modal when content is clicked', async () => {
      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const content = screen.getByTestId('modal-content');
      await user.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should reset form state when closing', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      const user = userEvent.setup();
      const { rerender } = render(<GenerateChallengeModal {...defaultProps} />);

      // Generate a challenge
      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('challenge-display')).toBeInTheDocument();
      });

      // Close modal
      const closeBtn = screen.getByLabelText('Close modal');
      await user.click(closeBtn);

      // Reopen modal
      rerender(<GenerateChallengeModal {...defaultProps} />);

      // Form should be reset
      expect(screen.getByTestId('challenge-form')).toBeInTheDocument();
      expect(screen.queryByTestId('challenge-display')).not.toBeInTheDocument();
    });
  });

  describe('Props handling', () => {
    it('should accept goalId prop', () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      render(<GenerateChallengeModal {...defaultProps} goalId="goal-123" />);

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('should pass goalId to API request', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockChallenge,
        },
      });

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} goalId="goal-456" />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/ai/generateChallenge', {
          category: 'general',
          difficulty: 'medium',
          goalId: 'goal-456',
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<GenerateChallengeModal {...defaultProps} />);

      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
      expect(screen.getByLabelText('Difficulty Level')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
    });

    it('should have role alert on error message', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<GenerateChallengeModal {...defaultProps} />);

      const generateBtn = screen.getByTestId('generate-btn');
      await user.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveAttribute(
          'role',
          'alert'
        );
      });
    });
  });
});
