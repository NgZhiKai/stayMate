import React from "react";
import { FiMenu } from "react-icons/fi";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center px-4 shadow-md z-50">
      {/* Sidebar Toggle Button inside header */}
      <button onClick={toggleSidebar} className="text-white p-2 rounded-md focus:outline-none">
        <FiMenu size={24} />
      </button>

      {/* Page Title */}
      <h1 className="ml-4 text-lg font-semibold">StayMate</h1>
    </header>
  );
};

export default Header;
