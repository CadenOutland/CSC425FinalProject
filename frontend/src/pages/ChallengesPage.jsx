import { useEffect, useState } from 'react';
import ChallengeCard from '../components/challenges/ChallengeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { apiService } from '../services/api';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await apiService.challenges.getAll();
        const data = res.data?.data || res.data;
        setChallenges(data || []);
        setFilteredChallenges(data || []);
      } catch (err) {
        console.error('Failed to fetch challenges', err);
        setChallenges([]);
        setFilteredChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    let filtered = challenges;

    if (filters.category) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.category.toLowerCase() === filters.category.toLowerCase(),
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.difficulty.toLowerCase() ===
          filters.difficulty.toLowerCase(),
      );
    }

    if (filters.search) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          challenge.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          challenge.tags?.some((tag) =>
            tag.toLowerCase().includes(filters.search.toLowerCase()),
          ),
      );
    }

    setFilteredChallenges(filtered);
  }, [challenges, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Learning Challenges
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">
              Enhance your skills with hands-on challenges designed to be
              realistic, focused, and fun.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Showing {filteredChallenges.length} of {challenges.length || 0}{' '}
              challenges
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="search"
                className="text-xs font-medium text-slate-500"
              >
                Search Challenges
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by title, description, or tags..."
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500 bg-slate-50"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-xs font-medium text-slate-500"
              >
                Category
              </label>
              <select
                id="category"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500"
                value={filters.category}
                onChange={(e) =>
                  handleFilterChange('category', e.target.value)
                }
              >
                <option value="">All Categories</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="backend">Backend</option>
                <option value="data-science">Data Science</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="difficulty"
                className="text-xs font-medium text-slate-500"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500"
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange('difficulty', e.target.value)
                }
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setFilters({ category: '', difficulty: '', search: '' })
              }
              className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Loading challenges..." />
          </div>
        ) : filteredChallenges.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No challenges found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your filters or search terms.
            </p>
            <button
              className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm rounded-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={() =>
                setFilters({ category: '', difficulty: '', search: '' })
              }
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;

