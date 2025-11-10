import { useEffect, useState } from 'react';
import ChallengeCard from '../components/challenges/ChallengeCard';

export default function ChallengesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/challenges');
        if (!res.ok) throw new Error('no challenges');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.challenges || []);
      } catch (e) {
        setItems([
          { id: 'c1', title: 'Arrays Drill', description: '10 quick array problems', difficulty: 'Easy', points: 10, subject: 'CS' },
          { id: 'c2', title: 'Recurrence Practice', description: 'Identify Big-O from recurrence', difficulty: 'Hard', points: 40, subject: 'Algorithms' },
        ]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const accept = (c) => alert(`Accepted: ${c.title}`);
  const view = (c) => alert(`View: ${c.title}`);

  return (
    <div>
      <header style={{marginBottom: '18px'}}>
        <h1>Challenges</h1>
        <p className="muted">Pick a challenge and test your skills.</p>
      </header>

      {loading ? <div className="card">Loading…</div> : (
        <div style={{display:'grid', gap:16}}>
          {items.map(ch => <ChallengeCard key={ch.id} challenge={ch} onAccept={accept} onView={view} />)}
        </div>
      )}
    </div>
  );
}

