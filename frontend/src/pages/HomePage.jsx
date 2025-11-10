// frontend/src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to <span>SkillWise</span></h1>
        <p>Your AI-powered learning companion for growth.</p>

        <div className="cta-buttons">
          <Link to="/signup" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-list">
          <div className="feature-card">AI Feedback</div>
          <div className="feature-card">Goal Tracking</div>
          <div className="feature-card">Peer Reviews</div>
        </div>
      </section>
    </div>
  );
}
