import React from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md md:hidden"
        onClick={toggleSidebar}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4">StayMate</h2>
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
    </>
  );
};

export default Sidebar;