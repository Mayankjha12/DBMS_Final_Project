import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

function Navbar({ setShowLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const logout = async () => {
    await signOut();
    navigate("/");
  };

  const linkStyle = (path) =>
    `relative hover:text-purple-600 transition ${
      location.pathname === path
        ? "text-purple-600 font-semibold"
        : "text-gray-700"
    }`;

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/40">

      {/* LOGO */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          ✨
        </div>
        <h1 className="text-xl font-bold text-purple-600">
          LearnCircle
        </h1>
      </div>

      {/* LINKS */}
      <div className="flex gap-8 text-sm font-medium">

        <Link to="/" className={linkStyle("/")}>
          Home
        </Link>

        <Link to="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/create" className={linkStyle("/create")}>
          Create
        </Link>

        <Link to="/profile" className={linkStyle("/profile")}>
          Profile
        </Link>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {!isLoaded ? null : user ? (
          <>
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-9 h-9 rounded-full"
            />

            <span className="font-medium">
              {user.firstName || "User"}
            </span>

            <button
              onClick={logout}
              className="bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </button>
        )}

      </div>
    </div>
  );
}

export default Navbar;