import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-university-light-gray">
      {/* Sidebar */}
      <aside className="w-56 bg-university-blue text-white flex flex-col py-8 px-4">
        <NavLink
          to="/"
          className="mb-4 font-semibold hover:text-university-gold block"
        >
          Home
        </NavLink>
        <NavLink
          to="/mark-attendance"
          className="mb-4 font-semibold hover:text-university-gold block"
        >
          Mark Attendance
        </NavLink>
        <NavLink
          to="/register-student"
          className="mb-4 font-semibold hover:text-university-gold block"
        >
          Student Registration
        </NavLink>
        <NavLink
          to="/students"
          className="mb-4 font-semibold hover:text-university-gold block"
        >
          Student List
        </NavLink>
        <NavLink
          to="/statistics"
          className="mb-4 font-semibold hover:text-university-gold block"
        >
          Statistics
        </NavLink>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with logout */}
        <header className="flex justify-end items-center bg-white shadow px-6 py-4">
          <button
            onClick={handleLogout}
            className="bg-university-gold text-university-blue font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
