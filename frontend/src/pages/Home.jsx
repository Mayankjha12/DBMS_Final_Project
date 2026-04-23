import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import LoginModal from "../components/LoginModal";

function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const handleGetStarted = () => {
    if (!isLoaded) return;

    if (user) {
      navigate("/dashboard");
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ff] relative overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 blur-3xl opacity-70"></div>

      {/* 🔥 HERO */}
      <div className="relative pt-44 px-6 text-center max-w-6xl mx-auto">

        <h1 className="text-7xl md:text-8xl font-bold leading-tight">
          Learn together in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            small circles.
          </span>
        </h1>

        <p className="mt-8 text-gray-500 text-xl max-w-3xl mx-auto leading-relaxed">
          LearnCircle helps you stay consistent with your goals —  
          build circles, complete tasks, and chat with like-minded learners.
        </p>

        {/* BUTTONS */}
        <div className="mt-12 flex justify-center gap-6">

          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-10 py-4 rounded-full shadow-xl hover:scale-105 transition text-lg"
          >
            {user ? "Go to dashboard →" : "Get started →"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/80 backdrop-blur-md px-10 py-4 rounded-full shadow hover:bg-white transition text-lg"
          >
            Browse circles
          </button>

        </div>
      </div>

      {/* 🔥 FEATURES (UPGRADED) */}
      <div className="relative mt-40 px-12 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Everything you need to stay consistent
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition border">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold">Circles</h3>
            <p className="text-gray-500 mt-3">
              Join or create small learning groups with shared goals.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition border">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold">Tasks</h3>
            <p className="text-gray-500 mt-3">
              Weekly goals to keep you consistent and accountable.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition border">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold">Live Chat</h3>
            <p className="text-gray-500 mt-3">
              Stay connected with your circle in real-time.
            </p>
          </div>

        </div>
      </div>

      {/* 🔥 CTA SECTION (NEW 🔥) */}
      <div className="relative mt-40 mb-20 px-6">

        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-3xl p-12 text-center shadow-2xl">

          <h2 className="text-3xl font-bold mb-4">
            Start your learning journey today
          </h2>

          <p className="opacity-90 mb-8">
            Create your own circle, add tasks, and grow together.
          </p>

          <div className="flex justify-center gap-4">

            <button
              onClick={() => {
                if (!user) return setOpen(true);
                navigate("/create");
              }}
              className="bg-white text-purple-600 px-6 py-3 rounded-full font-medium hover:scale-105 transition"
            >
              Create Circle
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-purple-600 transition"
            >
              Explore
            </button>

          </div>

        </div>
      </div>

      {/* LOGIN MODAL */}
      {open && <LoginModal close={() => setOpen(false)} />}
    </div>
  );
}

export default Home;