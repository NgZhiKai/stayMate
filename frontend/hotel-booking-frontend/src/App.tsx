import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import "./index.css";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <Router>
      <div className="d-flex">
        {/* Fixed Sidebar */}
        <div
          className={`bg-dark text-white vh-100 position-fixed top-0 start-0 sidebar-15 ${
            isSidebarOpen ? "" : "sidebar-closed"
          }`}
        >
          <h2 className="p-3">StayMate</h2>
          <nav className="d-flex flex-column p-3">
            <Link to="/" className="text-white text-decoration-none mb-2">
              🏠 Homepage
            </Link>
            <Link to="/nearme" className="text-white text-decoration-none mb-2">
              📍 Near Me
            </Link>
            <Link to="/account" className="text-white text-decoration-none mb-2">
              👤 Account
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow-1 main-content-15 p-3 ${
            isSidebarOpen ? "" : "main-content-full"
          } pt-5`} // Add pt-5 for padding-top
        >
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`btn btn-primary position-fixed top-0 ${
              isSidebarOpen ? "start-15" : "start-0"
            } m-3 rounded-circle`}
            style={{ width: "40px", height: "40px", zIndex: 1000 }}
          >
            {isSidebarOpen ? "◄" : "►"}
          </button>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nearme" element={<h1>Near Me Page</h1>} />
            <Route path="/account" element={<h1>Account Page</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;