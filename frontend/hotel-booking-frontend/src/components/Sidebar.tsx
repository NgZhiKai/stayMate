import {
  Bell,
  Calendar,
  ClipboardList,
  CreditCard,
  Home,
  Hotel,
  LogIn,
  LogOut,
  MapPin,
  Settings,
  UserPlus,
  CheckCircle,
  Users
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useNotificationContext } from "../contexts/NotificationContext";

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen }) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const { notifications } = useNotificationContext();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isread).length;

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white p-6 transition-all duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-3">
        {(role === null || role === "customer") && (
          <>
            <Link
              to="/"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Home size={18} /> Hotels
            </Link>
            <Link
              to="/nearme"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <MapPin size={18} /> Near Me
            </Link>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <LogIn size={18} /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <UserPlus size={18} /> Register
            </Link>
            <Link
              to="/verify"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <CheckCircle size={18} /> Verify
            </Link>
          </>
        )}

        {isLoggedIn && role === "customer" && (
          <>
            <Link
              to="/notifications"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">{unreadCount}</span>
              )}
            </Link>
            <Link
              to="/bookings"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Calendar size={18} /> My Bookings
            </Link>
            <Link
              to="/my-payments"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <CreditCard size={18} /> My Payments
            </Link>
            <Link
              to="/user-account-settings"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Settings size={18} /> User Settings
            </Link>
            <Link
              to="/logout"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <LogOut size={18} /> Logout
            </Link>
          </>
        )}

        {isLoggedIn && role === "admin" && (
          <>
            {/* Admin Links */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Hotel size={18} /> Manage Hotels
            </Link>
            <Link
              to="/nearme"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <MapPin size={18} /> Near Me
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">{unreadCount}</span>
              )}
            </Link>
            <Link
              to="/bookings"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Calendar size={18} /> My Bookings
            </Link>

            {/* Dropdown toggle for admin links */}
            <div>
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded w-full text-left transition-all duration-200"
              >
                <ClipboardList size={18} /> Admin Actions
              </button>
              {isAdminDropdownOpen && (
                <div className="pl-6 space-y-2">
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
                  >
                    <Users size={18} /> Manage Users
                  </Link>
                  <Link
                    to="/admin/payments"
                    className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
                  >
                    <CreditCard size={18} /> Payments Overview
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
                  >
                    <ClipboardList size={18} /> Bookings Summary
                  </Link>
                </div>
              )}
            </div>

            {/* Admin settings link */}
            <Link
              to="/user-account-settings"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <Settings size={18} /> Admin Settings
            </Link>
            <Link
              to="/logout"
              className="flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:scale-105 p-2 rounded transition-all duration-200"
            >
              <LogOut size={18} /> Logout
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
