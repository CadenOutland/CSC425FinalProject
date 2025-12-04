// TODO: Implement peer review and collaboration features
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import './PeerReviewPage.css';

// Simple expandable text component for long feedback
const ExpandableText = ({ text, maxChars = 250 }) => {
  const [expanded, setExpanded] = React.useState(false);
  if (!text) return null;
  const needsExpand = text.length > maxChars;
  const shown = expanded || !needsExpand ? text : text.slice(0, maxChars) + '…';
  return (
    <div className="expandable-text">
      <p className="feedback-text">{shown}</p>
      {needsExpand && (
        <button className="btn-link" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

const PeerReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('review-others');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch review queue and my submissions in parallel
        const [queueResponse, submissionsResponse] = await Promise.all([
          apiService.peerReview.getReviewQueue({ category: selectedCategory }),
          apiService.peerReview.getMySubmissions(),
        ]);

        setReviews(queueResponse.data?.data || queueResponse.data || []);
        setMySubmissions(submissionsResponse.data?.data || submissionsResponse.data || []);
      } catch (error) {
        console.error('Error fetching peer review data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const filteredReviews = reviews.filter(review => 
    selectedCategory === 'all' || review.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  const handleStartReview = (review) => {
    setSelectedReview(review);
    setReviewText('');
    setRating(5);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      alert('Please provide review feedback');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.peerReview.submitReview(selectedReview.id, {
        reviewText,
        rating,
      });

      alert('Review submitted successfully!');
      setSelectedReview(null);
      
      // Refresh the review queue
      const queueResponse = await apiService.peerReview.getReviewQueue({ category: selectedCategory });
      setReviews(queueResponse.data?.data || queueResponse.data || []);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseReview = () => {
    setSelectedReview(null);
    setReviewText('');
    setRating(5);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'under-review': { text: 'Under Review', className: 'status-pending' },
      'completed': { text: 'Completed', className: 'status-completed' },
      'needs-revision': { text: 'Needs Revision', className: 'status-warning' }
    };
    const config = statusConfig[status] || { text: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.text}</span>;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#4CAF50',
      'Intermediate': '#FF9800',
      'Advanced': '#F44336'
    };
    return colors[difficulty] || '#757575';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="peer-review-page">
      <div className="page-header">
        <h1>Peer Review</h1>
        <p>Collaborate with fellow learners and improve together</p>
      </div>

      <div className="review-tabs">
        <button
          className={`tab-button ${activeTab === 'review-others' ? 'active' : ''}`}
          onClick={() => setActiveTab('review-others')}
        >
          Review Others ({filteredReviews.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'my-submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-submissions')}
        >
          My Submissions ({mySubmissions.length})
        </button>
      </div>

      {activeTab === 'review-others' && (
        <div className="review-others-section">
          <div className="section-header">
            <h2>Help Others Improve</h2>
            <div className="filters">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="react">React</option>
                <option value="javascript">JavaScript</option>
                <option value="algorithms">Algorithms</option>
                <option value="css">CSS</option>
                <option value="database">Database</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading submissions for review..." />
          ) : (
            <div className="reviews-grid">
              {filteredReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="author-info">
                      <span className="author-avatar">👤</span>
                      <div>
                        <h4>{review.title}</h4>
                        <p>by User {review.submission_user_id?.substring(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="review-meta">
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(review.difficulty) }}
                      >
                        {review.difficulty}
                      </span>
                      <span className="category-badge">{review.status}</span>
                    </div>
                  </div>

                  <div className="review-content">
                    <p>{review.description || 'No description provided'}</p>
                    <div className="code-preview">
                      <code>{review.solution_code?.substring(0, 150)}...</code>
                    </div>
                  </div>

                  <div className="review-footer">
                    <div className="review-stats">
                      <span className="time-ago">{formatTimeAgo(review.created_at)}</span>
                      <span className="reviews-count">Pending Review</span>
                    </div>
                    
                    <button className="btn-primary" onClick={() => handleStartReview(review)}>
                      Start Review
                    </button>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No submissions available</h3>
                  <p>Check back later for new submissions to review!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-submissions' && (
        <div className="my-submissions-section">
          <div className="section-header">
            <h2>Your Submissions</h2>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your submissions..." />
          ) : (
            <div className="submissions-list">
              {mySubmissions.map((submission) => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <div className="submission-info">
                      <h4>{submission.title}</h4>
                      <div className="submission-meta">
                        <span className="category-badge">Programming</span>
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(submission.difficulty) }}
                        >
                          {submission.difficulty}
                        </span>
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>
                    <div className="submission-actions" />
                  </div>

                  <div className="submission-stats">
                    <div className="stat-item">
                      <strong>{submission.ai_score || 'N/A'}</strong>
                      <span>AI Score</span>
                    </div>
                    <div className="stat-item">
                      <strong>{submission.status}</strong>
                      <span>Status</span>
                    </div>
                    <div className="stat-item">
                      <strong>{formatTimeAgo(submission.created_at)}</strong>
                      <span>Submitted</span>
                    </div>
                  </div>

                  {submission.ai_feedback && (
                    <div className="latest-feedback">
                      <h5>AI Feedback:</h5>
                      <ExpandableText text={submission.ai_feedback} maxChars={250} />
                    </div>
                  )}

                  {submission.review_text && (
                    <div className="latest-feedback">
                      <h5>Peer Review:</h5>
                      <div className="peer-review-summary">
                        <div><strong>Rating:</strong> {submission.rating} / 5</div>
                        <ExpandableText text={submission.review_text} maxChars={250} />
                      </div>
                    </div>
                  )}

                  <div className="progress-bar">
                    <div className="progress-label">
                      Review Progress: {submission.reviewsReceived}/{submission.maxReviews}
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(submission.reviewsReceived / submission.maxReviews) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              {mySubmissions.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📤</div>
                  <h3>No submissions yet</h3>
                  <p>Submit your first piece of work to get feedback from peers!</p>
                  
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="review-tips">
        <h3>💡 Review Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Be Constructive</h4>
            <p>Focus on specific improvements and provide actionable feedback</p>
          </div>
          <div className="tip-card">
            <h4>Be Respectful</h4>
            <p>Remember there's a person behind the code. Be kind and encouraging</p>
          </div>
          <div className="tip-card">
            <h4>Be Specific</h4>
            <p>Point out exactly what works well and what could be improved</p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="review-modal-overlay" onClick={handleCloseReview}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Submission</h2>
              <button className="close-btn" onClick={handleCloseReview}>×</button>
            </div>

            <div className="modal-content">
              <div className="submission-details">
                <h3>{selectedReview.title}</h3>
                <div className="meta-info">
                  <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(selectedReview.difficulty) }}>
                    {selectedReview.difficulty}
                  </span>
                  <span className="time-ago">{formatTimeAgo(selectedReview.created_at)}</span>
                </div>
                
                {selectedReview.description && (
                  <div className="description">
                    <h4>Challenge Description:</h4>
                    <p>{selectedReview.description}</p>
                  </div>
                )}

                <div className="solution-code">
                  <h4>Solution Code:</h4>
                  <pre><code>{selectedReview.solution_code}</code></pre>
                </div>
              </div>

              <div className="review-form">
                <div className="form-group">
                  <label htmlFor="rating">Rating (1-5):</label>
                  <input
                    type="number"
                    id="rating"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                    className="rating-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reviewText">Your Review:</label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Provide constructive feedback on the code quality, approach, and areas for improvement..."
                    rows="8"
                    className="review-textarea"
                  />
                  <div className="char-count">{reviewText.length} characters</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseReview} disabled={submitting}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSubmitReview}
                disabled={submitting || !reviewText.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerReviewPage;