import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; // ✅ Import the new header

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* ✅ Fixed Top Header */}
        <Header toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="flex flex-1 pt-16">
          {/* ✅ Sidebar */}
          <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

          {/* ✅ Main Content (Prevents overlap with header) */}
          <div className={`flex-1 transition-all duration-300 p-4 ${isOpen ? "ml-64" : "ml-0"}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/nearme" element={<h1>Near Me Page</h1>} />
              <Route path="/account" element={<h1>Account Page</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
