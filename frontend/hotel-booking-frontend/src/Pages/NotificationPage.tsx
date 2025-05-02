import { Bell, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNotificationContext } from "../contexts/NotificationContext";
import NotificationApi from "../services/notificationApi";

const ITEMS_PER_PAGE = 6;

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
    <div className="relative p-6 bg-gray-900 text-white min-h-full">
      {/* Title & Action */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>
  
      {/* Mark All as Read Button */}
      <button
        onClick={markAllAsRead}
        className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all transform focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
      >
        <CheckCircle size={20} className="mr-2 text-white" />
        Mark All as Read
      </button>


      {/* Notification List */}
      {currentNotifications.length === 0 ? (
        <div className="text-gray-400 text-center mt-20 text-sm">
          You have no notifications.
        </div>
      ) : (
        <ul className="space-y-3">
          {currentNotifications.map((notification) => (
            <li
              key={notification.notificationId}
              className={`flex items-start gap-2 p-3 rounded-lg shadow-sm transition ${
                notification.isread ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              <Bell size={18} className="mt-0.5 text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isread && (
                <button
                  onClick={() => markAsRead(notification.notificationId)}
                  disabled={markingId === notification.notificationId}
                  className="text-green-500 hover:text-green-400 disabled:opacity-50 transition"
                  aria-label="Mark as read"
                >
                  <CheckCircle size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
  
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-1 text-sm">
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
