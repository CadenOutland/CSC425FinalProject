// TODO: Implement home/landing page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to SkillWise</h1>
          <p>Your AI-powered learning companion for skill development</p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={handleGetStarted}>
              {user ? '✨ Go to Dashboard' : '🚀 Get Started'}
            </button>
            <button className="btn-secondary" onClick={handleLearnMore}>
              📚 Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose SkillWise?</h2>
          <div className="features-grid">
            {/* TODO: Add feature cards */}
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
              <h3>AI-Powered Feedback</h3>
              <p>
                Get personalized, intelligent feedback on your work instantly.
                Our AI helps you learn faster and smarter.
              </p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
              <h3>Goal Tracking</h3>
              <p>
                Set, track, and achieve your learning goals with interactive
                progress visualization and milestones.
              </p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥</div>
              <h3>Peer Reviews</h3>
              <p>
                Learn from your peers through collaborative reviews and
                constructive feedback from the community.
              </p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
              <h3>Performance Analytics</h3>
              <p>
                Track detailed analytics of your learning journey with
                comprehensive progress reports and insights.
              </p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
              <h3>Leaderboards & Achievements</h3>
              <p>
                Compete with others, earn badges, and climb the leaderboard as
                you master new skills.
              </p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
              <h3>Adaptive Learning</h3>
              <p>
                Experience learning paths that adapt to your pace and style,
                optimized for your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: 'var(--spacing-2xl) var(--spacing-lg)',
          background:
            'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
            Ready to Level Up Your Skills?
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: 'var(--spacing-lg)',
              fontSize: 'var(--text-lg)',
            }}
          >
            Join thousands of learners already using SkillWise to achieve their
            goals
          </p>
          <button
            className="btn-secondary"
            onClick={handleLearnMore}
            style={{
              fontSize: 'var(--text-lg)',
              padding: 'var(--spacing-md) var(--spacing-2xl)',
              minWidth: '160px',
              background: 'white',
              color: 'var(--primary-color)',
            }}
          >
            📚 Learn More
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
