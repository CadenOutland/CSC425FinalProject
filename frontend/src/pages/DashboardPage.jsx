import { useEffect, useState } from 'react';
import ProgressBar from '../components/progress/ProgressBar';

function Sparkline({ data = [], color = '#2563eb' }) {
  // data: array of numbers normalized
  if (!data || data.length === 0) return <svg className="sparkline" />;
  const w = 120, h = 34, pad = 4;
  const max = Math.max(...data), min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad;
    const y = h - pad - (max === min ? h/2 : ((v - min) / (max - min)) * (h - pad * 2));
    return `${x},${y}`;
  }).join(' ');
  const d = `M ${points}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="sparkline" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // try /api first, fallback to mock
    (async () => {
      try {
        const res = await fetch('/api/progress/stats');
        if (!res.ok) throw new Error('no api');
        const data = await res.json();
        setStats({
          points: data.total_points || 860,
          completed: data.completed_challenges || 18,
          avgScore: data.average_score || 82,
          attempts: data.total_attempts || 42,
          spark1: [12,34,28,43,55,40,52],
          spark2: [5,14,9,22,30,26,34],
          spark3: [50,60,62,78,80,88,95],
        });
      } catch (e) {
        setStats({
          points: 860,
          completed: 18,
          avgScore: 82,
          attempts: 42,
          spark1: [12,34,28,43,55,40,52],
          spark2: [5,14,9,22,30,26,34],
          spark3: [50,60,62,78,80,88,95],
        });
      }
    })();
  }, []);

  if (!stats) return <div className="container"><div className="card">Loading dashboard…</div></div>;

  return (
    <div className="container">
      <div className="card card-header">
        <div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <h2 style={{margin:0}}>Welcome back</h2>
            <div className="small-meta">— your learning overview</div>
          </div>
          <div className="muted" style={{marginTop:6}}>Quick snapshot of recent progress and points</div>
        </div>
        <div className="center">
          <button className="btn btn-primary">New Goal</button>
        </div>
      </div>

      <div style={{marginTop:18}} className="grid grid-3">
        <div className="card widget">
          <div className="card-title">Total Points</div>
          <div className="num">{stats.points}</div>
          <div className="label">Points earned across challenges</div>
          <Sparkline data={stats.spark3} color="#2563eb" />
        </div>

        <div className="card widget">
          <div className="card-title">Completed</div>
          <div className="num">{stats.completed}</div>
          <div className="label">Challenges completed</div>
          <Sparkline data={stats.spark1} color="#06b6d4" />
        </div>

        <div className="card widget">
          <div className="card-title">Avg Score</div>
          <div className="num">{Math.round(stats.avgScore)}%</div>
          <div className="label">Average score on completed tasks</div>
          <Sparkline data={stats.spark2} color="#f59e0b" />
        </div>
      </div>

      <div style={{marginTop:18}} className="grid grid-2">
        <div className="card">
          <h3 style={{marginTop:0}}>Weekly Activity</h3>
          <div style={{display:'grid', gap:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="small-meta">Challenges completed this week</div>
              <div style={{fontWeight:700}}>4</div>
            </div>
            <ProgressBar percent={67} animate />
            <div style={{display:'flex', gap:12}}>
              <div style={{flex:1}}><small className="muted">Time spent</small><div style={{fontWeight:700}}>6h 12m</div></div>
              <div style={{flex:1}}><small className="muted">New Goals</small><div style={{fontWeight:700}}>2</div></div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{marginTop:0}}>Recent Activities</h3>
          <ul style={{margin:0, paddingLeft:18}}>
            <li className="small-meta">Solved: Recurrence Practice — <strong>+40 pts</strong></li>
            <li className="small-meta">Completed: Arrays Drill — <strong>+10 pts</strong></li>
            <li className="small-meta">Started Goal: Finish Sprint 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
