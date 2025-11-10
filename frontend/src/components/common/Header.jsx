// frontend/src/components/common/Header.jsx
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="sw-header">
      <div className="sw-logo">SkillWise</div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/challenges">Challenges</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
}
