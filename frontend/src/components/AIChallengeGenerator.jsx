import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './AIChallengeGenerator.css';

const AIChallengeGenerator = () => {
  console.log('🚀 AIChallengeGenerator component loaded - VERSION 2');
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [challenge, setChallenge] = useState(null);
  // Mode selection happens after generation
  const [postGenMode, setPostGenMode] = useState('save');
  const [solutionText, setSolutionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleCloseSuccessModal = () => {
    setSaveSuccess(false);
    navigate('/challenges');
  };
  
  const handleSaveForLater = async () => {
    console.log('🎯 Save for Later clicked, challenge:', challenge);
    if (!challenge) {
      console.error('❌ No challenge to save');
      return;
    }
    try {
      // Persist challenge explicitly using the AI saveChallenge endpoint
      const payload = {
        title: challenge.title,
        description: challenge.description || '',
        instructions: challenge.instructions || challenge.description || '',
        category: challenge.category || 'general',
        difficulty: challenge.difficulty || difficulty,
        points: challenge.points || 10,
        estimatedTime: challenge.estimatedTime || null,
      };
      
      console.log('📤 Sending payload to API:', payload);
      const response = await apiService.ai.saveChallenge(payload);
      console.log('✅ API response:', response);
      const saved = response.data?.data || response.data;
      
      setSaveSuccess(true);
      console.log('🎊 Save success modal shown');
      // Navigate to Browse Challenges after brief delay
      setTimeout(() => {
        console.log('🚀 Navigating to challenges page');
        setSaveSuccess(false);
        navigate('/challenges');
      }, 1500);
    } catch (err) {
      console.error('❌ Save for later failed:', err);
      setError(err.response?.data?.message || 'Failed to save challenge. Please try again.');
    }
  };

  // Fetch user's goals on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await apiService.goals.getAll();
        const fetchedGoals = response.data?.data || response.data || [];
        setGoals(fetchedGoals);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      } finally {
        setLoadingGoals(false);
      }
    };

    fetchGoals();
  }, []);

  const handleGenerateChallenge = async () => {
    if (!selectedGoal) {
      setError('Please select a goal first');
      return;
    }

    setLoading(true);
    setError('');
    setChallenge(null);
    setSolutionText('');

    try {
      const selectedGoalData = goals.find(g => g.id === parseInt(selectedGoal));
      const response = await apiService.ai.generateChallenge({ 
        difficulty,
        goalId: selectedGoal,
        goalTitle: selectedGoalData?.title || '',
        goalCategory: selectedGoalData?.category || ''
      });
      // Challenge is now returned without being saved to database
      const generatedChallenge = response.data?.data || response.data;
      setChallenge(generatedChallenge);
    } catch (err) {
      console.error('Failed to generate challenge:', err);
      setError(err.response?.data?.message || 'Failed to generate challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToPeerReview = async () => {
    // Validation
    if (!challenge) {
      setError('Please generate a challenge first.');
      return;
    }

    if (!solutionText.trim()) {
      setError('Please write your solution before submitting to peer review.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await apiService.peerReview.submit({
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        challengeDescription: challenge.description,
        challengeInstructions: challenge.instructions,
        solutionCode: solutionText,
        difficulty: challenge.difficulty || difficulty,
        goalId: selectedGoal, // Include goalId for progress tracking
      });

      setShowSuccessModal(true);
      // Clear form after successful submission
      setTimeout(() => {
        setChallenge(null);
        setSolutionText('');
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to submit to peer review:', err);
      setError(err.response?.data?.message || 'Failed to submit to peer review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ai-challenge-generator">
      <div className="generator-header">
        <h2>AI Challenge Generator</h2>
        <p>Generate a custom coding challenge. It is saved to your Challenges list so you can solve it later or submit to peer review anytime.</p>
      </div>

      <div className="generator-controls">
        <div className="form-group">
          <label htmlFor="goal-select">Select Goal</label>
          <select
            id="goal-select"
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            disabled={loading || loadingGoals}
            className="goal-select"
          >
            <option value="">
              {loadingGoals ? 'Loading goals...' : 'Choose a goal...'}
            </option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title} ({goal.category})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty-select">Difficulty Level</label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
            className="difficulty-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Mode selection moved to post-generation UI */}

        <button
          className="btn-primary generate-btn"
          onClick={handleGenerateChallenge}
          disabled={loading || !selectedGoal}
        >
          {loading ? 'Generating...' : 'Generate Challenge'}
        </button>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {challenge && (
        <div className="challenge-display">
          <div className="challenge-header">
            <h3>{challenge.title}</h3>
            <div className="challenge-meta">
              <span className={`difficulty-badge ${challenge.difficulty || difficulty}`}>
                {(challenge.difficulty || difficulty).toUpperCase()}
              </span>
              <span className="points-badge">+{challenge.points || 25} pts</span>
            </div>
          </div>

          <div className="challenge-content">
            <div className="challenge-section">
              <h4>Description</h4>
              <p>{challenge.description}</p>
            </div>

            {challenge.instructions && (
              <div className="challenge-section">
                <h4>Instructions</h4>
                <pre className="instructions-text">{challenge.instructions}</pre>
              </div>
            )}

            {challenge.category && (
              <div className="challenge-info">
                <span><strong>Category:</strong> {challenge.category}</span>
                {challenge.estimatedTime && (
                  <span><strong>Estimated Time:</strong> {challenge.estimatedTime} min</span>
                )}
              </div>
            )}
          </div>

          {/* Toggle between Save Only vs Open AFTER generation */}
          <div className="postgen-mode-toggle" role="group" aria-label="Choose action">
            <button
              className={`toggle-btn ${postGenMode === 'save' ? 'active' : ''}`}
              onClick={() => setPostGenMode('save')}
            >
              Save Only
            </button>
            <button
              className={`toggle-btn ${postGenMode === 'open' ? 'active' : ''}`}
              onClick={() => setPostGenMode('open')}
            >
              Open
            </button>
          </div>

          {postGenMode === 'open' ? (
            <>
              <div className="solution-editor">
                <h4>Your Solution</h4>
                <textarea
                  className="solution-textarea"
                  placeholder="Write your solution here... (code, explanation, or approach)"
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  rows={15}
                  disabled={submitting}
                />
                <div className="char-count">
                  {solutionText.length} characters
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn-primary submit-btn"
                  onClick={handleSubmitToPeerReview}
                  disabled={submitting || !solutionText.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit to Peer Review'}
                </button>
                <button
                  className="btn-secondary save-later-btn"
                  onClick={handleSaveForLater}
                >
                  Save for Later
                </button>
              </div>
            </>
          ) : (
            <div className="post-generate-actions">
              <button
                className="btn-primary save-later-btn"
                onClick={handleSaveForLater}
              >
                Save Challenge
              </button>
            </div>
          )}
        </div>
      )}

      {saveSuccess && (
        <div className="success-modal" role="dialog" onClick={handleCloseSuccessModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={handleCloseSuccessModal}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="success-icon">✓</div>
            <h3>Saved!</h3>
            <p>Challenge saved to Browse Challenges.</p>
            <p>Redirecting...</p>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal" role="dialog">
          <div className="modal-content">
            <div className="success-icon">✓</div>
            <h3>Success!</h3>
            <p>Your solution has been submitted for peer review.</p>
            <p>Check the Peer Review tab to see it.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChallengeGenerator;
