// src/pages/ProgressPage.jsx (simplified)
import ProgressBar from "../components/progress/ProgressBar";

export default function ProgressPage({ goals = sampleGoals }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>My Progress</h2>
      {goals.map(g => (
        <div key={g.id} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{g.title}</strong>
            <span>{g.due ? new Date(g.due).toLocaleDateString() : ""}</span>
          </div>

          <ProgressBar label={`${g.progress}% Complete`} progress={g.progress} />
        </div>
      ))}
    </div>
  );
}


