import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../../components/progress/ProgressBar';

describe('ProgressBar Component', () => {
  const defaultProps = {
    totalChallenges: 10,
    completedChallenges: 5,
  };

  it('renders correctly with default props', () => {
    render(<ProgressBar {...defaultProps} />);

    // Check if percentage is displayed correctly
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(
      screen.getByText('5 of 10 challenges completed (50%)')
    ).toBeInTheDocument();
  });

  it('shows 0% when there are no challenges', () => {
    render(<ProgressBar totalChallenges={0} completedChallenges={0} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(
      screen.getByText('0 of 0 challenges completed (0%)')
    ).toBeInTheDocument();
  });

  it('shows 100% when all challenges are completed', () => {
    render(<ProgressBar totalChallenges={5} completedChallenges={5} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(
      screen.getByText('5 of 5 challenges completed (100%)')
    ).toBeInTheDocument();
  });

  it('handles mobile and desktop views', () => {
    render(<ProgressBar {...defaultProps} />);

    expect(screen.getByTestId('mobile-progress')).toHaveStyle({
      width: '50%',
    });

    expect(screen.getByTestId('desktop-progress')).toBeInTheDocument();
  });

  it('validates props correctly', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<ProgressBar {...defaultProps} />)).not.toThrow();

    render(<ProgressBar totalChallenges="invalid" completedChallenges={5} />);
    expect(console.error).toHaveBeenCalled();

    console.error = consoleError;
  });
});
