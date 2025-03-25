import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`bg-dark text-white vh-100 position-fixed top-0 start-0 w-20 transition-all ${
        isOpen ? "translate-x-0" : "-translate-x-100"
      }`}
      style={{ zIndex: 1000 }}
    >
      <h2 className="p-3">StayMate</h2>
      <nav className="d-flex flex-column p-3">
        <Link
          to="/"
          className="text-white text-decoration-none mb-2"
          onClick={toggleSidebar}
        >
          🏠 Homepage
        </Link>
        <Link
          to="/nearme"
          className="text-white text-decoration-none mb-2"
          onClick={toggleSidebar}
        >
          📍 Near Me
        </Link>
        <Link
          to="/account"
          className="text-white text-decoration-none mb-2"
          onClick={toggleSidebar}
        >
          👤 Account
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;