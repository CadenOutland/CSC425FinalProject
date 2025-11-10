import { useEffect, useState } from 'react';
import GoalCard from '../components/goals/GoalCard';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/goals');
        if (!res.ok) throw new Error('no goals from api');
        const data = await res.json();
        setGoals(Array.isArray(data) ? data : data.goals || []);
      } catch (e) {
        // fallback mock data
        setGoals([
          { id: 1, title: 'Finish Sprint 2', description: 'Integrate goals + challenges', progress: 35, target_date: null, type: 'Project', status: 'active' },
          { id: 2, title: 'Revise Algorithms', description: 'Study recurrences and Big-O', progress: 72, target_date: '2026-05-01', type: 'Study', status: 'active' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleEdit = (g) => alert(`Edit ${g.title}`);
  const handleDelete = (id) => setGoals((prev) => prev.filter(g => g.id !== id));

  return (
    <div>
      <header style={{marginBottom: '18px'}}>
        <h1>Goals</h1>
        <p className="muted">Track your learning goals — progress updates are saved locally while testing.</p>
      </header>

      {loading ? <div className="card">Loading goals…</div> : (
        <>
          <div style={{display:'grid', gap:16}}>
            {goals.map(g => (
              <GoalCard key={g.id} goal={g} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


