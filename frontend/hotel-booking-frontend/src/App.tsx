import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
// import AccountPage from "./Pages/AccountPage";
import NearMePage from "./Pages/NearMePage";
import RegisterPage from "./Pages/RegisterPage";
import UserAccountSettings from "./Pages/UserAccountSettings";
import SavedHotels from "./Pages/SavedHotelsPage";
import HotelDetailsPage from "./Pages/HotelDetailsPage";
import LoginPage from "./Pages/LoginPage";
import LogOutPage from "./Pages/LogoutPage";
import VerifyEmailPage from "./Pages/VerficationPage";
import AdminHotelPage from "./Pages/AdminHotelPage";
import AdminCreateHotelPage from "./Pages/AdminCreateHotelPage";
import BookingPage from './Pages/BookingPage';
import CreateBookingPage from './Pages/CreateBookingPage';
import { AuthProvider } from "./contexts/AuthContext";


const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header toggleSidebar={() => setIsOpen(!isOpen)} />
          <div className="flex flex-1 pt-16">
            <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
            <div className={`flex-1 transition-all duration-300 p-4 ${isOpen ? "ml-64" : "ml-0"}`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/nearme" element={<NearMePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/user-account-settings" element={<UserAccountSettings />} />
                <Route path="/saved-hotels" element={<SavedHotels />} />
                <Route path="/hotel/:id" element={<HotelDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogOutPage />} />
                <Route path="/verify" element={<VerifyEmailPage />} />
                <Route path="/admin/hotels" element={<AdminHotelPage />} />
                <Route path="/admin/hotels/create" element={<AdminCreateHotelPage />} />
                <Route path="/bookings" element={<BookingPage />} />
                <Route path="/create-bookings/:hotelId" element={<CreateBookingPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
