// TODO: Implement dashboard overview component
import { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

const DashboardOverview = () => {
  const [goals, setGoals] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [goalsRes, challengesRes] = await Promise.all([
          apiService.goals.getAll(),
          apiService.challenges.getAll(),
        ]);

        if (!mounted) return;

        setGoals(goalsRes.data.data.goals || []);
        setChallenges(challengesRes.data.data.challenges || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="dashboard-overview">
      <h1>Welcome to SkillWise</h1>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Goals</h3>
              <p className="stat-number">{goals.length}</p>
            </div>

            <div className="stat-card">
              <h3>Challenges</h3>
              <p className="stat-number">{challenges.length}</p>
            </div>

            <div className="stat-card">
              <h3>Current Streak</h3>
              <p className="stat-number">0 days</p>
            </div>
          </div>

          <div className="dashboard-sections">
            <section className="recent-goals">
              <h2>Recent Goals</h2>
              {goals.length === 0 ? (
                <p>No goals yet. Create one to get started.</p>
              ) : (
                <ul>
                  {goals.slice(0, 5).map((g) => (
                    <li key={g.id}>
                      {g.title} — {g.progress || 0}%
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="recommended-challenges">
              <h2>Recommended Challenges</h2>
              {challenges.length === 0 ? (
                <p>No challenges available yet.</p>
              ) : (
                <ul>
                  {challenges.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      {c.title} — {c.difficulty}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
