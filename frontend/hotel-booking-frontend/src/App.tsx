import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import "./index.css"; // Import the CSS file

const App: React.FC = () => {
  return (
    <Router>
      <div className="d-flex">
        {/* Fixed Sidebar */}
        <div className="bg-dark text-white vh-100 position-fixed top-0 start-0 sidebar-15">
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
        <div className="flex-grow-1 main-content-15 p-3">
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