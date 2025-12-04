import React from 'react';
import './ChallengeModal.css';

const ChallengeModal = ({ challenge, open, onClose, onSave, saving }) => {
  if (!open || !challenge) return null;

  return (
    <div className="challenge-modal-backdrop" onClick={onClose}>
      <div className="challenge-modal" onClick={(e) => e.stopPropagation()}>
        <header className="challenge-modal-header">
          <h3>{challenge.title}</h3>
          <div className="challenge-meta">
            <span className="difficulty">{challenge.difficulty || 'Medium'}</span>
            <span className="points">+{challenge.points || 0} pts</span>
          </div>
        </header>

        <div className="challenge-modal-body">
          <p className="challenge-desc">{challenge.description || challenge.instructions}</p>

          {challenge.instructions && (
            <div>
              <h4>Instructions</h4>
              <p>{challenge.instructions}</p>
            </div>
          )}

          <div className="challenge-attrs">
            {challenge.estimatedTime && <div>Estimated: {challenge.estimatedTime} min</div>}
            {challenge.category && <div>Category: {challenge.category}</div>}
            {challenge.goalId && <div>Goal: {challenge.goalId}</div>}
          </div>
        </div>

        <footer className="challenge-modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>Close</button>
          <button className="btn-primary" onClick={() => onSave(challenge)} disabled={saving}>{saving ? 'Saving…' : 'Save Challenge'}</button>
        </footer>
      </div>
    </div>
  );
};

export default ChallengeModal;
