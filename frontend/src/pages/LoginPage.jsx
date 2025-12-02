import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setError('');

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT: CARD */}
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                SkillWise
              </span>
            </Link>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to continue your learning journey.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8">
              <LoadingSpinner message="Signing you in..." />
            </div>
          ) : (
            <LoginForm onSubmit={handleLogin} />
          )}

          <div className="mt-6 text-sm text-slate-500">
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-700">
                Sign up here
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/forgot-password" className="text-slate-500 hover:text-slate-700">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT: SIDE INFO */}
        <div className="hidden md:flex flex-col text-slate-100 space-y-6">
          <div>
            <h3 className="text-3xl font-bold">
              Learn smarter, not harder.
            </h3>
            <p className="mt-3 text-slate-300 text-sm">
              SkillWise gives you AI-powered feedback, clear goals, and peer
              support so you can move from confusion to confidence.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 space-y-3">
            <p className="text-sm italic">
              &quot;SkillWise transformed how I learn. The feedback is clear,
              fast, and actually useful.&quot;
            </p>
            <p className="text-sm text-slate-400">— Sarah K., Software Developer</p>
          </div>

          <ul className="text-sm space-y-2 text-slate-300">
            <li>✅ Personalized feedback on your work</li>
            <li>✅ Visual dashboards for your progress</li>
            <li>✅ Goals and streaks to keep you motivated</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

