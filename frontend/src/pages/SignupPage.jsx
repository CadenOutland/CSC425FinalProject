import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const SignupPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-950 to-indigo-900 flex items-center justify-center px-4">
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
              Create Your Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Start your personalized learning journey today.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8">
              <LoadingSpinner message="Creating your account..." />
            </div>
          ) : (
            <SignupForm
              onSubmit={async (data) => {
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
              }}
            />
          )}

          <div className="mt-6 text-sm text-slate-500">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT: BENEFITS */}
        <div className="hidden md:flex flex-col text-slate-100 space-y-6">
          <div>
            <h3 className="text-3xl font-bold">What you&apos;ll get</h3>
            <p className="mt-3 text-slate-300 text-sm">
              SkillWise brings everything into one place so you can see your
              growth clearly and stay motivated.
            </p>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
              <h4 className="font-semibold mb-1">🎯 Personalized learning paths</h4>
              <p className="text-slate-300">
                Goals that adapt to where you are and where you want to go.
              </p>
            </div>
            <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
              <h4 className="font-semibold mb-1">🤖 AI-powered feedback</h4>
              <p className="text-slate-300">
                Clear suggestions to improve your code, writing, and solutions.
              </p>
            </div>
            <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
              <h4 className="font-semibold mb-1">📈 Progress tracking & streaks</h4>
              <p className="text-slate-300">
                Beautiful dashboards that show your effort turning into progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
