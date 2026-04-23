import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Please login</p>
      </div>
    );
  }

  // 🔥 DUMMY STATS
  const stats = {
    points: 320,
    level: 3,
    tasksCompleted: 18,
    totalTasks: 25,
    circlesJoined: 4
  };

  const completion =
    Math.round((stats.tasksCompleted / stats.totalTasks) * 100);

  // 🔥 POINTS HISTORY
  const history = [
    { id: 1, action: "Joined a circle", points: 5 },
    { id: 2, action: "Completed task", points: 15 },
    { id: 3, action: "Uploaded resource", points: 10 },
    { id: 4, action: "Got 10 views", points: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">

      <div className="max-w-5xl mx-auto">

        {/* 🔥 PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex items-center gap-6">

          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-24 h-24 rounded-full"
          />

          <div>
            <h2 className="text-2xl font-bold">
              {user.fullName || "User"}
            </h2>

            <p className="text-gray-500">
              {user.primaryEmailAddress?.emailAddress}
            </p>

            <p className="text-gray-400 text-sm mt-1">
              📱 {user.primaryPhoneNumber?.phoneNumber || "Not added"}
            </p>

            {/* 🔥 MY CIRCLES BUTTON */}
            <button
              onClick={() => navigate("/mycircles")}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              My Circles →
            </button>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{stats.points}</p>
            <p className="text-gray-500">Points</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{stats.level}</p>
            <p className="text-gray-500">Level</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
            <p className="text-gray-500">Tasks Done</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{stats.circlesJoined}</p>
            <p className="text-gray-500">Circles</p>
          </div>

        </div>

        {/* 🔥 PROGRESS BAR */}
        <div className="bg-white mt-8 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-3">
            Task Completion
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full"
              style={{ width: `${completion}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {completion}% completed
          </p>
        </div>

        {/* 🔥 POINTS HISTORY */}
        <div className="bg-white mt-8 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Points History
          </h3>

          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-600">{h.action}</span>
                <span className="text-green-600 font-medium">
                  +{h.points}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;