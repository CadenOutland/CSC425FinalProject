/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubmitFeedbackForm from './SubmitFeedbackForm';
import api from '../../../services/api';

jest.mock('../../../services/api');

describe('SubmitFeedbackForm', () => {
  const mockOnFeedbackReceived = jest.fn();

  const defaultProps = {
    onFeedbackReceived: mockOnFeedbackReceived,
    challengeId: 'challenge-123',
    title: 'Array Reversal Challenge',
  };

  const mockFeedback = {
    strengths: ['Good variable naming', 'Efficient algorithm'],
    improvements: ['Add error handling', 'Consider edge cases'],
    nextSteps: [
      'Study error handling patterns',
      'Practice with complex inputs',
    ],
    rawFeedback: 'Overall good solution with room for improvement.',
    generatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form initialization', () => {
    it('should render feedback form with text mode by default', () => {
      render(<SubmitFeedbackForm {...defaultProps} />);
      expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
      expect(screen.getByTestId('submission-textarea')).toBeInTheDocument();
    });

    it('should display form title and subtitle', () => {
      render(<SubmitFeedbackForm {...defaultProps} />);
      expect(screen.getByText('Submit for AI Feedback')).toBeInTheDocument();
      expect(screen.getByText('Array Reversal Challenge')).toBeInTheDocument();
    });

    it('should have submission mode selector', () => {
      render(<SubmitFeedbackForm {...defaultProps} />);
      const textMode = screen.getByDisplayValue('text');
      const fileMode = screen.getByDisplayValue('file');

      expect(textMode).toBeInTheDocument();
      expect(fileMode).toBeInTheDocument();
      expect(textMode).toBeChecked();
    });
  });

  describe('Text submission mode', () => {
    it('should allow user to type code into textarea', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'const arr = [1, 2, 3];');

      expect(textarea).toHaveValue('const arr = [1, 2, 3];');
    });

    it('should disable submit button when textarea is empty', () => {
      render(<SubmitFeedbackForm {...defaultProps} />);
      const submitBtn = screen.getByTestId('submit-btn');

      expect(submitBtn).toBeDisabled();
    });

    it('should enable submit button when textarea has content', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code here');

      const submitBtn = screen.getByTestId('submit-btn');
      expect(submitBtn).not.toBeDisabled();
    });
  });

  describe('File submission mode', () => {
    it('should switch to file mode when selected', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const fileMode = screen.getByDisplayValue('file');
      await user.click(fileMode);

      expect(screen.getByTestId('file-input')).toBeInTheDocument();
      expect(
        screen.queryByTestId('submission-textarea')
      ).not.toBeInTheDocument();
    });

    it('should handle file selection and read content', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const fileMode = screen.getByDisplayValue('file');
      await user.click(fileMode);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['const x = 1;'], 'test.js', {
        type: 'text/javascript',
      });

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText(/Selected: test.js/)).toBeInTheDocument();
      });
    });
  });

  describe('Form submission', () => {
    it('should call API with submission data on form submit', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockFeedback,
        },
      });

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'const solution = "test";');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/ai/submitForFeedback', {
          submission: 'const solution = "test";',
          challengeId: 'challenge-123',
          submissionType: 'text',
        });
      });
    });

    it('should show loading state during submission', async () => {
      api.post.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    success: true,
                    data: mockFeedback,
                  },
                }),
              100
            )
          )
      );

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      expect(screen.getByText(/Getting Feedback/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('feedback-result')).toBeInTheDocument();
      });
    });

    it('should display feedback after successful submission', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockFeedback,
        },
      });

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'const x = 1;');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('feedback-result')).toBeInTheDocument();
      });
    });

    it('should call onFeedbackReceived callback when feedback is received', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockFeedback,
        },
      });

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockOnFeedbackReceived).toHaveBeenCalledWith(mockFeedback);
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message when API fails', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    });

    it('should display custom error from API response', async () => {
      const errorMsg = 'Submission too long';
      api.post.mockResolvedValue({
        data: {
          success: false,
          message: errorMsg,
        },
      });

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(errorMsg)).toBeInTheDocument();
      });
    });

    it('should show error when trying to submit empty form', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      // Try to submit without typing anything (button should be disabled, but test the logic)
      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, '   '); // Only whitespace

      const submitBtn = screen.getByTestId('submit-btn');
      // Button should still be disabled due to trim check
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('Feedback display', () => {
    beforeEach(() => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockFeedback,
        },
      });
    });

    it('should display feedback sections when feedback is received', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Strengths/i)).toBeInTheDocument();
        expect(screen.getByText(/Areas for Improvement/i)).toBeInTheDocument();
        expect(screen.getByText(/Next Steps/i)).toBeInTheDocument();
      });
    });

    it('should display strengths list', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Good variable naming')).toBeInTheDocument();
        expect(screen.getByText('Efficient algorithm')).toBeInTheDocument();
      });
    });

    it('should allow resetting to get new feedback', async () => {
      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('feedback-result')).toBeInTheDocument();
      });

      const resetBtn = screen.getByLabelText('Get new feedback');
      await user.click(resetBtn);

      expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
      expect(screen.getByTestId('submission-textarea')).toHaveValue('');
    });
  });

  describe('Props handling', () => {
    it('should render without title prop', () => {
      const { title, ...propsWithoutTitle } = defaultProps;
      render(<SubmitFeedbackForm {...propsWithoutTitle} />);
      expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
    });

    it('should handle missing onFeedbackReceived callback', async () => {
      api.post.mockResolvedValue({
        data: {
          success: true,
          data: mockFeedback,
        },
      });

      const user = userEvent.setup();
      render(<SubmitFeedbackForm challengeId="test" />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('feedback-result')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      expect(textarea).toHaveAccessibleName('Your Code or Text');
    });

    it('should have error message with role alert', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<SubmitFeedbackForm {...defaultProps} />);

      const textarea = screen.getByTestId('submission-textarea');
      await user.type(textarea, 'code');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveAttribute(
          'role',
          'alert'
        );
      });
    });
  });
});
