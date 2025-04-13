import { Bell, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNotificationContext } from "../contexts/NotificationContext";
import NotificationApi from "../services/notificationApi";

const ITEMS_PER_PAGE = 5;

const NotificationsPage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [markingId, setMarkingId] = useState<number | null>(null);

  // Use the notification context
  const { notifications, refreshNotifications } = useNotificationContext();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      const fetchNotifications = async () => {
        try {
          await NotificationApi.getNotificationsByUserId(userId);
        } catch (err) {
          setError("Failed to load notifications.");
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    try {
      setMarkingId(notificationId);
      await NotificationApi.markNotificationAsRead(notificationId);
      // After marking as read, refresh notifications
      await refreshNotifications();
    } catch (err) {
      setError("Failed to mark notification as read.");
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter((n) => !n.isread);
      for (const notification of unreadNotifications) {
        await NotificationApi.markNotificationAsRead(notification.notificationId);
      }
      await refreshNotifications(); // Refresh the notifications list
    } catch (err) {
      setError("Failed to mark all notifications as read.");
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isread === b.isread) {
      // Both read or both unread → sort by createdAt descending
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Unread first
    return a.isread ? 1 : -1;
  });
  
  const totalPages = Math.ceil(sortedNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = sortedNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-full relative">
      <h1 className="text-2xl mb-4">Notifications</h1>

      {/* Mark All as Read Button (Positioned at top-right) */}
      <button
        onClick={markAllAsRead}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded transition-all duration-300 transform hover:bg-blue-500 hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        Mark All as Read
      </button>

      {currentNotifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <ul className="space-y-4">
          {currentNotifications.map((notification) => (
            <li
              key={notification.notificationId}
              className={`flex items-center gap-2 p-3 rounded ${
                notification.isread ? "bg-gray-700" : "bg-gray-800"
              }`}
            >
              <Bell size={18} />
              <div className="flex-1">
                <p>{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isread && (
                <button
                  onClick={() => markAsRead(notification.notificationId)}
                  className="text-green-500 hover:text-green-400 disabled:opacity-50"
                  disabled={markingId === notification.notificationId}
                >
                  <CheckCircle size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
