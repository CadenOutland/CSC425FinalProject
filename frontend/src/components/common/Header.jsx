import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold gradient-text">
          SkillWise
        </Link>

        {/* Nav Menu */}
        <nav className="flex items-center gap-6 text-gray-700 font-medium">
          {user && (
            <>
              <NavLink to="/dashboard" className="hover:text-purple-600">
                Dashboard
              </NavLink>
              <NavLink to="/goals" className="hover:text-purple-600">
                Goals
              </NavLink>
              <NavLink to="/challenges" className="hover:text-purple-600">
                Challenges
              </NavLink>
              <NavLink to="/progress" className="hover:text-purple-600">
                Progress
              </NavLink>
              <NavLink to="/leaderboard" className="hover:text-purple-600">
                Leaderboard
              </NavLink>
              <NavLink to="/peer-review" className="hover:text-purple-600">
                Peer Review
              </NavLink>
              <NavLink to="/profile" className="hover:text-purple-600">
                Profile
              </NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" className="hover:text-purple-600">
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Sign Up
              </NavLink>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
