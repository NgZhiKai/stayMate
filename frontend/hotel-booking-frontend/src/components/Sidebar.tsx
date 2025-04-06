import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const { isLoggedIn, role } = useContext(AuthContext);

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white p-6 transition-all duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-3">
        {/* Conditional rendering based on login status */}
        {(role === null || role === "customer") && (
          <>
            <Link to="/" className="hover:bg-gray-700 p-2 rounded">🏠 Hotels</Link>
            <Link to="/nearme" className="hover:bg-gray-700 p-2 rounded">📍 Near Me</Link>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" className="hover:bg-gray-700 p-2 rounded">🔐 Login</Link>
            <Link to="/register" className="hover:bg-gray-700 p-2 rounded">📝 Register</Link>
          </>
        )}

        {isLoggedIn && role === "customer" && (
          <>
            <Link to="/account" className="hover:bg-gray-700 p-2 rounded">🧑‍💼 Account</Link>
            <Link to="/bookings" className="hover:bg-gray-700 p-2 rounded">📆 My Bookings</Link>
            <Link to="/user-account-settings" className="hover:bg-gray-700 p-2 rounded">⚙️ User Settings</Link>
            <Link to="/logout" className="hover:bg-gray-700 p-2 rounded">🚪 Logout</Link>
          </>
        )}

        {isLoggedIn && role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="hover:bg-gray-700 p-2 rounded">📊 Dashboard</Link>
            <Link to="/" className="hover:bg-gray-700 p-2 rounded">🏨 Manage Hotels</Link>
            <Link to="/admin/users" className="hover:bg-gray-700 p-2 rounded">👥 Manage Users</Link>
            <Link to="/admin/payments" className="hover:bg-gray-700 p-2 rounded">💳 Payments Overview</Link>
            <Link to="/admin/bookings" className="hover:bg-gray-700 p-2 rounded">📝 Bookings Summary</Link>
            <Link to="/user-account-settings" className="hover:bg-gray-700 p-2 rounded">⚙️ Admin Settings</Link>
            <Link to="/logout" className="hover:bg-gray-700 p-2 rounded">🚪 Logout</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
