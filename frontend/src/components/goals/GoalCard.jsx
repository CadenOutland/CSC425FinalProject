import ProgressBar from '../progress/ProgressBar';

export default function GoalCard({ goal = {} }) {
  const {
    title = 'Untitled Goal',
    description = '',
    progress = 0,
    dueDate = null,
    tags = []
  } = goal;

  return (
    <div className="card goal-card">
      <div>
        <div className="card-title">{title}</div>
        <div className="card-sub">{description}</div>
      </div>

      <div className="card-meta" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {tags.slice(0, 3).map((t, i) => (
            <span key={i} style={{ fontSize: 12, padding: '4px 8px', borderRadius: 8, background: 'rgba(15,17,32,0.04)' }}>
              {t}
            </span>
          ))}
        </div>
        <div className="pct-badge">{Math.round(progress)}%</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <ProgressBar value={progress} />
      </div>

      <div className="card-meta" style={{ marginTop: 6 }}>
        <small className="card-sub">{dueDate ? `Due ${new Date(dueDate).toLocaleDateString()}` : 'No due date'}</small>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 13 }}>Edit</button>
          <button className="btn" style={{ background: 'transparent', border: '1px solid rgba(15,17,32,0.06)' }}>Open</button>
        </div>
      </div>
    </div>
  );
}
