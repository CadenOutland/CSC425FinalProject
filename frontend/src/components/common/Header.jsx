import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleBack = () => {
    // Use router navigation; fallback to window.history
    try {
      navigate(-1);
    } catch (e) {
      window.history.back();
    }
  };

  const handleLogout = async () => {
    await logout();
    // After logout, navigate to login
    navigate('/login');
  };

  // Show back button on most pages, but hide on root and dashboard routes
  const showBack =
    location.pathname &&
    location.pathname !== '/' &&
    !location.pathname.startsWith('/dashboard');

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="nav-left">
          {showBack ? (
            <button className="btn-back" onClick={handleBack} aria-label="Go back">
              ← Back
            </button>
          ) : (
            <Link to="/" className="brand-link">
              <h1 className="brand">SkillWise</h1>
            </Link>
          )}
        </div>

        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/goals" className="nav-item">Goals</Link>
          <Link to="/challenges" className="nav-item">Challenges</Link>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-actions">
              <span className="user-name">{user?.firstName || user?.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="nav-item btn-primary">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;