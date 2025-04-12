import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { Notification } from '../types/Notification';

// Define the response structure that contains a `data` field
interface NotificationResponse {
  data: Notification[]; // This is where your actual notifications are stored
}

const API_BASE_URL = `${BASE_URL}/notifications`;

const NotificationApi = {
  // Get all notifications for a specific user
  getNotificationsByUserId: async (userId: number) => {
    try {
      const response = await axios.get<NotificationResponse>(`${API_BASE_URL}/user/${userId}`);
      return response.data.data; // Now it can safely access response.data.data
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      throw new Error(error?.response?.data?.message || 'Error fetching notifications');
    }
  },

  // Get read notifications for a specific user
  getReadNotificationsByUserId: async (userId: number) => {
    try {
      const response = await axios.get<NotificationResponse>(`${API_BASE_URL}/user/${userId}/read`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch read notifications:', error);
      throw new Error(error?.response?.data?.message || 'Error fetching read notifications');
    }
  },

  // Get unread notifications for a specific user
  getUnreadNotificationsByUserId: async (userId: number) => {
    try {
      const response = await axios.get<NotificationResponse>(`${API_BASE_URL}/user/${userId}/unread`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch unread notifications:', error);
      throw new Error(error?.response?.data?.message || 'Error fetching unread notifications');
    }
  },

  // Mark a notification as read
  markNotificationAsRead: async (notificationId: number) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${notificationId}/read`);
      return response.data.data; // Assuming the response is structured similarly
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
      throw new Error(error?.response?.data?.message || 'Error marking notification as read');
    }
  },

  // Get notifications by type for a specific user
  getNotificationsByType: async (userId: number, type: string) => {
    try {
      const response = await axios.get<NotificationResponse>(`${API_BASE_URL}/user/${userId}/type/${type}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch notifications by type:', error);
      throw new Error(error?.response?.data?.message || 'Error fetching notifications by type');
    }
  },

  // Send a promotion notification to all users
  sendPromotionNotificationToAllUsers: async (promotionMessage: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/promotion`, { promotionMessage });
      return response.data.data; // Assuming success response contains data field
    } catch (error: any) {
      console.error('Failed to send promotion notification:', error);
      throw new Error(error?.response?.data?.message || 'Error sending promotion notification');
    }
  },
};

export default NotificationApi;
