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
  Users
} from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useNotificationContext } from "../contexts/NotificationContext";

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const { notifications } = useNotificationContext();

  // 👇 Realtime unread count from context
  const unreadCount = notifications.filter(n => !n.isread).length;

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white p-6 transition-all duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-3">
        {(role === null || role === "customer") && (
          <>
            <Link to="/" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Home size={18} /> Hotels
            </Link>
            <Link to="/nearme" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <MapPin size={18} /> Near Me
            </Link>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <LogIn size={18} /> Login
            </Link>
            <Link to="/register" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <UserPlus size={18} /> Register
            </Link>
          </>
        )}

        {isLoggedIn && role === "customer" && (
          <>
            <Link to="/notifications" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">{unreadCount}</span>
              )}
            </Link>
            <Link to="/bookings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Calendar size={18} /> My Bookings
            </Link>
            <Link to="/my-payments" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <CreditCard size={18} /> My Payments
            </Link>
            <Link to="/user-account-settings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Settings size={18} /> User Settings
            </Link>
            <Link to="/logout" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <LogOut size={18} /> Logout
            </Link>
          </>
        )}

        {isLoggedIn && role === "admin" && (
          <>
            <Link to="/" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Hotel size={18} /> Manage Hotels
            </Link>
            <Link to="/notifications" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">{unreadCount}</span>
              )}
            </Link>
            <Link to="/bookings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Calendar size={18} /> My Bookings
            </Link>
            <Link to="/admin/users" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Users size={18} /> Manage Users
            </Link>
            <Link to="/admin/payments" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <CreditCard size={18} /> Payments Overview
            </Link>
            <Link to="/admin/bookings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <ClipboardList size={18} /> Bookings Summary
            </Link>
            <Link to="/user-account-settings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <Settings size={18} /> Admin Settings
            </Link>
            <Link to="/logout" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <LogOut size={18} /> Logout
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
