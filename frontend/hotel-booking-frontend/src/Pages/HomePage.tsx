import React, { useState } from "react";
import { FiMenu, FiX, FiHome, FiMapPin, FiUser } from "react-icons/fi"; // Import icons

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-700">StayMate</h2>
          <FiX
            className="text-gray-700 cursor-pointer md:hidden"
            size={24}
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer">
              <FiHome size={20} />
              <span>Homepage</span>
            </li>
            <li className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer">
              <FiMapPin size={20} />
              <span>Near Me</span>
            </li>
            <li className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer">
              <FiUser size={20} />
              <span>Account</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Navbar for Mobile */}
        <div className="bg-white p-4 shadow-md md:hidden flex items-center">
          <FiMenu size={24} className="cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
          <h2 className="text-lg font-bold ml-4">StayMate</h2>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Find Your Perfect Stay</h1>

          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            {/* Location Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter city or hotel name"
              />
            </div>

            {/* Check-in & Check-out Dates */}
            <div className="flex gap-4">
              <div className="mb-4 flex-1">
                <label className="block text-gray-700 font-medium">Check-in</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4 flex-1">
                <label className="block text-gray-700 font-medium">Check-out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              onClick={() => alert(`Searching hotels in ${location} from ${checkInDate} to ${checkOutDate}`)}
            >
              Find Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
