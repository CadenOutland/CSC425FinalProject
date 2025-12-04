import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import './SubmitFeedbackForm.css';

const SubmitFeedbackForm = ({ onFeedbackReceived, challengeId, title }) => {
  const [submission, setSubmission] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submissionMode, setSubmissionMode] = useState('text');

  const handleTextChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        setSubmission(event.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submission.trim()) {
      setError('Please provide code or text to get feedback on');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/ai/submitForFeedback', {
        submission,
        challengeId,
        submissionType: submissionMode,
      });

      if (response.data.success) {
        setFeedback(response.data.data);
        if (onFeedbackReceived) {
          onFeedbackReceived(response.data.data);
        }
      } else {
        setError(response.data.message || 'Failed to get feedback');
      }
    } catch (err) {
      setError(err.message || 'Failed to get feedback. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Feedback submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (feedback) {
    return (
      <div className="feedback-result" data-testid="feedback-result">
        <div className="feedback-header">
          <h3>AI Feedback</h3>
          <button
            className="btn-reset"
            onClick={() => {
              setFeedback(null);
              setSubmission('');
              setFile(null);
            }}
            aria-label="Get new feedback"
          >
            ← Get New Feedback
          </button>
        </div>

        <div className="feedback-content">
          {feedback.strengths && (
            <section className="feedback-section strengths">
              <h4>✨ Strengths</h4>
              <ul>
                {feedback.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.improvements && (
            <section className="feedback-section improvements">
              <h4>📈 Areas for Improvement</h4>
              <ul>
                {feedback.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.nextSteps && (
            <section className="feedback-section next-steps">
              <h4>🎯 Next Steps</h4>
              <ol>
                {feedback.nextSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          {feedback.rawFeedback && (
            <section className="feedback-section raw">
              <h4>Full Feedback</h4>
              <p className="feedback-text">{feedback.rawFeedback}</p>
            </section>
          )}

          <div className="feedback-timestamp">
            Generated on {new Date(feedback.generatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="submit-feedback-form"
      onSubmit={handleSubmit}
      data-testid="feedback-form"
    >
      <div className="form-header">
        <h3>Submit for AI Feedback</h3>
        {title && <p className="form-subtitle">{title}</p>}
      </div>

      <div className="submission-mode-selector">
        <label className="radio-group">
          <input
            type="radio"
            name="mode"
            value="text"
            checked={submissionMode === 'text'}
            onChange={() => setSubmissionMode('text')}
          />
          <span>Paste Code</span>
        </label>
        <label className="radio-group">
          <input
            type="radio"
            name="mode"
            value="file"
            checked={submissionMode === 'file'}
            onChange={() => setSubmissionMode('file')}
          />
          <span>Upload File</span>
        </label>
      </div>

      <div className="form-group">
        {submissionMode === 'text' ? (
          <>
            <label htmlFor="submission-textarea">Your Code or Text</label>
            <textarea
              id="submission-textarea"
              value={submission}
              onChange={handleTextChange}
              placeholder="Paste your code here..."
              rows={12}
              disabled={isLoading}
              className="code-textarea"
              data-testid="submission-textarea"
            />
          </>
        ) : (
          <>
            <label htmlFor="file-input">Choose File</label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".js,.py,.java,.cpp,.txt,.jsx,.ts,.tsx"
              disabled={isLoading}
              data-testid="file-input"
            />
            {file && <p className="file-info">Selected: {file.name}</p>}
          </>
        )}
      </div>

      {error && (
        <div className="error-message" role="alert" data-testid="error-message">
          {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !submission.trim()}
          data-testid="submit-btn"
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Getting Feedback...
            </>
          ) : (
            'Get AI Feedback'
          )}
        </button>
      </div>

      <div className="form-hint">
        <p>
          💡 Tip: The AI will provide constructive feedback on code quality,
          correctness, and best practices.
        </p>
      </div>
    </form>
  );
};

SubmitFeedbackForm.propTypes = {
  onFeedbackReceived: PropTypes.func,
  challengeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
};

SubmitFeedbackForm.defaultProps = {
  onFeedbackReceived: null,
  challengeId: null,
  title: null,
};

export default SubmitFeedbackForm;
