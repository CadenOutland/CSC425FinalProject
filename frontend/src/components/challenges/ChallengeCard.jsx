import PropTypes from 'prop-types';
import ProgressBar from '../progress/ProgressBar';

/**
 * ChallengeCard - polished card for challenge listing
 * Props:
 *  - challenge: { id, title, description, difficulty, subject, points, type }
 *  - onStart, onView (callbacks)
 */
export default function ChallengeCard({ challenge = {}, onStart = () => {}, onView = () => {} }) {
  const {
    id, title = 'Untitled Challenge', description = '', difficulty = 'Medium', subject = 'General', points = 10, type = 'practice'
  } = challenge;

  const difficultyColor = difficulty.toLowerCase() === 'hard' ? '#ef4444' : difficulty.toLowerCase() === 'easy' ? '#10b981' : '#f59e0b';

  return (
    <article className="challenge-card card" aria-labelledby={`challenge-${id}`}>
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12}}>
        <div style={{flex:1}}>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <div style={{fontWeight:800}} id={`challenge-${id}`}>{title}</div>
            <div className="small-meta">• {subject}</div>
          </div>
          <p className="muted" style={{marginTop:8}}>{description}</p>

          <div style={{display:'flex', gap:10, marginTop:12, alignItems:'center'}}>
            <span className="badge badge-sub"> {subject} </span>
            <span className="badge" style={{background:'rgba(6,182,212,0.06)', color:'#06b6d4', fontWeight:700}}>{type}</span>
            <span className="badge" style={{background:'rgba(0,0,0,0.04)', color:difficultyColor, fontWeight:700}}>{difficulty}</span>
            <div className="small-meta" style={{marginLeft:6}}> {points} pts</div>
          </div>
        </div>

        <div style={{width:170, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10}}>
          {/* sample progress/demo – in real app compute user progress */}
          <div style={{width:'100%'}}>
            <div style={{fontSize:12, color:'var(--muted)', marginBottom:6, textAlign:'right'}}>Your progress</div>
            <ProgressBar percent={Math.min(68, 100)} height={10} animate />
          </div>

          <div style={{display:'flex', gap:8}}>
            <button className="btn btn-primary" onClick={() => onStart(challenge)}>Start</button>
            <button className="btn btn-ghost" onClick={() => onView(challenge)}>View</button>
          </div>
        </div>
      </div>
    </article>
  );
}

ChallengeCard.propTypes = {
  challenge: PropTypes.object,
  onStart: PropTypes.func,
  onView: PropTypes.func
};

