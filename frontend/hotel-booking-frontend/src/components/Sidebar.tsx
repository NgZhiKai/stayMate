import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  // ✅ Persistent state for expanding/collapsing the "User Account Settings" section
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    const saved = localStorage.getItem("settingsMenuOpen");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("settingsMenuOpen", JSON.stringify(isSettingsOpen));
  }, [isSettingsOpen]);

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

        {/* ✅ Expandable Section: User Account Settings */}
        <div className="hover:bg-gray-700 p-2 rounded">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full text-left flex justify-between p-2 rounded hover:bg-gray-700"
          >
            🛠️ User Account Settings
            <span>{isSettingsOpen ? "▲" : "▼"}</span>
          </button>

          {/* ✅ Collapsible Sub-menu */}
          {isSettingsOpen && (
            <div className="ml-4 flex flex-col space-y-2">
              <Link to="/user-account-settings" className="hover:bg-gray-700 p-2 rounded">
                ⚙️ Settings
              </Link>
              <Link to="/saved-hotels" className="hover:bg-gray-700 p-2 rounded">
                🏨 Saved Hotels
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
