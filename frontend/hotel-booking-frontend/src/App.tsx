import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="flex">
        {/* ✅ Sidebar with working toggle */}
        <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

        {/* ✅ Main Content (Prevents shifting issues) */}
        <div
          className={`flex-grow p-4 transition-all duration-300 ${
            isOpen ? "ml-64 md:ml-64" : "ml-0 md:ml-64"
          }`}
        >
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
