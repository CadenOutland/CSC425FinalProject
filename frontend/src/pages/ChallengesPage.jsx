// TODO: Implement challenges browsing and participation page
import React, { useState, useEffect } from 'react';
import ChallengeCard from '../components/challenges/ChallengeCard';
import ChallengeModal from '../components/challenges/ChallengeModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AIChallengeGenerator from '../components/AIChallengeGenerator';
import { apiService } from '../services/api';
import './ChallengesPage.css';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'ai-generator'
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });
  // Removed inline AI prompt and generation from Browse tab
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChallenge, setModalChallenge] = useState(null);
  const [saving, setSaving] = useState(false);

  const refreshChallenges = async () => {
    try {
      const res = await apiService.challenges.getAll();
      const data = res.data?.data || res.data;
      setChallenges(data || []);
      setFilteredChallenges(data || []);
    } catch (err) {
      console.error('Failed to refresh challenges', err);
    }
  };

  const handleSaveChallenge = async (challengeToSave) => {
    try {
      setSaving(true);
      // Prepare payload that backend expects (title, description,...)
      const payload = {
        title: challengeToSave.title,
        description: challengeToSave.description || challengeToSave.instructions || '',
        category: challengeToSave.category || 'general',
        difficulty: challengeToSave.difficulty || 'medium',
        points: challengeToSave.points || 0,
        estimatedTime: challengeToSave.estimatedTime || null,
        tags: challengeToSave.tags || [],
        instructions: challengeToSave.instructions || null,
        goalId: challengeToSave.goalId || null,
      };

      const res = await apiService.challenges.create(payload);
      const saved = res.data?.data || res.data;
      if (saved) {
        // Replace modal item with server-saved item at top of lists
        setChallenges(prev => [saved, ...prev]);
        setFilteredChallenges(prev => [saved, ...prev]);
        setModalOpen(false);
        setModalChallenge(null);
      }
    } catch (err) {
      console.error('Save challenge failed', err);
      alert('Failed to save challenge. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  // Fetch real challenges
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await apiService.challenges.getAll();
        const data = res.data?.data || res.data;
        console.log('Initial fetch - challenges:', data, 'Count:', data?.length);
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

  // Refresh challenges when switching to browse tab
  useEffect(() => {
    if (activeTab === 'browse') {
      const fetch = async () => {
        try {
          const res = await apiService.challenges.getAll();
          const data = res.data?.data || res.data;
          console.log('Fetched challenges:', data);
          setChallenges(data || []);
          setFilteredChallenges(data || []);
        } catch (err) {
          console.error('Failed to fetch challenges', err);
        }
      };
      fetch();
    }
  }, [activeTab]);

  // Filter challenges based on current filters
  useEffect(() => {
    let filtered = challenges;

    if (filters.category) {
      filtered = filtered.filter(challenge => 
        challenge.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(challenge => 
        challenge.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    if (filters.search) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        challenge.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (challenge.tags && challenge.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase())))
      );
    }

    setFilteredChallenges(filtered);
  }, [challenges, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="challenges-page">
      <div className="page-header">
        <h1>Learning Challenges</h1>
        <p>Browse saved challenges. To generate new ones, use AI Challenge Generator.</p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-navigation">
        <button 
          className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Challenges
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ai-generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-generator')}
        >
          AI Challenge Generator
        </button>
      </div>

      {/* Browse Challenges Tab */}
      {activeTab === 'browse' && (
        <>
          <div className="challenges-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="search">Search Challenges</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, description, or tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="backend">Backend</option>
              <option value="data-science">Data Science</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Inline AI prompt removed: generation now handled in AI Challenge Generator tab */}

          <div className="filter-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        {/* Inline AI generation button removed */}

        <div className="results-summary">
          <p>Showing {filteredChallenges.length} of {challenges.length} challenges</p>
        </div>
      </div>

      <div className="challenges-content">
        {loading ? (
          <LoadingSpinner message="Loading challenges..." />
        ) : filteredChallenges.length > 0 ? (
          <div className="challenges-grid">
            {filteredChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} onDelete={refreshChallenges} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No challenges found</h3>
            <p>Try adjusting your filters or search terms.</p>
            <button 
              className="btn-secondary"
              onClick={() => setFilters({ category: '', difficulty: '', search: '' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
        </>
      )}

      {/* AI Challenge Generator Tab */}
      {activeTab === 'ai-generator' && (
        <AIChallengeGenerator />
      )}

      {/* Challenge preview / save modal */}
      <ChallengeModal
        open={modalOpen}
        challenge={modalChallenge}
        onClose={() => { setModalOpen(false); setModalChallenge(null); }}
        onSave={handleSaveChallenge}
        saving={saving}
      />

    </div>
  );
};

export default ChallengesPage;