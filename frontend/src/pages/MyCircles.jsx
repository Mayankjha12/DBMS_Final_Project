import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API = "https://dbms-final-project-q07u.onrender.com";

function MyCircles() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [circles, setCircles] = useState([]);

  // 🔥 DUMMY (for UI richness)
  const dummyCircles = [
    {
      id: 1,
      title: "DSA Circle",
      description: "Practice daily problems 💻",
      members: 37,
      progress: 70,
      tag: "Coding"
    },
    {
      id: 2,
      title: "Web Dev Circle",
      description: "Build projects 🚀",
      members: 12,
      progress: 45,
      tag: "Frontend"
    },
    {
      id: 3,
      title: "AI Circle",
      description: "ML + Deep Learning 🤖",
      members: 20,
      progress: 60,
      tag: "AI"
    }
  ];

  useEffect(() => {
    if (!user) return;

    fetch(`${API}/api/circles`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          setCircles(dummyCircles);
        } else {
          const enhanced = data.slice(0, 6).map((c, i) => ({
            ...c,
            members: Math.floor(Math.random() * 50) + 5,
            progress: Math.floor(Math.random() * 100),
            tag: ["Frontend", "AI", "Design", "Backend"][i % 4]
          }));
          setCircles(enhanced);
        }
      })
      .catch(() => setCircles(dummyCircles));
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f5f3ff]">

      {/* TOP GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-[220px] bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 blur-2xl opacity-70"></div>

      <div className="relative px-12 pt-20">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">My Circles</h1>
          <p className="text-gray-500 mt-2">
            Circles you’re part of 👇
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {circles.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/circle/${c.id}`)}
              className="cursor-pointer bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40 
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* TOP */}
              <div className="flex justify-between items-start mb-4">

                <div className="w-12 h-12 flex items-center justify-center rounded-xl text-white font-bold bg-gradient-to-r from-purple-500 to-indigo-500">
                  {c.title?.charAt(0)}
                </div>

                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                  {c.tag || "General"}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold">{c.title}</h3>

              {/* DESC */}
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {c.description}
              </p>

              {/* MEMBERS */}
              <div className="mt-4 text-sm text-gray-600">
                👥 {c.members} members
              </div>

              {/* PROGRESS */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: `${c.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-5">

                <span className="text-purple-600 text-sm font-medium">
                  Continue →
                </span>

                <span className="text-gray-400 text-lg">↗</span>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default MyCircles;