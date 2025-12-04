// TODO: Implement signup/registration page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
        const result = await register(data);
      
      if (result.success) {
        // Registration successful - user is now logged in
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <h1>SkillWise</h1>
            </Link>
            <h2>Create Your Account</h2>
            <p>Start your personalized learning journey today</p>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner message="Creating your account..." />
          ) : (
            <SignupForm onSubmit={async (data) => {
              try {
                setIsLoading(true);
                setError('');
                const result = await register(data);
                if (result.success) {
                  navigate('/dashboard');
                } else {
                  setError(result.error || 'Registration failed. Please try again.');
                }
              } catch (err) {
                setError(err.message || 'Registration failed. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }} />
          )}

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-background">
          <div className="auth-features">
            <h3>What you'll get:</h3>
            <ul>
              <li>✅ Personalized learning paths</li>
              <li>✅ AI-powered feedback</li>
              <li>✅ Progress tracking</li>
              <li>✅ Peer learning community</li>
              <li>✅ Achievement system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;