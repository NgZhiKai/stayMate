import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white p-6 transition-all duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-3">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">
          🏠 Hotels
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
