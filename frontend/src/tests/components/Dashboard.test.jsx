import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Dashboard from '../../pages/Dashboard';
import * as challengeService from '../../services/challengeService';

// Mock the challenge service
jest.mock('../../services/challengeService');

const mockChallenges = [
  {
    id: 1,
    title: 'Test Challenge',
    description: 'A test challenge',
    difficulty: 'easy',
    points: 10,
    status: 'not-started',
  },
];

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Setup default mock implementations
    challengeService.getChallenges.mockResolvedValue(mockChallenges);
  });

  it('renders dashboard with progress bar', async () => {
    renderDashboard();

    // Check loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(challengeService.getChallenges).toHaveBeenCalled();
    });

    // Check progress display
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays challenges correctly', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    });

    expect(screen.getByText('A test challenge')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
  });

  it('updates progress when challenge is completed', async () => {
    const completedChallenge = {
      ...mockChallenges[0],
      status: 'completed',
    };

    challengeService.getChallenges.mockResolvedValue([completedChallenge]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    const errorMessage = 'Failed to fetch challenges';
    challengeService.getChallenges.mockRejectedValue(new Error(errorMessage));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
