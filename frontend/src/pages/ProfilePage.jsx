import { useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Nithin Deepa",
    email: "nithin@example.com",
    role: "Student",
    points: 1240,
    streak: 12,
    bio: "CS major passionate about AI, data science, and learning.",
  });

  const [editing, setEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleSave = () => {
    setUser(tempUser);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-5xl text-white shadow-xl">
              👤
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>

            <div className="flex gap-6 mt-6">
              <div className="text-center">
                <p className="text-purple-600 text-2xl font-bold">{user.points}</p>
                <p className="text-gray-500 text-sm">Points</p>
              </div>

              <div className="text-center">
                <p className="text-purple-600 text-2xl font-bold">{user.streak}</p>
                <p className="text-gray-500 text-sm">Day Streak</p>
              </div>

              <div className="text-center">
                <p className="text-purple-600 text-2xl font-bold">{user.role}</p>
                <p className="text-gray-500 text-sm">Role</p>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700"
              >
                Edit Profile
              </button>
            ) : (
              ""
            )}
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="mt-10 border-t pt-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Edit Profile
              </h2>

              <div className="grid gap-6">
                {/* Name */}
                <div>
                  <label className="text-gray-700 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={tempUser.name}
                    onChange={(e) =>
                      setTempUser({ ...tempUser, name: e.target.value })
                    }
                    className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    value={tempUser.email}
                    onChange={(e) =>
                      setTempUser({ ...tempUser, email: e.target.value })
                    }
                    className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-gray-700 font-medium">Bio</label>
                  <textarea
                    value={tempUser.bio}
                    onChange={(e) =>
                      setTempUser({ ...tempUser, bio: e.target.value })
                    }
                    className="mt-2 w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Section */}
        <div className="mt-10 bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>

          <ul className="space-y-4">
            <li className="bg-gray-100 p-4 rounded-lg flex justify-between">
              <span>Completed "JS Async Challenge"</span>
              <span className="text-purple-600 font-semibold">+120 pts</span>
            </li>

            <li className="bg-gray-100 p-4 rounded-lg flex justify-between">
              <span>Reviewed a peer submission</span>
              <span className="text-purple-600 font-semibold">+80 pts</span>
            </li>

            <li className="bg-gray-100 p-4 rounded-lg flex justify-between">
              <span>Set a new weekly learning goal</span>
              <span className="text-purple-600 font-semibold">+50 pts</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
