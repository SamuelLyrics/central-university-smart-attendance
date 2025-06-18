import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 pb-16">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-university-blue text-white flex justify-around items-center py-2 z-50 shadow-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "flex flex-col items-center px-2" +
            (isActive ? " text-university-gold" : "")
          }
        >
          <span className="material-icons">home</span>
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/mark-attendance"
          className={({ isActive }) =>
            "flex flex-col items-center px-2" +
            (isActive ? " text-university-gold" : "")
          }
        >
          <span className="material-icons">check_circle</span>
          <span className="text-xs">Attendance</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            "flex flex-col items-center px-2" +
            (isActive ? " text-university-gold" : "")
          }
        >
          <span className="material-icons">person</span>
          <span className="text-xs">Profile</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center px-2 focus:outline-none"
        >
          <span className="material-icons">logout</span>
          <span className="text-xs">Logout</span>
        </button>
      </nav>
      {/* Google Material Icons CDN */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
};

export default MobileLayout;