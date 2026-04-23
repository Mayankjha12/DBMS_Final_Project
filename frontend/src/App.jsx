import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateCircle from "./pages/CreateCircle";
import CircleDetail from "./pages/CircleDetail";
import Profile from "./pages/Profile";
import MyCircles from "./pages/MyCircles"; // if you created

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>

      {/* NAVBAR */}
      <Navbar setShowLogin={setShowLogin} />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateCircle />} />
        <Route path="/circle/:id" element={<CircleDetail />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* OPTIONAL */}
        <Route path="/mycircles" element={<MyCircles />} />
      </Routes>

      {/* LOGIN MODAL */}
      {showLogin && <LoginModal close={() => setShowLogin(false)} />}

    </Router>
  );
}

export default App;