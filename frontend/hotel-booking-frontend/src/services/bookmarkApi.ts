import axios from 'axios';
import { BASE_URL } from '../constants/constants';  // Assuming your base URL is in this file

const API_BASE_URL = `${BASE_URL}/api/bookmarks`;

/**
 * Get all bookmarked hotel IDs for a user.
 */
export const getBookmarkedHotelIds = async (userId: string): Promise<number[] | { error: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data; // The backend returns a List<Long>, which we can handle as number[] in TypeScript
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

/**
 * Add a bookmark (supports adding multiple hotelIds but we'll just send one).
 */
export const addBookmark = async (userId: string, hotelId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, {
      userId: Number(userId),
      hotelIds: [hotelId], // Backend expects an array
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

/**
 * Remove a bookmark.
 */
export const removeBookmark = async (userId: string, hotelId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/remove`, {
      params: { userId, hotelId },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};
