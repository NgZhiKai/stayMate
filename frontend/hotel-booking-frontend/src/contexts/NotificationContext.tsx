import React, { createContext, useState, useEffect, useContext } from "react";
import NotificationApi from "../services/notificationApi";
import { Notification } from "../types/Notification";

interface NotificationContextType {
  notifications: Notification[];
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationContext not available");
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = async () => {
    const userId = Number(sessionStorage.getItem("userId"));
    if (!userId) return;
    const data = await NotificationApi.getNotificationsByUserId(userId);
    setNotifications(data);
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
