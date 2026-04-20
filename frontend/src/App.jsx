import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CircleDetail from "./pages/CircleDetail";
import Create from "./pages/CreateCircle";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";

// 🔥 PRODUCTION API
const API = "https://dbms-final-project-q07u.onrender.com";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const { user, isLoaded } = useUser();

  // 🔥 SYNC USER WITH BACKEND
  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        await fetch(`${API}/api/sync-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            username:
              user.username ||
              user.firstName ||
              "user",
          }),
        });
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return (
    <BrowserRouter>
      {/* 🔥 NAVBAR */}
      <Navbar setShowLogin={setShowLogin} />

      {/* 🔥 ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/circle/:id" element={<CircleDetail />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* 🔥 LOGIN MODAL */}
      {showLogin && (
        <LoginModal close={() => setShowLogin(false)} />
      )}
    </BrowserRouter>
  );
}

export default App;