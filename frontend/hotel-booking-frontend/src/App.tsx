import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AdminPaymentsPage from "./Pages/AdminPaymentsPage";
import BookedHotelsPage from "./Pages/BookedHotelsPage";
import BookingPage from './Pages/BookingPage';
import CreateBookingPage from './Pages/CreateBookingPage';
import CreateUpdateHotelPage from "./Pages/CreateUpdateHotelPage";
import HomePage from "./Pages/HomePage";
import HotelDetailsPage from "./Pages/HotelDetailsPage";
import LoginPage from "./Pages/LoginPage";
import LogOutPage from "./Pages/LogoutPage";
import ManageBookingsPage from './Pages/ManageBookingsPage';
import ManageUsersPage from './Pages/ManageUsersPage';
import MyPaymentsPage from './Pages/MyPaymentsPage';
import NearMePage from "./Pages/NearMePage";
import NotifcationsPage from "./Pages/NotificationPage";
import PaymentPage from "./Pages/PaymentPage";
import RegisterPage from "./Pages/RegisterPage";
import UserAccountSettings from "./Pages/UserAccountSettings";
import VerifyEmailPage from "./Pages/VerficationPage";

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
      <NotificationProvider>
        <Router basename={import.meta.env.BASE_URL}>
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
                  <Route path="/hotel/:id" element={<HotelDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/logout" element={<LogOutPage />} />
                  <Route path="/verify" element={<VerifyEmailPage />} />
                  <Route path="/admin/users" element={<ManageUsersPage />} />
                  <Route path="/admin/bookings" element={<ManageBookingsPage />} />
                  <Route path="/create-hotel/:id?" element={<CreateUpdateHotelPage />} />
                  <Route path="/bookings" element={<BookingPage />} />
                  <Route path="/create-bookings/:hotelId" element={<CreateBookingPage />} />
                  <Route path="/booked-hotels" element={<BookedHotelsPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/notifications" element={<NotifcationsPage />} />
                  <Route path="/my-payments" element={<MyPaymentsPage />} />
                  <Route path="/admin/payments" element={<AdminPaymentsPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
