import React from "react";
import { Link } from "react-router-dom";
import { FiX, FiMenu } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed h-full w-64 bg-gray-900 text-white p-6 transition-all duration-300 z-40
      ${isOpen ? "left-0" : "-left-64"}`}
    >
      {/* Toggle Button - ALWAYS VISIBLE */}
      <button
        onClick={toggleSidebar}
        className={`absolute p-2 bg-blue-600 text-white rounded-md
          ${isOpen ? "right-4 top-4" : "right-[-40px] top-4"}`}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <h2 className="text-xl font-bold mb-4 mt-2">StayMate</h2>
      <nav className="flex flex-col space-y-3">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">
          🏠 Homepage
        </Link>
        <Link to="/nearme" className="hover:bg-gray-700 p-2 rounded">
          📍 Near Me
        </Link>
        <Link to="/account" className="hover:bg-gray-700 p-2 rounded">
          🧑‍💼 Account
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;