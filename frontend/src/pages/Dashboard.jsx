import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API = "https://dbms-final-project-q07u.onrender.com";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 DUMMY DATA (fallback + UI fill)
  const dummyCircles = [
    {
      id: 101,
      title: "React Mastery",
      description: "Learn React from basics to advanced 🚀",
      members: 24,
      tag: "Frontend"
    },
    {
      id: 102,
      title: "DSA Grind",
      description: "Daily coding + discussion",
      members: 40,
      tag: "Coding"
    },
    {
      id: 103,
      title: "AI/ML Circle",
      description: "Projects + ML concepts",
      members: 18,
      tag: "AI"
    },
    {
      id: 104,
      title: "UI/UX Design",
      description: "Design systems & Figma",
      members: 12,
      tag: "Design"
    },
    {
      id: 105,
      title: "Startup Builders",
      description: "Build startup ideas",
      members: 9,
      tag: "Product"
    },
    {
      id: 106,
      title: "Backend Dev",
      description: "APIs, DB & scaling",
      members: 21,
      tag: "Backend"
    }
  ];

  // 🔥 LOAD + SMART FALLBACK
  useEffect(() => {
    fetch(`${API}/api/circles`)
      .then(res => res.json())
      .then(data => {
        let finalData = data || [];

        // 🔥 enrich backend data
        finalData = finalData.map((c, i) => ({
          ...c,
          members: Math.floor(Math.random() * 50) + 5,
          tag: ["Frontend", "AI", "Design", "Backend"][i % 4]
        }));

        // 🔥 ensure minimum 6 cards
        if (finalData.length < 6) {
          const extraNeeded = 6 - finalData.length;
          finalData = [
            ...finalData,
            ...dummyCircles.slice(0, extraNeeded)
          ];
        }

        setCircles(finalData);
      })
      .catch(() => {
        // 🔥 if backend fails completely
        setCircles(dummyCircles);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3ff]">

      {/* BG GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-[260px] bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 blur-2xl opacity-70"></div>

      <div className="relative px-12 pt-20">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Explore circles</h1>
            <p className="text-gray-500 mt-2">
              Join communities and learn together.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) return alert("Login required");
              navigate("/create");
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            + New circle
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {loading ? (
            <p className="text-gray-500">Loading circles...</p>
          ) : (
            circles.map((c) => (
              <div
                key={c.id}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40 
                hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                  👥 {c.members || Math.floor(Math.random() * 50) + 5} members
                </div>

                {/* LINE */}
                <div className="h-[1px] bg-gray-200 my-4"></div>

                {/* FOOTER */}
                <div className="flex justify-between items-center">

                  <button
                    onClick={() => navigate(`/circle/${c.id}`)}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    Open →
                  </button>

                  <button
                    onClick={() => alert("Followed!")}
                    className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600"
                  >
                    Follow
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;