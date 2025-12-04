import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ChallengeDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(location.state?.challenge || null);
  const [loading, setLoading] = useState(!location.state?.challenge);
  const [error, setError] = useState(null);
  // Coding + feedback state
  const [solutionCode, setSolutionCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!challenge) {
      setLoading(true);
      api.challenges.getById(id)
        .then(res => {
          // Backend may return { status, data }, normalize
          const payload = res.data?.data || res.data;
          setChallenge(payload);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to load challenge');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBack = () => navigate('/challenges');

  const handleSubmitPeerReview = async () => {
    if (!challenge?.id) {
      setError('Challenge not loaded yet.');
      return;
    }
    if (!solutionCode?.trim()) {
      setError('Please enter your solution code before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await api.peerReview.submit({
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        challengeDescription: challenge.description,
        challengeInstructions: challenge.instructions,
        solutionCode,
        difficulty: challenge.difficulty || challenge.difficulty_level || 'easy',
      });
      navigate('/peer-review');
    } catch (e) {
      console.error('Peer review submission error:', e);
      const serverMsg = e.response?.data?.message || e.message;
      setError(serverMsg ? `Submission failed: ${serverMsg}` : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveForLater = async () => {
    if (!challenge?.id) return;
    setSaving(true);
    try {
      // Saving the challenge itself already exists; here we just confirm save and go back
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/challenges');
      }, 800);
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) return <p>Loading challenge...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!challenge) return <p>No challenge found.</p>;

    return (
      <div className="challenge-detail">
        <h2>{challenge.title}</h2>
        <div className="challenge-meta">
          <span><strong>Difficulty:</strong> {challenge.difficulty || challenge.difficulty_level}</span>
          {challenge.points && <span style={{ marginLeft: 12 }}><strong>Points:</strong> {challenge.points}</span>}
          {challenge.estimatedTime && <span style={{ marginLeft: 12 }}><strong>Est. Time:</strong> {challenge.estimatedTime} min</span>}
        </div>
        <div style={{ marginTop: 16 }}>
          <h4>Description</h4>
          <p>{challenge.description}</p>
        </div>
        {challenge.instructions && (
          <div style={{ marginTop: 16 }}>
            <h4>Instructions</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{challenge.instructions}</pre>
          </div>
        )}
        {Array.isArray(challenge.tags) && challenge.tags.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>Tags</h4>
            <div>
              {challenge.tags.map((t, i) => (
                <span key={i} style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  marginRight: 8,
                  marginBottom: 8,
                  background: '#eef',
                  borderRadius: 12,
                  fontSize: 12,
                }}>{t}</span>
              ))}
            </div>
          </div>
        )}
        {/* Coding panel */}
        <div style={{ marginTop: 24 }}>
          <h4>Write Your Solution</h4>
          <textarea
            value={solutionCode}
            onChange={(e) => setSolutionCode(e.target.value)}
            placeholder="Type your JavaScript solution here..."
            style={{ width: '100%', minHeight: 200, fontFamily: 'monospace', fontSize: 14, padding: 12 }}
          />
          <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
            <button className="btn-primary" onClick={handleSubmitPeerReview} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit to Peer Review'}
            </button>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <button className="btn-secondary" onClick={handleBack}>← Back to Challenges</button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      {renderContent()}
    </div>
  );
}

export default ChallengeDetailPage;
