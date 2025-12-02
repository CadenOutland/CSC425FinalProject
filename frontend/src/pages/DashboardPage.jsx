import { Link, useLocation } from "react-router-dom";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: "/dashboard", label: "Overview", icon: "📊" },
    { path: "/goals", label: "Goals", icon: "🎯" },
    { path: "/challenges", label: "Challenges", icon: "🚀" },
    { path: "/progress", label: "Progress", icon: "📈" },
    { path: "/peer-review", label: "Peer Review", icon: "👥" },
    { path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-10 px-6 shadow-lg">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-purple-100 mt-2 text-lg">
          Track your learning progress, achievements, and goals.
        </p>
      </header>

      {/* Page Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl min-h-screen p-6 hidden md:block">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">SkillWise</h2>
            <p className="text-gray-500 mt-1">
              Welcome, {user?.firstName || "Student"}!
            </p>
          </div>

          <nav>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                      location.pathname === item.path
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <DashboardOverview />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;


