import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* HERO SECTION */}
      <section className="hero py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-purple-600">SkillWise</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Your AI-powered learning companion designed to accelerate your skill
            development with smart guidance, progress tracking, and peer learning.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Link
              to="/signup"
              className="btn-primary bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className="btn-secondary border border-purple-600 text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features py-16 px-6 bg-white shadow-inner">
        <div className="max-w-6xl mx-auto">
          <h2 classname="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
            Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {/* CARD 1 */}
            <div className="feature-card bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
              <p className="text-gray-600">
                Get personalized suggestions to improve your work using advanced AI.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="feature-card bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
              <p className="text-gray-600">
                Set learning goals, track your performance, and stay motivated.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="feature-card bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Peer Reviews</h3>
              <p className="text-gray-600">
                Learn collaboratively by reviewing and improving with peers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Level Up Your Skills?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join SkillWise today and unlock a smarter, faster, and more fun way to learn.
        </p>

        <Link
          to="/signup"
          className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition"
        >
          Start Learning Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
