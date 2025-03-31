import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AccountPage from "./Pages/AccountPage";
import NearMePage from "./Pages/NearMePage";
import RegisterPage from "./Pages/RegisterPage";

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
              <Route path="/nearme" element={<NearMePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
