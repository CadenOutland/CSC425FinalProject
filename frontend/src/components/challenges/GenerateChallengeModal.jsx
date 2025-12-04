import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import './GenerateChallengeModal.css';

const GenerateChallengeModal = ({
  isOpen,
  onClose,
  onChallengeGenerated,
  goalId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('general');

  const handleGenerateChallenge = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/ai/generateChallenge', {
        category,
        difficulty,
        goalId,
      });

      if (response.data.success) {
        setChallenge(response.data.data);
      } else {
        setError(response.data.message || 'Failed to generate challenge');
      }
    } catch (err) {
      setError(
        err.message || 'Failed to generate challenge. Please try again.'
      );
      // eslint-disable-next-line no-console
      console.error('Challenge generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChallenge = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await api.post('/ai/saveChallenge', {
        title: challenge.title,
        description: challenge.description,
        instructions: challenge.instructions,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: challenge.points,
        estimatedTime: challenge.estimatedTime,
      });

      if (response.data.success) {
        if (onChallengeGenerated) {
          onChallengeGenerated(response.data.data);
        }
        handleClose();
      } else {
        setError(response.data.message || 'Failed to save challenge');
      }
    } catch (err) {
      setError(err.message || 'Failed to save challenge. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Challenge save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setChallenge(null);
    setError(null);
    setDifficulty('medium');
    setCategory('general');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      data-testid="modal-overlay"
    >
      <div
        className="modal-content generate-challenge-modal"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-content"
      >
        <div className="modal-header">
          <h2>Generate AI Challenge</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          {challenge ? (
            // Challenge Display
            <div className="challenge-display" data-testid="challenge-display">
              <div className="challenge-header">
                <h3>{challenge.title}</h3>
                <div className="challenge-meta">
                  <span
                    className={`difficulty-badge difficulty-${challenge.difficulty}`}
                  >
                    {challenge.difficulty.charAt(0).toUpperCase() +
                      challenge.difficulty.slice(1)}
                  </span>
                  <span className="points-badge">{challenge.points} pts</span>
                  {challenge.estimatedTime && (
                    <span className="time-badge">
                      ~{challenge.estimatedTime} min
                    </span>
                  )}
                </div>
              </div>

              <div className="challenge-content">
                <section className="challenge-section">
                  <h4>Description</h4>
                  <p>{challenge.description}</p>
                </section>

                {challenge.instructions && (
                  <section className="challenge-section">
                    <h4>Instructions</h4>
                    <p>{challenge.instructions}</p>
                  </section>
                )}

                {challenge.category && (
                  <section className="challenge-section">
                    <h4>Category</h4>
                    <p className="category-tag">{challenge.category}</p>
                  </section>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setChallenge(null)}
                  disabled={isSaving}
                >
                  Generate Another
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveChallenge}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner" />
                      Saving...
                    </>
                  ) : (
                    'Accept Challenge'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Challenge Generator Form
            <div className="challenge-form" data-testid="challenge-form">
              <div className="form-group">
                <label htmlFor="difficulty-select">Difficulty Level</label>
                <select
                  id="difficulty-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category-select">Category</label>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="general">General</option>
                  <option value="programming">Programming</option>
                  <option value="web-development">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="writing">Writing</option>
                </select>
              </div>

              {error && (
                <div
                  className="error-message"
                  role="alert"
                  data-testid="error-message"
                >
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-generate"
                onClick={handleGenerateChallenge}
                disabled={isLoading}
                data-testid="generate-btn"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Generating...
                  </>
                ) : (
                  'Generate Challenge'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

GenerateChallengeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChallengeGenerated: PropTypes.func,
  goalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

GenerateChallengeModal.defaultProps = {
  onChallengeGenerated: null,
  goalId: null,
};

export default GenerateChallengeModal;
